import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useLang } from "@/lib/i18n";
import { useSpeech } from "@/hooks/use-speech";
import { CheckCircle } from "lucide-react";

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const { t, lang } = useLang();
  const { speak } = useSpeech();
  const [countdown, setCountdown] = useState(4);

  // Parse URL params for name and time
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get("name") || "";
  const time = searchParams.get("time") || "";

  useEffect(() => {
    const msg = t("confirm.title") + ". " + t("confirm.message", { name, time });
    speak(msg);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setLocation("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [name, time, setLocation, speak, t]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#F2FCE2] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center text-center max-w-2xl">
        <div className="mb-12">
          <CheckCircle className="w-48 h-48 text-success animate-giant-check" />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-success-foreground bg-success px-8 py-4 rounded-full mb-8 shadow-lg">
          {t("confirm.title")}
        </h1>
        
        {name && time && (
          <p className="text-3xl md:text-4xl text-success font-bold mb-6">
            {t("confirm.message", { name, time })}
          </p>
        )}
        
        <p className="text-2xl text-success/80 font-medium mb-16">
          {t("confirm.subtext")}
        </p>

        <div className="flex flex-col gap-6 w-full max-w-md">
          <button
            onClick={() => setLocation("/")}
            className="w-full min-h-[80px] bg-success text-success-foreground rounded-[20px] text-2xl font-bold shadow-xl hover:bg-success/90 transition-colors"
          >
            {t("confirm.btn_home")}
          </button>
          
          <p className="text-xl text-success/70 font-medium animate-pulse">
            {t("confirm.redirecting", { seconds: countdown })}
          </p>
        </div>
      </div>
    </div>
  );
}
