import { useCallback } from "react";
import { useSettings } from "./use-settings";
import { useLang } from "@/lib/i18n";

export const useSpeech = () => {
  const { soundEnabled } = useSettings();
  const { lang } = useLang();

  const speak = useCallback((text: string) => {
    if (!soundEnabled || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "te" ? "te-IN" : "en-US";
    utterance.rate = 0.9; // Slightly slower for senior citizens
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  }, [soundEnabled, lang]);

  const beep = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Ignore audio context errors (often due to missing user interaction)
    }
  }, [soundEnabled]);

  return { speak, beep };
};
