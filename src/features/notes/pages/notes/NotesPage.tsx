import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  initialNotes,
  newNote,
  notesSchema,
} from "@/features/notes/model/notes";
import { NotePreview } from "@/features/notes/components/NotePreview";
import { PageHeader } from "@/shared/ui/page-header";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Card } from "@/shared/ui/card";
import { useLocalRecords } from "@/shared/lib/use-local-records";

export function NotesPage() {
  const {
    data: storedNotes,
    blocked,
    error,
    save,
  } = useLocalRecords("react-sample-notes-v1", notesSchema, initialNotes);

  const [notes, setNotes] = useState(storedNotes);

  const [selected, setSelected] = useState(storedNotes[0]!.id);

  const [filter, setFilter] = useState("");

  const [status, setStatus] = useState("");

  const form = useForm({ defaultValues: storedNotes[0]! });

  const current = useWatch({ control: form.control });
  useEffect(() => {
    if (blocked) return;
    const timer = window.setTimeout(() => {
      if (save(notes)) {
        setStatus("저장 완료 · 이 브라우저");
      } else {
        setStatus("저장 실패 · 저장 공간과 브라우저 설정을 확인하세요.");
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [blocked, notes, save]);
  function update() {
    const value = form.getValues();
    setNotes((items) =>
      items.map((note) => (note.id === selected ? value : note)),
    );
    setStatus("저장 대기 중…");
  }
  return (
    <section className="grid gap-6">
      <PageHeader
        title="노트 / 마크다운 에디터"
        description="실시간 미리보기와 500ms 자동 저장으로 생각을 정리하세요."
        actions={
          <Button
            disabled={blocked || notes.length >= 100}
            onClick={() => {
              const note = newNote();
              setNotes([...notes, note]);
              setSelected(note.id);
              form.reset(note);
              setStatus("저장 대기 중…");
            }}
          >
            새 노트
          </Button>
        }
      />
      {error && <p role="alert">{error}</p>}
      <p role="status" className="text-ink-subtle text-sm">
        {status}
      </p>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="space-y-3 p-4">
          <label className="grid gap-2 text-sm">
            노트 검색
            <Input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="제목 또는 태그"
            />
          </label>
          <ul className="space-y-2">
            {notes
              .filter((note) =>
                `${note.title} ${note.tags}`
                  .toLowerCase()
                  .includes(filter.toLowerCase()),
              )
              .map((note) => (
                <li key={note.id}>
                  <button
                    className="hover:bg-surface-muted border-line w-full rounded-lg border p-3 text-left break-words"
                    aria-pressed={note.id === selected}
                    onClick={() => {
                      setSelected(note.id);
                      form.reset(note);
                    }}
                  >
                    <span className="block font-medium">
                      {note.title || "제목 없음"}
                    </span>
                    <span className="text-ink-subtle text-xs">{note.tags}</span>
                  </button>
                </li>
              ))}
          </ul>
          {!notes.some((note) =>
            `${note.title} ${note.tags}`
              .toLowerCase()
              .includes(filter.toLowerCase()),
          ) && <p>검색 결과가 없습니다.</p>}
        </Card>
        <div className="grid min-w-0 gap-4">
          <form
            className="grid gap-4"
            onChange={update}
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="grid gap-2 text-sm">
              노트 제목
              <Input maxLength={100} {...form.register("title")} />
            </label>
            <label className="grid gap-2 text-sm">
              태그 (쉼표 구분)
              <Input maxLength={300} {...form.register("tags")} />
            </label>
            <div className="grid min-w-0 gap-4 xl:grid-cols-2">
              <label className="grid gap-2 text-sm">
                마크다운 본문
                <Textarea
                  className="min-h-96 font-mono"
                  maxLength={100000}
                  {...form.register("markdown")}
                />
              </label>
              <Card className="min-w-0 p-5">
                <h2 className="mb-4 font-semibold">실시간 미리보기</h2>
                <NotePreview source={current.markdown ?? ""} />
              </Card>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
