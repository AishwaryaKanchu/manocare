import { useLang } from "@/lib/i18n";

export function LanguagePicker() {
  const { setLang } = useLang();

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center bg-background p-6 animate-in fade-in duration-500">
      <h1 className="text-4xl font-bold text-foreground mb-12 text-center">
        Welcome / స్వాగతం
      </h1>
      <p className="text-2xl text-muted-foreground mb-12 text-center max-w-md">
        Please choose your language <br/> 
        దయచేసి మీ భాషను ఎంచుకోండి
      </p>

      <div className="flex flex-col w-full max-w-sm gap-6">
        <button
          onClick={() => setLang("en")}
          className="bg-primary text-primary-foreground py-10 px-8 rounded-[16px] text-3xl font-bold shadow-md hover-elevate active-elevate-2 transition-all w-full"
        >
          English
        </button>
        
        <button
          onClick={() => setLang("te")}
          className="bg-primary text-primary-foreground py-10 px-8 rounded-[16px] text-3xl font-bold shadow-md hover-elevate active-elevate-2 transition-all w-full"
        >
          తెలుగు (Telugu)
        </button>
      </div>
    </div>
  );
}
