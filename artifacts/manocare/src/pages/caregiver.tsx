import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLang } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Activity } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListMedicines,
  getListMedicinesQueryKey,
  useCreateMedicine,
  useDeleteMedicine,
  useGetRecentActivity,
  getGetRecentActivityQueryKey,
  MedicineInputFrequency,
} from "@workspace/api-client-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.nativeEnum(MedicineInputFrequency),
});

type FormValues = z.infer<typeof formSchema>;

export default function Caregiver() {
  const { t } = useLang();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: medicines, isLoading } = useListMedicines({
    query: { queryKey: getListMedicinesQueryKey() },
  });

  const { data: activity } = useGetRecentActivity({
    query: { queryKey: getGetRecentActivityQueryKey() },
  });

  const createMed = useCreateMedicine({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicinesQueryKey() });
        toast({ title: "Success", description: "Medicine added successfully." });
        form.reset();
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to add medicine.", variant: "destructive" });
      }
    }
  });

  const deleteMed = useDeleteMedicine({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListMedicinesQueryKey() });
        toast({ title: "Success", description: "Medicine deleted." });
      }
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      time: "08:00",
      dosage: "1 Pill",
      frequency: MedicineInputFrequency.Daily,
    },
  });

  const onSubmit = (data: FormValues) => {
    createMed.mutate({ data });
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 max-w-4xl mx-auto flex flex-col gap-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {t("caregiver.title")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Add Form */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
              <Plus className="w-6 h-6" />
              {t("caregiver.add.title")}
            </h2>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-muted-foreground">{t("caregiver.add.name")}</label>
                <input 
                  {...form.register("name")}
                  className="bg-background border-2 border-input rounded-[16px] px-4 py-3 text-xl focus:border-primary focus:ring-0 outline-none"
                  placeholder="e.g. Aspirin"
                />
                {form.formState.errors.name && <span className="text-destructive text-sm">{form.formState.errors.name.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-muted-foreground">{t("caregiver.add.time")}</label>
                <input 
                  type="time"
                  {...form.register("time")}
                  className="bg-background border-2 border-input rounded-[16px] px-4 py-3 text-xl focus:border-primary focus:ring-0 outline-none"
                />
                {form.formState.errors.time && <span className="text-destructive text-sm">{form.formState.errors.time.message}</span>}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-muted-foreground">{t("caregiver.add.dosage")}</label>
                <input 
                  {...form.register("dosage")}
                  className="bg-background border-2 border-input rounded-[16px] px-4 py-3 text-xl focus:border-primary focus:ring-0 outline-none"
                  placeholder="e.g. 2 Pills"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-bold text-muted-foreground">{t("caregiver.add.frequency")}</label>
                <select 
                  {...form.register("frequency")}
                  className="bg-background border-2 border-input rounded-[16px] px-4 py-3 text-xl focus:border-primary focus:ring-0 outline-none"
                >
                  <option value="Daily">{t("caregiver.freq.daily")}</option>
                  <option value="Weekly">{t("caregiver.freq.weekly")}</option>
                  <option value="As Needed">{t("caregiver.freq.as_needed")}</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={createMed.isPending}
                className="mt-4 w-full min-h-[60px] bg-primary text-primary-foreground rounded-[16px] text-xl font-bold shadow-md hover:-translate-y-1 transition-all disabled:opacity-50"
              >
                {t("caregiver.add.btn")}
              </button>
            </form>
          </div>

          {/* Activity Feed */}
          {activity && activity.length > 0 && (
            <div className="bg-secondary/50 rounded-[24px] p-6 border border-border">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-muted-foreground">
                <Activity className="w-5 h-5" />
                {t("caregiver.recent.title")}
              </h2>
              <div className="flex flex-col gap-3">
                {activity.map(act => (
                  <div key={act.id} className="bg-background rounded-[12px] p-3 text-sm flex justify-between border border-border shadow-sm">
                    <span className="font-bold">{act.medicineName}</span>
                    <span className="text-muted-foreground">
                      {new Date(act.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: List */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-[24px] p-6 shadow-sm border border-border h-full">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {t("caregiver.list.title")}
            </h2>

            {isLoading ? (
              <p>{t("common.loading")}</p>
            ) : (
              <div className="flex flex-col gap-4">
                {medicines?.map(med => (
                  <div key={med.id} className="bg-background rounded-[16px] p-5 border-2 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-black">{med.time}</span>
                        <span className="px-3 py-1 bg-secondary rounded-full text-sm font-bold text-muted-foreground">
                          {med.frequency === "Daily" ? t("caregiver.freq.daily") : med.frequency === "Weekly" ? t("caregiver.freq.weekly") : t("caregiver.freq.as_needed")}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-primary mb-1">{med.name}</h3>
                      <p className="text-muted-foreground">{med.dosage}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this medicine?")) {
                            deleteMed.mutate({ id: med.id });
                          }
                        }}
                        disabled={deleteMed.isPending}
                        className="w-12 h-12 rounded-[12px] bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {medicines?.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No medicines added yet.</p>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
