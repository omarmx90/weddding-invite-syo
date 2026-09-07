import type { EditorialChapter } from "@/content/editorial-types";

type ChapterMarkProps = {
  chapter: EditorialChapter;
  align?: "start" | "center";
  className?: string;
};

export function ChapterMark({
  chapter,
  align = "center",
  className = "",
}: ChapterMarkProps) {
  return (
    <div
      className={`chapter-mark ${align === "center" ? "chapter-mark--center" : ""} ${className}`}
      aria-hidden="true"
    >
      <span className="chapter-number">{chapter.number}</span>
      <span className="chapter-label">{chapter.label}</span>
    </div>
  );
}
