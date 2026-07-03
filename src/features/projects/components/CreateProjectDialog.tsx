import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  createProjectSchema,
  type CreateProjectFormValues,
} from "@/features/projects/model/project-schema";
import { useCreateProjectMutation } from "@/features/projects/queries/project-queries";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";

const defaultValues: CreateProjectFormValues = {
  name: "",
  owner: "",
  status: "active",
  dueDate: "",
  description: "",
};

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const mutation = useCreateProjectMutation();
  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  });
  const errors = form.formState.errors;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      form.reset(defaultValues);
      mutation.reset();
    }
  }

  async function onSubmit(values: CreateProjectFormValues) {
    try {
      await mutation.mutateAsync(values);
      handleOpenChange(false);
    } catch {
      // mutation.isError가 inline 오류 메시지를 담당한다.
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button">
          <Plus className="size-4" aria-hidden="true" />
          프로젝트 생성
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>프로젝트 생성</DialogTitle>
        <DialogDescription className="mt-1 text-sm text-slate-500">
          샘플 mutation과 form validation을 확인할 수 있습니다.
        </DialogDescription>
        <form
          className="mt-5 grid gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid gap-1.5">
            <Label htmlFor="name">프로젝트 이름</Label>
            <Input
              id="name"
              {...form.register("name")}
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? true : undefined}
            />
            {errors.name ? (
              <p id="name-error" className="text-sm text-red-600" role="alert">
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="owner">담당자</Label>
            <Input
              id="owner"
              {...form.register("owner")}
              aria-describedby={errors.owner ? "owner-error" : undefined}
              aria-invalid={errors.owner ? true : undefined}
            />
            {errors.owner ? (
              <p id="owner-error" className="text-sm text-red-600" role="alert">
                {errors.owner.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="status">상태</Label>
            <Select
              id="status"
              className="w-full"
              {...form.register("status")}
              aria-describedby={errors.status ? "status-error" : undefined}
              aria-invalid={errors.status ? true : undefined}
            >
              <option value="active">진행 중</option>
              <option value="paused">일시 중지</option>
              <option value="completed">완료</option>
            </Select>
            {errors.status ? (
              <p
                id="status-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.status.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="dueDate">마감일</Label>
            <Input
              id="dueDate"
              type="date"
              {...form.register("dueDate")}
              aria-describedby={errors.dueDate ? "dueDate-error" : undefined}
              aria-invalid={errors.dueDate ? true : undefined}
            />
            {errors.dueDate ? (
              <p
                id="dueDate-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.dueDate.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="description">설명</Label>
            <Input
              id="description"
              {...form.register("description")}
              aria-describedby={
                errors.description ? "description-error" : undefined
              }
              aria-invalid={errors.description ? true : undefined}
            />
            {errors.description ? (
              <p
                id="description-error"
                className="text-sm text-red-600"
                role="alert"
              >
                {errors.description.message}
              </p>
            ) : null}
          </div>
          {mutation.isError ? (
            <p className="text-sm text-red-600" role="alert">
              프로젝트를 생성하지 못했습니다.
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                취소
              </Button>
            </DialogClose>
            <Button type="submit" disabled={mutation.isPending}>
              저장
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
