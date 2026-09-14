import { describe, expect, it } from "vitest";
import {
  calendarDays,
  eventInputSchema,
  conflicts,
  moveEvent,
  shiftDate,
} from "./calendar";

describe("calendar arithmetic", () => {
  it("crosses month and leap-year boundaries", () => {
    expect(shiftDate("2024-02-28", 1)).toBe("2024-02-29");
    expect(shiftDate("2024-12-31", 1)).toBe("2025-01-01");
    expect(calendarDays("2024-02-29", "month")).toHaveLength(42);
    expect(calendarDays("2024-02-29", "week")[0]).toBe("2024-02-25");
    expect(calendarDays("2026-03-01", "month")[0]).toBe("2026-03-01");
  });
  it("rejects invalid dates and reversed ranges", () => {
    expect(
      eventInputSchema.safeParse({
        title: "회의",
        start: "2024-02-30T10:00",
        end: "2024-03-01T11:00",
        description: "",
      }).success,
    ).toBe(false);
    expect(
      eventInputSchema.safeParse({
        title: "회의",
        start: "2024-03-01T11:00",
        end: "2024-03-01T10:00",
        description: "",
      }).success,
    ).toBe(false);
  });
  it("detects overlaps, permits adjacent events and preserves duration on moves", () => {
    const event = {
      id: "one",
      title: "회의",
      start: "2024-02-29T23:00",
      end: "2024-03-01T01:00",
      description: "",
    };
    expect(moveEvent(event, "2024-03-02T10:00")).toMatchObject({
      start: "2024-03-02T10:00",
      end: "2024-03-02T12:00",
    });
    expect(
      conflicts({ ...event, id: "two", start: "2024-03-01T00:00" }, [event]),
    ).toHaveLength(1);
    expect(
      conflicts(
        { ...event, id: "two", start: event.end, end: "2024-03-01T02:00" },
        [event],
      ),
    ).toHaveLength(0);
    expect(conflicts(event, [event])).toHaveLength(0);
  });
});
