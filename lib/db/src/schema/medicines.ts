import { pgTable, text, serial, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const medicinesTable = pgTable("medicines", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  time: text("time").notNull(),
  dosage: text("dosage").notNull(),
  frequency: text("frequency").notNull().default("Daily"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const medicineLogTable = pgTable(
  "medicine_log",
  {
    id: serial("id").primaryKey(),
    medicineId: serial("medicine_id").notNull(),
    takenAt: timestamp("taken_at", { withTimezone: true }).notNull().defaultNow(),
    date: text("date").notNull(),
  },
  (table) => ({
    medicineDateIdx: index("medicine_log_medicine_date_idx").on(
      table.medicineId,
      table.date,
    ),
    dateIdx: index("medicine_log_date_idx").on(table.date),
  }),
);

export const insertMedicineSchema = createInsertSchema(medicinesTable).omit({
  id: true,
  createdAt: true,
});

export type InsertMedicine = z.infer<typeof insertMedicineSchema>;
export type Medicine = typeof medicinesTable.$inferSelect;
export type MedicineLog = typeof medicineLogTable.$inferSelect;
