import { isClerkPublishableKeySet } from "@/lib/config";
import InlineEditController from "./InlineEditController";

/** Mounts the editor shell only when Clerk is configured. The probe still hides it from non-staff. */
export default function InlineEditMount() {
  if (!isClerkPublishableKeySet()) return null;
  return <InlineEditController />;
}
