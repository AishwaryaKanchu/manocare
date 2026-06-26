import { useLang } from "@/lib/i18n";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetTodayLog,
  getGetTodayLogQueryKey,
  useMarkMedicineTaken,
  getGetDashboardSummaryQueryKey,
  getGetAdherenceStreakQueryKey,
  getGetNextMedicineQueryKey,
  getGetRecentActivityQueryKey,
} from "@workspace/api-client-react";

export default function Schedule() {
  const { t } = useLang();
  const queryClient = useQueryClient();

  const { data: logs, isLoading } = useGetTodayLog({
    query: { queryKey: getGetTodayLogQueryKey() },
  });

  const markTaken = useMarkMedicineTaken({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetTodayLogQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdherenceStreakQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetNextMedicineQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetRecentActivityQueryKey() });
      },
    }
  });

  if (isLoading) {
    return <div className="p-8 text-center text-2xl">{t("common.loading")}</div>;
  }

  // Sort by time ascending
  const sortedLogs = [...(logs || [])].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-foreground mb-8 text-center">
        {t("schedule.title")}
      </h1>

      {sortedLogs.length === 0 ? (
        <div className="bg-card rounded-[24px] p-12 text-center border border-border shadow-sm">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-2xl font-bold text-muted-foreground">
            {t("schedule.empty")}
          </h2>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {sortedLogs.map((log) => {
            const isTaken = log.status === "taken";
            const isMissed = log.status === "missed";
            const isPending = log.status === "pending";

            return (
              <div 
                key={log.id}
                className={`bg-card rounded-[24px] p-6 shadow-sm border-l-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow-md
                  ${isTaken ? 'border-l-success bg-success/5' : 
                    isMissed ? 'border-l-destructive bg-destructive/5' : 
                    'border-l-primary'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-3xl font-black text-foreground">
                      {log.time}
                    </div>
                    {isTaken && (
                      <div className="px-4 py-1 rounded-full bg-success/20 text-success text-sm font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {log.takenAt ? t("schedule.taken_at", { time: new Date(log.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }) : ''}
                      </div>
                    )}
                    {isMissed && (
                      <div className="px-4 py-1 rounded-full bg-destructive/20 text-destructive text-sm font-bold flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {t("schedule.missed")}
                      </div>
                    )}
                    {isPending && (
                      <div className="px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {t("schedule.pending")}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{log.name}</h3>
                  <p className="text-xl text-muted-foreground">{log.dosage}</p>
                </div>

                {(isPending || isMissed) && (
                  <button
                    onClick={() => markTaken.mutate({ id: log.id })}
                    disabled={markTaken.isPending}
                    className="w-full md:w-auto px-8 min-h-[70px] bg-primary text-primary-foreground rounded-[16px] text-xl font-bold flex items-center justify-center gap-3 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    {t("schedule.mark_taken")}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
