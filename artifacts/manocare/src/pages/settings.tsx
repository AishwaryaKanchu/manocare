import { useLang } from "@/lib/i18n";
import { useSettings, TextSize } from "@/hooks/use-settings";
import { User, Type, Volume2, Globe, Info } from "lucide-react";

export default function Settings() {
  const { t, lang, setLang } = useLang();
  const { name, setName, textSize, setTextSize, soundEnabled, setSoundEnabled } = useSettings();

  return (
    <div className="p-6 pb-32 animate-in fade-in duration-500 max-w-2xl mx-auto flex flex-col gap-8">
      <h1 className="text-4xl font-extrabold text-foreground mb-4 text-center">
        {t("settings.title")}
      </h1>

      <div className="bg-card rounded-[32px] p-8 shadow-sm border border-border flex flex-col gap-8">
        
        {/* Name Setting */}
        <div className="flex flex-col gap-3">
          <label className="text-xl font-bold text-muted-foreground flex items-center gap-2">
            <User className="w-6 h-6" />
            {t("settings.name")}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Name"
            className="w-full bg-background border-2 border-input rounded-[16px] px-6 py-4 text-2xl font-bold focus:border-primary focus:ring-0 outline-none transition-colors"
          />
        </div>

        <hr className="border-border" />

        {/* Text Size Setting */}
        <div className="flex flex-col gap-4">
          <label className="text-xl font-bold text-muted-foreground flex items-center gap-2">
            <Type className="w-6 h-6" />
            {t("settings.text_size")}
          </label>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            {(["normal", "large", "xlarge"] as TextSize[]).map((size) => (
              <button
                key={size}
                onClick={() => setTextSize(size)}
                className={`flex-1 py-4 rounded-[16px] text-xl font-bold border-2 transition-all ${
                  textSize === size 
                    ? "bg-primary text-primary-foreground border-primary shadow-md" 
                    : "bg-background border-input text-foreground hover:border-primary/50"
                }`}
              >
                {t(`settings.text_size.${size}` as any)}
              </button>
            ))}
          </div>
        </div>

        <hr className="border-border" />

        {/* Sound Toggle */}
        <div className="flex items-center justify-between gap-4">
          <label className="text-xl font-bold text-muted-foreground flex items-center gap-2">
            <Volume2 className="w-6 h-6" />
            {t("settings.sound")}
          </label>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`relative w-20 h-10 rounded-full transition-colors ${
              soundEnabled ? "bg-success" : "bg-muted-foreground"
            }`}
          >
            <div className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-sm transition-transform ${
              soundEnabled ? "left-[calc(100%-2.25rem)]" : "left-1"
            }`} />
          </button>
        </div>

        <hr className="border-border" />

        {/* Language Toggle */}
        <div className="flex flex-col gap-4">
          <label className="text-xl font-bold text-muted-foreground flex items-center gap-2">
            <Globe className="w-6 h-6" />
            {t("settings.language")}
          </label>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button
              onClick={() => setLang("en")}
              className={`flex-1 py-4 rounded-[16px] text-xl font-bold border-2 transition-all ${
                lang === "en" 
                  ? "bg-primary text-primary-foreground border-primary shadow-md" 
                  : "bg-background border-input text-foreground hover:border-primary/50"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang("te")}
              className={`flex-1 py-4 rounded-[16px] text-xl font-bold border-2 transition-all ${
                lang === "te" 
                  ? "bg-primary text-primary-foreground border-primary shadow-md" 
                  : "bg-background border-input text-foreground hover:border-primary/50"
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>

      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-[32px] p-8 text-center flex flex-col items-center gap-4">
        <Info className="w-10 h-10 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">{t("settings.about")}</h2>
        <p className="text-xl text-muted-foreground">
          {t("settings.about.desc")}
        </p>
      </div>

    </div>
  );
}
