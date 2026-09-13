import { FolderOpen } from "lucide-react";
import type { Folder } from "@/features/media/model/media-schema";

export function FolderTree({
  folders,
  selected,
  onSelect,
}: {
  folders: Folder[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  function children(parentId: string | null, seen: string[]) {
    return (
      <ul className="ml-3 grid gap-1 border-l pl-2">
        {folders
          .filter(
            (folder) =>
              folder.parentId === parentId && !seen.includes(folder.id),
          )
          .map((folder) => (
            <li key={folder.id}>
              <button
                type="button"
                onClick={() => onSelect(folder.id)}
                aria-current={selected === folder.id ? "page" : undefined}
                className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm break-words ${selected === folder.id ? "bg-brand-soft text-brand" : "hover:bg-surface-muted"}`}
              >
                <FolderOpen aria-hidden className="size-4 shrink-0" />
                {folder.name}
              </button>
              {folders.some(
                (item) =>
                  item.parentId === folder.id && !seen.includes(item.id),
              ) && children(folder.id, [...seen, folder.id])}
            </li>
          ))}
      </ul>
    );
  }
  return (
    <nav aria-label="폴더 트리">
      <button
        type="button"
        className={`mb-3 w-full rounded px-3 py-2 text-left text-sm font-medium ${selected === "" ? "bg-brand-soft text-brand" : "hover:bg-surface-muted"}`}
        aria-current={selected === "" ? "page" : undefined}
        onClick={() => onSelect("")}
      >
        전체 파일
      </button>
      {children(null, [])}
    </nav>
  );
}
