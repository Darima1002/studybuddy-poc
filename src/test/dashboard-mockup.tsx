import { useMemo, useState } from "react";

// DESIGN MOCKUP ONLY.

// It shows what a calendar dashboard could look like in future iterations

type CourseName = "Intro to AI" | "Biology 101" | "Calculus II" | "English Comp";

type Assignment = {
  title: string;
  course: CourseName;
  daysFromToday: number;
};

const COURSE_STYLES: Record<CourseName, { dot: string; bar: string; pill: string }> = {
  "Intro to AI": {
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
    pill: "bg-indigo-100 text-indigo-700",
  },
  "Biology 101": {
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    pill: "bg-emerald-100 text-emerald-700",
  },
  "Calculus II": {
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    pill: "bg-amber-100 text-amber-700",
  },
  "English Comp": {
    dot: "bg-pink-500",
    bar: "bg-pink-500",
    pill: "bg-pink-100 text-pink-700",
  },
};

const COURSE_NAMES = Object.keys(COURSE_STYLES) as CourseName[];

const SAMPLE_ASSIGNMENTS: Assignment[] = [
  { title: "Problem Canvas worksheet", course: "Intro to AI", daysFromToday: 0 },
  { title: "Lab report: cell division", course: "Biology 101", daysFromToday: 0 },
  { title: "Reading response #4", course: "English Comp", daysFromToday: 1 },
  { title: "Problem set 6", course: "Calculus II", daysFromToday: 2 },
  { title: "Quiz: NLP basics", course: "Intro to AI", daysFromToday: 3 },
  { title: "Lab prep questions", course: "Biology 101", daysFromToday: 5 },
  { title: "Essay draft", course: "English Comp", daysFromToday: 6 },
  { title: "Midterm review sheet", course: "Calculus II", daysFromToday: 7 },
  { title: "Group project outline", course: "Intro to AI", daysFromToday: 11 },
  { title: "Chapter 9 homework", course: "Biology 101", daysFromToday: 16 },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDay(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export default function DashboardMockup() {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  const [selected, setSelected] = useState<Date>(today);
  const [viewMonth, setViewMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const assignments = useMemo(
    () => SAMPLE_ASSIGNMENTS.map((a) => ({ ...a, date: addDays(today, a.daysFromToday) })),
    [today],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, typeof assignments>();
    for (const a of assignments) {
      const key = dayKey(a.date);
      map.set(key, [...(map.get(key) ?? []), a]);
    }
    return map;
  }, [assignments]);

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const start = addDays(firstOfMonth, -firstOfMonth.getDay());
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [viewMonth]);

  const dueOnSelected = byDay.get(dayKey(selected)) ?? [];

  const nextWeekStart = addDays(selected, 1);
  const nextWeekEnd = addDays(selected, 7);
  const dueNextWeek = assignments
    .filter((a) => a.date >= nextWeekStart && a.date <= nextWeekEnd)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const isToday = dayKey(selected) === dayKey(today);

  function changeMonth(amount: number) {
    setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + amount, 1));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b bg-yellow-50 px-4 py-1.5 text-center text-xs text-yellow-800">
        Design mockup with sample data. Not connected to the real app or database.
      </div>

      <header className="flex items-center justify-between border-b bg-card px-6 py-4">
        <h1 className="text-xl font-bold text-card-foreground">StudyBuddy</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>student@example.com</span>
          <button
            type="button"
            className="rounded-md border px-3 py-1.5 text-card-foreground transition-colors hover:bg-muted"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-5 p-5 md:grid-cols-[1.05fr_1fr]">
        {/* Calendar */}
        <section className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-card-foreground">
              {viewMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => changeMonth(-1)}
                className="h-8 w-8 rounded-md border transition-colors hover:bg-muted"
              >
                &lsaquo;
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() => changeMonth(1)}
                className="h-8 w-8 rounded-md border transition-colors hover:bg-muted"
              >
                &rsaquo;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {WEEKDAYS.map((name) => (
              <div
                key={name}
                className="py-1 text-center text-[11px] uppercase text-muted-foreground"
              >
                {name}
              </div>
            ))}

            {calendarDays.map((day) => {
              const inMonth = day.getMonth() === viewMonth.getMonth();
              const isSelected = dayKey(day) === dayKey(selected);
              const isTodayCell = dayKey(day) === dayKey(today);
              const dayAssignments = byDay.get(dayKey(day)) ?? [];

              return (
                <button
                  key={dayKey(day)}
                  type="button"
                  onClick={() => setSelected(day)}
                  className={[
                    "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border text-sm transition-colors",
                    isSelected
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-transparent hover:bg-muted",
                    !isSelected && isTodayCell ? "border-primary font-bold" : "",
                    !inMonth && !isSelected ? "text-muted-foreground/50" : "",
                  ].join(" ")}
                >
                  <span>{day.getDate()}</span>
                  <span className="flex h-1.5 gap-0.5">
                    {dayAssignments.slice(0, 3).map((a) => (
                      <span
                        key={a.title}
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          isSelected ? "bg-primary-foreground" : COURSE_STYLES[a.course].dot,
                        ].join(" ")}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
            {COURSE_NAMES.map((name) => (
              <span key={name} className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${COURSE_STYLES[name].dot}`} />
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* Lists */}
        <div className="flex flex-col gap-5">
          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-card-foreground">
              {isToday ? "Due today" : `Due on ${formatDay(selected)}`}
            </h2>
            <p className="mb-3 text-sm text-muted-foreground">{formatDay(selected)}</p>
            <ul className="flex flex-col gap-2">
              {dueOnSelected.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing due on this day.</li>
              )}
              {dueOnSelected.map((a) => (
                <AssignmentRow key={a.title} title={a.title} course={a.course} />
              ))}
            </ul>
          </section>

          <section className="rounded-xl border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-card-foreground">Due in the next 7 days</h2>
            <p className="mb-3 text-sm text-muted-foreground">
              Assignments coming up after the selected day, with their class.
            </p>
            <ul className="flex flex-col gap-2">
              {dueNextWeek.length === 0 && (
                <li className="text-sm text-muted-foreground">Nothing due in the next 7 days.</li>
              )}
              {dueNextWeek.map((a) => (
                <AssignmentRow
                  key={a.title}
                  title={a.title}
                  course={a.course}
                  dueLabel={formatDay(a.date)}
                />
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

function AssignmentRow({
  title,
  course,
  dueLabel,
}: {
  title: string;
  course: CourseName;
  dueLabel?: string;
}) {
  const style = COURSE_STYLES[course];

  return (
    <li className="flex items-center gap-3 rounded-lg border px-3 py-2.5">
      <span className={`h-9 w-1 rounded-full ${style.bar}`} />
      <div className="flex-1">
        <p className="text-sm font-medium text-card-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">
          {course}
          {dueLabel ? ` · due ${dueLabel}` : ""}
        </p>
      </div>
      <span className={`rounded-full px-2.5 py-0.5 text-xs ${style.pill}`}>{course}</span>
    </li>
  );
}
