import { a1LabVerifyPaths } from "./a1-lab-exercises";
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

export function criterionVerifyUrl(
  deployUrl: string | undefined,
  criterionId: string,
): string | null {
  if (!deployUrl) return null;
  const origin = deployOriginFromUrl(deployUrl);
  if (!origin.ok) return null;
  const path = criterionVerifyPath(criterionId);
  if (!path) return null;
  return urlOnDeployOrigin(origin.href, path);
}
