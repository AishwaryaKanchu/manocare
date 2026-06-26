import { Router, type IRouter } from "express";
import { db, medicinesTable, medicineLogTable } from "@workspace/db";
import { eq, asc, desc, and } from "drizzle-orm";
import {
  CreateMedicineBody,
  UpdateMedicineBody,
  UpdateMedicineParams,
  DeleteMedicineParams,
  MarkMedicineTakenParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function todayDateStr(): string {
  // ISO date YYYY-MM-DD in server local time
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function toMedicineDto(m: typeof medicinesTable.$inferSelect) {
  return {
    id: m.id,
    name: m.name,
    time: m.time,
    dosage: m.dosage,
    frequency: m.frequency,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/medicines", async (_req, res) => {
  const rows = await db
    .select()
    .from(medicinesTable)
    .orderBy(asc(medicinesTable.time));
  res.json(rows.map(toMedicineDto));
});

router.post("/medicines", async (req, res) => {
  const body = CreateMedicineBody.parse(req.body);
  const [created] = await db
    .insert(medicinesTable)
    .values({
      name: body.name,
      time: body.time,
      dosage: body.dosage,
      frequency: body.frequency,
    })
    .returning();
  if (!created) {
    res.status(500).json({ error: "Failed to insert medicine" });
    return;
  }
  res.status(201).json(toMedicineDto(created));
});

router.put("/medicines/:id", async (req, res) => {
  const { id } = UpdateMedicineParams.parse(req.params);
  const body = UpdateMedicineBody.parse(req.body);
  const [updated] = await db
    .update(medicinesTable)
    .set({
      name: body.name,
      time: body.time,
      dosage: body.dosage,
      frequency: body.frequency,
    })
    .where(eq(medicinesTable.id, id))
    .returning();
  if (!updated) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }
  res.json(toMedicineDto(updated));
});

router.delete("/medicines/:id", async (req, res) => {
  const { id } = DeleteMedicineParams.parse(req.params);
  await db.delete(medicineLogTable).where(eq(medicineLogTable.medicineId, id));
  await db.delete(medicinesTable).where(eq(medicinesTable.id, id));
  res.json({ success: true });
});

router.post("/medicines/:id/taken", async (req, res) => {
  const { id } = MarkMedicineTakenParams.parse(req.params);
  const [med] = await db
    .select()
    .from(medicinesTable)
    .where(eq(medicinesTable.id, id));
  if (!med) {
    res.status(404).json({ error: "Medicine not found" });
    return;
  }
  const date = todayDateStr();
  const [log] = await db
    .insert(medicineLogTable)
    .values({ medicineId: id, date })
    .returning();
  if (!log) {
    res.status(500).json({ error: "Failed to log intake" });
    return;
  }
  res.status(201).json({
    id: log.id,
    medicineId: log.medicineId,
    takenAt: log.takenAt.toISOString(),
    date: log.date,
  });
});

router.get("/medicines/next", async (_req, res) => {
  const meds = await db
    .select()
    .from(medicinesTable)
    .orderBy(asc(medicinesTable.time));

  if (meds.length === 0) {
    res.json({ medicine: null, status: "none", minutesUntil: null });
    return;
  }

  const date = todayDateStr();
  const logsToday = await db
    .select()
    .from(medicineLogTable)
    .where(eq(medicineLogTable.date, date));
  const takenIds = new Set(logsToday.map((l) => l.medicineId));

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const pending = meds.filter((m) => !takenIds.has(m.id));
  if (pending.length === 0) {
    res.json({ medicine: null, status: "all_done", minutesUntil: null });
    return;
  }

  const parseTime = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    return (hh ?? 0) * 60 + (mm ?? 0);
  };

  // Find the soonest upcoming or due medicine
  const upcoming = pending
    .map((m) => ({ m, mins: parseTime(m.time) }))
    .sort((a, b) => a.mins - b.mins);

  // Try to find one that hasn't passed yet (within 5 min before)
  const dueOrUpcoming = upcoming.find((x) => x.mins >= nowMinutes - 5);
  if (dueOrUpcoming) {
    const diff = dueOrUpcoming.mins - nowMinutes;
    const status = diff <= 5 && diff >= -5 ? "due" : "upcoming";
    res.json({
      medicine: toMedicineDto(dueOrUpcoming.m),
      status,
      minutesUntil: diff,
    });
    return;
  }

  // Otherwise the earliest pending is missed
  const missed = upcoming[0]!;
  res.json({
    medicine: toMedicineDto(missed.m),
    status: "missed",
    minutesUntil: missed.mins - nowMinutes,
  });
});

export default router;
