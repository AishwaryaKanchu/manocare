import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useSpeech } from "@/hooks/use-speech";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetNextMedicine,
  getGetNextMedicineQueryKey,
  useMarkMedicineTaken,
  getGetDashboardSummaryQueryKey,
  getGetAdherenceStreakQueryKey,
  getGetTodayLogQueryKey,
  getGetRecentActivityQueryKey,
} from "@workspace/api-client-react";
import { useLocation } from "wouter";

export function ReminderModal() {
  const { t, lang } = useLang();
  const { speak, beep } = useSpeech();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [snoozedUntil, setSnoozedUntil] = useState<Date | null>(null);

  const { data: nextMed } = useGetNextMedicine({
    query: { queryKey: getGetNextMedicineQueryKey(), refetchInterval: 10000 },
  });

  const markTaken = useMarkMedicineTaken({
    mutation: {
      onSuccess: () => {
        setIsOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetNextMedicineQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdherenceStreakQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTodayLogQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRecentActivityQueryKey() });
        
        if (nextMed?.medicine) {
          setLocation(`/confirmation?name=${encodeURIComponent(nextMed.medicine.name)}&time=${encodeURIComponent(nextMed.medicine.time)}`);
        }
      },
    }
  });

  useEffect(() => {
    const checkReminder = () => {
      if (!nextMed?.medicine) return;
      if (nextMed.status === "all_done" || nextMed.status === "none") return;
      
      // If snoozed, check if snooze time has passed
      if (snoozedUntil && new Date() < snoozedUntil) return;

      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMins = currentHours * 60 + currentMinutes;

      const [medHours, medMinutes] = nextMed.medicine.time.split(':').map(Number);
      const medTotalMins = medHours * 60 + medMinutes;

      // ±5 minutes window
      const diff = Math.abs(currentTotalMins - medTotalMins);
      
      if (diff <= 5 && !isOpen) {
        setIsOpen(true);
        beep();
        const speechText = lang === "en" 
          ? `It is time to take your medicine: ${nextMed.medicine.name}.`
          : `మీ మందు వేసుకునే సమయం అయింది: ${nextMed.medicine.name}.`;
        speak(speechText);
      }
    };

    const interval = setInterval(checkReminder, 60000); // Check every minute
    checkReminder(); // Check immediately
    return () => clearInterval(interval);
  }, [nextMed, snoozedUntil, isOpen, lang, speak, beep]);

  if (!isOpen || !nextMed?.medicine) return null;

  const handleSnooze = () => {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + 10);
    setSnoozedUntil(snoozeTime);
    setIsOpen(false);
  };

  const handleTake = () => {
    if (nextMed?.medicine) {
      markTaken.mutate({ id: nextMed.medicine.id });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-card w-full max-w-lg rounded-[32px] p-8 shadow-2xl border-4 border-primary flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-primary animate-pulse" />
        </div>
        
        <h2 className="text-3xl font-bold text-muted-foreground mb-4">
          {t("reminder.title")}
        </h2>
        
        <div className="text-6xl font-black text-foreground mb-4">
          {nextMed.medicine.time}
        </div>
        
        <div className="text-5xl font-bold text-primary mb-8">
          {nextMed.medicine.name}
        </div>
        
        <div className="text-2xl text-muted-foreground mb-10 bg-secondary px-6 py-2 rounded-full">
          {nextMed.medicine.dosage}
        </div>

        <div className="w-full flex flex-col gap-4">
          <button
            onClick={handleTake}
            disabled={markTaken.isPending}
            className="w-full min-h-[80px] bg-success text-success-foreground rounded-[20px] text-3xl font-bold shadow-lg hover:-translate-y-1 transition-all active:translate-y-1 disabled:opacity-50"
          >
            {t("reminder.btn_took_it")}
          </button>
          
          <button
            onClick={handleSnooze}
            className="w-full min-h-[80px] bg-secondary text-secondary-foreground rounded-[20px] text-2xl font-bold shadow-sm hover:-translate-y-1 transition-all active:translate-y-1"
          >
            {t("reminder.btn_snooze")}
          </button>
        </div>
      </div>
    </div>
  );
}
