export type ContentStatus = "draft" | "published" | "archived" | "in_review";

export const CONTET_STATUS_OPTIONS = [
  {
    value: "published",
    label: "Published",
    color: "bg-[#10B981]",
  },
  {
    value: "in_review",
    label: "In Review",
    color: "bg-[#F5B731]",
  },
  {
    value: "draft",
    label: "Draft",
    color: "bg-[#94A3B8]",
  },
] satisfies {
  value: ContentStatus;
  label: string;
  color: string;
}[];
