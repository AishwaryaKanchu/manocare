import { Router, type IRouter } from "express";
import { db, medicinesTable, medicineLogTable } from "@workspace/db";
import { eq, desc, asc } from "drizzle-orm";

const router: IRouter = Router();

function todayDateStr(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function timeToMinutes(t: string): number {
  const [hh, mm] = t.split(":").map(Number);
  return (hh ?? 0) * 60 + (mm ?? 0);
}

router.get("/log/today", async (_req, res) => {
  const date = todayDateStr();
  const meds = await db
    .select()
    .from(medicinesTable)
    .orderBy(asc(medicinesTable.time));
  const logs = await db
    .select()
    .from(medicineLogTable)
    .where(eq(medicineLogTable.date, date));

  const logsByMed = new Map<number, (typeof logs)[number]>();
  for (const l of logs) {
    const existing = logsByMed.get(l.medicineId);
    if (!existing || l.takenAt < existing.takenAt) logsByMed.set(l.medicineId, l);
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const result = meds.map((m) => {
    const log = logsByMed.get(m.id);
    if (log) {
      return {
        id: m.id,
        name: m.name,
        time: m.time,
        dosage: m.dosage,
        frequency: m.frequency,
        takenAt: log.takenAt.toISOString(),
        status: "taken" as const,
      };
    }
    const mins = timeToMinutes(m.time);
    const status = mins < nowMinutes - 30 ? "missed" : "pending";
    return {
      id: m.id,
      name: m.name,
      time: m.time,
      dosage: m.dosage,
      frequency: m.frequency,
      takenAt: null,
      status,
    };
  });

  res.json(result);
});

router.get("/dashboard/summary", async (_req, res) => {
  const date = todayDateStr();
  const meds = await db.select().from(medicinesTable);
  const logs = await db
    .select()
    .from(medicineLogTable)
    .where(eq(medicineLogTable.date, date));
  const takenIds = new Set(logs.map((l) => l.medicineId));
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  let taken = 0;
  let pending = 0;
  let missed = 0;
  for (const m of meds) {
    if (takenIds.has(m.id)) {
      taken += 1;
      continue;
    }
    const [hh, mm] = m.time.split(":").map(Number);
    const mins = (hh ?? 0) * 60 + (mm ?? 0);
    if (mins < nowMinutes - 30) missed += 1;
    else pending += 1;
  }

  const total = meds.length;
  const adherencePercent = total === 0 ? 100 : Math.round((taken / total) * 100);
  res.json({ total, taken, pending, missed, adherencePercent });
});

router.get("/log/recent", async (_req, res) => {
  const rows = await db
    .select({
      id: medicineLogTable.id,
      medicineId: medicineLogTable.medicineId,
      medicineName: medicinesTable.name,
      takenAt: medicineLogTable.takenAt,
      date: medicineLogTable.date,
    })
    .from(medicineLogTable)
    .innerJoin(medicinesTable, eq(medicinesTable.id, medicineLogTable.medicineId))
    .orderBy(desc(medicineLogTable.takenAt))
    .limit(10);

  res.json(
    rows.map((r) => ({
      id: r.id,
      medicineId: r.medicineId,
      medicineName: r.medicineName,
      takenAt: r.takenAt.toISOString(),
      date: r.date,
    })),
  );
});

router.get("/log/streak", async (_req, res) => {
  const meds = await db.select().from(medicinesTable);
  const totalPerDay = meds.length;
  if (totalPerDay === 0) {
    res.json({ currentStreak: 0, longestStreak: 0 });
    return;
  }

  const logs = await db
    .select({ date: medicineLogTable.date, medicineId: medicineLogTable.medicineId })
    .from(medicineLogTable);

  const byDate = new Map<string, Set<number>>();
  for (const l of logs) {
    if (!byDate.has(l.date)) byDate.set(l.date, new Set());
    byDate.get(l.date)!.add(l.medicineId);
  }

  const fullDays = new Set<string>();
  for (const [date, ids] of byDate.entries()) {
    if (ids.size >= totalPerDay) fullDays.add(date);
  }

  const formatDate = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Current streak: count consecutive days back from today (or yesterday if today isn't full yet)
  let current = 0;
  const cursor = new Date();
  if (!fullDays.has(formatDate(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while (fullDays.has(formatDate(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Longest streak: walk through sorted unique full days
  const sorted = Array.from(fullDays).sort();
  let longest = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const ds of sorted) {
    const [y, m, d] = ds.split("-").map(Number);
    const cur = new Date(y!, (m ?? 1) - 1, d ?? 1);
    if (prev) {
      const diffDays = Math.round(
        (cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
      );
      run = diffDays === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = cur;
  }

  res.json({ currentStreak: current, longestStreak: Math.max(longest, current) });
});

export default router;
