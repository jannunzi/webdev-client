import { A1_LAB_EXERCISES, a1LabVerifyPaths } from "./a1-lab-exercises";
import { deployOriginFromUrl, urlOnDeployOrigin } from "./urls";

/**
 * Path on the student deploy that graders should open for a criterion.
 * Labs work lives on /labs and /labs/lab1; Kambaz screens use seed paths.
 */
export const A1_CRITERION_VERIFY_PATHS: Record<string, string> = {
  "a1-delivery-vercel": "/",
  "a1-delivery-name-section": "/labs",
  "a1-delivery-github": "/labs",
  ...a1LabVerifyPaths(),
  "a1-kambaz-account": "/account/signin",
  "a1-kambaz-dashboard": "/dashboard",
  "a1-kambaz-nav": "/dashboard",
  "a1-kambaz-course-nav": "/courses/1234/home",
  "a1-kambaz-modules": "/courses/1234/modules",
  "a1-kambaz-home": "/courses/1234/home",
  "a1-kambaz-assignments": "/courses/1234/assignments",
  "a1-kambaz-editor": "/courses/1234/assignments/123",
};

export function criterionVerifyPath(criterionId: string): string | undefined {
  return A1_CRITERION_VERIFY_PATHS[criterionId];
}

/**
 * Kambaz screen wrappers. Navigation rows stay path-only: those ids sit in
 * the chrome, not a section to scroll to.
 */
const A1_KAMBAZ_VERIFY_HASH: Record<string, string> = {
  "a1-kambaz-account": "wd-signin-screen",
  "a1-kambaz-dashboard": "wd-dashboard",
  "a1-kambaz-modules": "wd-modules",
  "a1-kambaz-home": "wd-home",
  "a1-kambaz-assignments": "wd-assignments",
  "a1-kambaz-editor": "wd-assignments-editor",
};

/** Id fragment for a criterion, without a leading #. */
export function criterionVerifyHash(criterionId: string): string | undefined {
  const exercise = A1_LAB_EXERCISES.find((row) => row.id === criterionId);
  if (exercise) {
    const explicit = exercise.verifyHash?.replace(/^#/, "").trim();
    if (explicit) return explicit;
    const fromCheck = exercise.auto?.requireAllIds?.[0]?.trim();
    if (fromCheck) return fromCheck;
    return undefined;
  }
  return A1_KAMBAZ_VERIFY_HASH[criterionId];
}

export function criterionVerifyUrl(
  deployUrl: string | undefined,
  criterionId: string,
): string | null {
  if (!deployUrl) return null;
  const origin = deployOriginFromUrl(deployUrl);
  if (!origin.ok) return null;
  const path = criterionVerifyPath(criterionId);
  if (!path) return null;
  const href = urlOnDeployOrigin(origin.href, path);
  const hash = criterionVerifyHash(criterionId);
  return hash ? `${href}#${hash}` : href;
}
