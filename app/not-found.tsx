import Link from "next/link";

export default function NotFound() {
  return (
    <div id="wd-not-found">
      <h2>Page Not Found</h2>
      <p>
        The requested page could not be found. Please check the page URL or
        return to the dashboard.
      </p>
      <Link href="/dashboard" id="wd-not-found-dashboard-link">
        Back to Dashboard
      </Link>
    </div>
  );
}
