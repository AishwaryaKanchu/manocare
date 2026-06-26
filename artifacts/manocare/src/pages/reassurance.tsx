import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { useSpeech } from "@/hooks/use-speech";
import { CheckCircle2, Heart } from "lucide-react";
import { useGetTodayLog, getGetTodayLogQueryKey } from "@workspace/api-client-react";

export default function Reassurance() {
  const { t, lang } = useLang();
  const { speak } = useSpeech();

  const { data: logs, isLoading } = useGetTodayLog({
    query: { queryKey: getGetTodayLogQueryKey() },
  });

  useEffect(() => {
    if (!logs || isLoading) return;

    const taken = logs.filter(l => l.status === "taken");
    const notTaken = logs.filter(l => l.status !== "taken");

    let speechText = "";
    
    if (lang === "en") {
      speechText = "Don't worry. Here is your medicine status. ";
      if (notTaken.length === 0 && logs.length > 0) {
        speechText += "Wonderful! You have taken all your medicines today.";
      } else {
        if (taken.length > 0) {
          speechText += `You have already taken ${taken.map(t => t.name).join(", ")}. `;
        }
        if (notTaken.length > 0) {
          speechText += `You still need to take ${notTaken.map(t => t.name).join(", ")}.`;
        }
      }
    } else {
      speechText = "కంగారుపడవద్దు. మీ మందుల వివరాలు ఇక్కడ ఉన్నాయి. ";
      if (notTaken.length === 0 && logs.length > 0) {
        speechText += "అద్భుతం! మీరు ఈరోజు మీ మందులన్నీ వేసుకున్నారు.";
      } else {
        if (taken.length > 0) {
          speechText += `మీరు ఇప్పటికే ${taken.map(t => t.name).join(", ")} వేసుకున్నారు. `;
        }
        if (notTaken.length > 0) {
          speechText += `మీరు ఇంకా ${notTaken.map(t => t.name).join(", ")} వేసుకోవాలి.`;
        }
      }
    }

    speak(speechText);
  }, [logs, isLoading, lang, speak]);

  if (isLoading) {
    return <div className="p-8 text-center text-2xl">{t("common.loading")}</div>;
  }

  const allTaken = logs && logs.length > 0 && logs.every(l => l.status === "taken");
  const anyMissed = logs && logs.some(l => l.status === "missed" || l.status === "pending");

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-1000 max-w-3xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10 w-full">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          {t("reassure.title")}
        </h1>
        <p className="text-2xl text-muted-foreground font-medium max-w-lg mx-auto leading-relaxed">
          {t("reassure.subtext")}
        </p>
      </div>

      {allTaken && (
        <div className="w-full bg-success/10 border-2 border-success/30 rounded-[32px] p-10 text-center mb-8 shadow-sm">
          <CheckCircle2 className="w-20 h-20 text-success mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-success-foreground bg-success px-6 py-3 rounded-full inline-block">
            {t("reassure.all_taken")}
          </h2>
        </div>
      )}

      <div className="w-full flex flex-col gap-4 mb-10">
        {logs?.map((log) => {
          const isTaken = log.status === "taken";
          return (
            <div 
              key={log.id}
              className={`p-6 rounded-[24px] border-2 flex items-center gap-6 transition-all ${
                isTaken 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-red-50 border-red-100'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                isTaken ? 'bg-success text-success-foreground' : 'bg-red-100 text-red-400'
              }`}>
                {isTaken ? <CheckCircle2 className="w-8 h-8" /> : <div className="w-4 h-4 bg-red-400 rounded-full" />}
              </div>
              
              <div>
                <h3 className={`text-2xl font-bold mb-1 ${isTaken ? 'text-success-foreground' : 'text-red-900'}`}>
                  {log.name}
                </h3>
                <p className={`text-xl font-medium ${isTaken ? 'text-success' : 'text-red-500'}`}>
                  {isTaken 
                    ? t("reassure.taken", { name: log.name, time: log.takenAt ? new Date(log.takenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : log.time }) 
                    : t("reassure.not_taken", { name: log.name })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {anyMissed && (
        <div className="w-full bg-secondary/50 rounded-[24px] p-8 text-center border border-border">
          <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
            {t("reassure.some_missed")}
          </p>
        </div>
      )}
    </div>
  );
}
