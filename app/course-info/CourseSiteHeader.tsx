import { isClerkPublishableKeySet } from "@/lib/config";
import "../book/book.css";
import CourseSiteChrome from "./CourseSiteChrome";

export default function CourseSiteHeader() {
  return <CourseSiteChrome authEnabled={isClerkPublishableKeySet()} />;
}
