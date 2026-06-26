import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { CheckCircle2, Clock, Check, AlertCircle } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { useSettings } from "@/hooks/use-settings";
import { useSpeech } from "@/hooks/use-speech";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetNextMedicine,
  getGetNextMedicineQueryKey,
  useGetDashboardSummary,
  getGetDashboardSummaryQueryKey,
  useGetAdherenceStreak,
  getGetAdherenceStreakQueryKey,
  useMarkMedicineTaken,
  getGetTodayLogQueryKey,
  getGetRecentActivityQueryKey,
} from "@workspace/api-client-react";
import { ReminderModal } from "@/components/reminder-modal";

export default function Home() {
  const [, setLocation] = useLocation();
  const { t, lang } = useLang();
  const { name } = useSettings();
  const { speak } = useSpeech();
  const queryClient = useQueryClient();

  const { data: nextMed } = useGetNextMedicine({
    query: { queryKey: getGetNextMedicineQueryKey(), refetchInterval: 30000 },
  });
  const { data: summary } = useGetDashboardSummary({
    query: { queryKey: getGetDashboardSummaryQueryKey() },
  });
  const { data: streak } = useGetAdherenceStreak({
    query: { queryKey: getGetAdherenceStreakQueryKey() },
  });

  const markTaken = useMarkMedicineTaken({
    mutation: {
      onSuccess: () => {
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

  // Welcome speech
  useEffect(() => {
    const hour = new Date().getHours();
    let greetingKey: keyof typeof t = "home.greeting.morning";
    if (hour >= 12 && hour < 17) greetingKey = "home.greeting.afternoon";
    else if (hour >= 17) greetingKey = "home.greeting.evening";
    
    const greeting = t(greetingKey);
    const userName = name || t("home.friend");
    
    let speechText = `${greeting}, ${userName}. `;
    
    if (nextMed?.medicine) {
      const medName = nextMed.medicine.name;
      const medTime = nextMed.medicine.time;
      if (lang === "en") {
        speechText += `Your next medicine is ${medName} at ${medTime}.`;
      } else {
        speechText += `మీ తదుపరి మందు ${medTime} కి ${medName}.`;
      }
    } else if (nextMed?.status === "all_done") {
      speechText += lang === "en" ? "You are all done for today." : "ఈరోజుకి అన్నీ పూర్తయ్యాయి.";
    }
    
    speak(speechText);
  }, [nextMed?.medicine?.id, nextMed?.status]);

  const handleTakeNext = () => {
    if (nextMed?.medicine) {
      markTaken.mutate({ id: nextMed.medicine.id });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("home.greeting.morning");
    if (hour < 17) return t("home.greeting.afternoon");
    return t("home.greeting.evening");
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-700 max-w-2xl mx-auto flex flex-col items-center">
      <ReminderModal />
      
      <div className="text-center mb-8 mt-4 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
          {getGreeting()}, <span className="text-primary">{name || t("home.friend")}</span>
        </h1>
        <p className="text-2xl text-muted-foreground font-medium">
          {format(new Date(), "EEEE, MMMM do")}
        </p>
      </div>

      {(summary || streak) && (
        <div className="flex flex-wrap gap-4 justify-center mb-10 w-full">
          {summary && summary.total > 0 && (
            <div className="bg-white px-6 py-3 rounded-full shadow-sm border border-border flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
              <span className="font-bold text-xl">
                {t("home.dashboard_summary", { taken: summary.taken, total: summary.total })}
              </span>
            </div>
          )}
          {streak && streak.currentStreak > 0 && (
            <div className="bg-amber-50 px-6 py-3 rounded-full shadow-sm border border-amber-200 flex items-center gap-3">
              <span className="text-amber-500 text-2xl leading-none">★</span>
              <span className="font-bold text-xl text-amber-800">
                {t("home.streak", { streak: streak.currentStreak })}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="w-full bg-white rounded-[24px] p-8 shadow-md border border-border mb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary/20" />
        
        <h2 className="text-2xl font-bold text-muted-foreground mb-6 uppercase tracking-wide">
          {t("home.next_medicine")}
        </h2>

        {nextMed?.medicine ? (
          <div className="flex flex-col items-center">
            <div className="text-6xl md:text-7xl font-black text-foreground mb-4">
              {nextMed.medicine.time}
            </div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-4">
              {nextMed.medicine.name}
            </div>
            <div className="text-2xl text-muted-foreground mb-8 bg-secondary px-6 py-2 rounded-full">
              {nextMed.medicine.dosage}
            </div>
            
            <div className={`px-6 py-3 rounded-full text-xl font-bold flex items-center gap-2 ${
              nextMed.status === 'due' ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse' :
              nextMed.status === 'missed' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
              'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
              {nextMed.status === 'due' && <Clock className="w-6 h-6" />}
              {nextMed.status === 'missed' && <AlertCircle className="w-6 h-6" />}
              {nextMed.status === 'upcoming' && <Clock className="w-6 h-6" />}
              {t(`home.status.${nextMed.status}` as any)}
            </div>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center">
            <CheckCircle2 className="w-24 h-24 text-success mb-6" />
            <h3 className="text-3xl font-bold text-foreground mb-4">
              {nextMed?.status === "all_done" ? t("home.all_done") : t("home.no_medicine_due")}
            </h3>
          </div>
        )}
      </div>

      <div className="w-full flex flex-col gap-6">
        <button
          onClick={handleTakeNext}
          disabled={!nextMed?.medicine || markTaken.isPending}
          className="w-full min-h-[80px] bg-primary text-primary-foreground rounded-[20px] text-2xl md:text-3xl font-bold flex items-center justify-center gap-4 hover:bg-primary/90 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed shadow-lg active:translate-y-1"
        >
          <Check className="w-8 h-8 md:w-10 md:h-10" />
          {t("home.btn_took_it")}
        </button>

        <button
          onClick={() => setLocation("/reassurance")}
          className="w-full min-h-[80px] bg-secondary text-secondary-foreground rounded-[20px] text-2xl md:text-3xl font-bold flex items-center justify-center gap-4 hover:bg-secondary/80 hover:-translate-y-1 transition-all shadow-md active:translate-y-1"
        >
          <Clock className="w-8 h-8 md:w-10 md:h-10" />
          {t("home.btn_did_i_take")}
        </button>
      </div>
    </div>
  );
}
