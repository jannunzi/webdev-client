export type AssignmentCheckResult = {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  criterionId?: string;
  groupId?: string;
  skipped?: boolean;
};

export type HtmlFetchResult =
  | { ok: true; status: number; finalUrl: string; html: string }
  | {
      ok: false;
      status?: number;
      finalUrl?: string;
      html?: string;
      code: "auth_wall" | "http_error" | "network";
      message: string;
    };

export type UrlProbeResult =
  | { ok: true; status: number }
  | { ok: false; status?: number; message: string };

export type AssignmentCheckProbes = {
  getHtml: (url: string) => Promise<HtmlFetchResult>;
  probeUrl?: (url: string) => Promise<UrlProbeResult>;
};
