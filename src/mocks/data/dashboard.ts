import type { DashboardTask } from "@/features/dashboard/model";
import { shiftDate } from "@/features/dashboard/model";
import { projectsFixture } from "./projects";

// 고정 기준일을 사용해 재방문과 테스트에서 같은 기간 비교를 제공한다.
export const dashboardAsOf = "2026-07-15";
const titles = [
  "요구사항 정리",
  "접근성 점검",
  "API 연동",
  "화면 구현",
  "테스트 작성",
  "문서 갱신",
];
export const dashboardTasks: DashboardTask[] = projectsFixture.flatMap(
  (project, projectIndex) =>
    Array.from({ length: [24, 18, 30, 24][projectIndex] ?? 24 }, (_, index) => {
      const completedCount = [18, 10, 14, 24][projectIndex] ?? 24;
      const completed = index < completedCount;
      const finish =
        project.status === "completed"
          ? shiftDate(project.dueDate, -(23 - index) * 4)
          : shiftDate(
              dashboardAsOf,
              -90 +
                Math.floor((index * 85) / Math.max(1, completedCount - 1)) +
                projectIndex * 2,
            );
      const dueDate = completed
        ? finish
        : shiftDate(
            dashboardAsOf,
            (index - completedCount - 1) * 2 + projectIndex,
          );
      return {
        id: `${project.id}-task-${index + 1}`,
        projectId: project.id,
        title: `${titles[index % titles.length]} ${Math.floor(index / titles.length) + 1}`,
        startDate: shiftDate(dueDate, -4 - projectIndex),
        dueDate,
        completedAt: completed ? dueDate : null,
        hours: 2 + ((index * 3 + projectIndex) % 7),
      };
    }),
);
