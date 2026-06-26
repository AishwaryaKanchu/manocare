import React, { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "te";

const translations = {
  en: {
    // General
    "app.title": "ManoCare",
    "nav.home": "Home",
    "nav.schedule": "Schedule",
    "nav.reassurance": "Reassurance",
    "nav.caregiver": "Caregiver",
    "nav.settings": "Settings",
    "common.loading": "Loading...",
    "common.error": "Something went wrong.",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",

    // Home
    "home.greeting.morning": "Good morning",
    "home.greeting.afternoon": "Good afternoon",
    "home.greeting.evening": "Good evening",
    "home.friend": "Friend",
    "home.next_medicine": "Your next medicine",
    "home.no_medicine_due": "You have no more medicines to take today.",
    "home.all_done": "All done for today!",
    "home.btn_took_it": "I Took My Medicine",
    "home.btn_did_i_take": "Did I Take It?",
    "home.status.due": "Due Now",
    "home.status.upcoming": "Coming Up",
    "home.status.missed": "Missed",
    "home.dashboard_summary": "Today: {taken} / {total} taken",
    "home.streak": "{streak} day streak — wonderful!",
    
    // Reminder Modal
    "reminder.title": "Time for your medicine",
    "reminder.btn_took_it": "I Took It",
    "reminder.btn_snooze": "Remind in 10 minutes",

    // Schedule
    "schedule.title": "Today's Schedule",
    "schedule.empty": "No medicines scheduled for today.",
    "schedule.mark_taken": "Mark as Taken",
    "schedule.taken_at": "Taken at {time}",
    "schedule.pending": "Pending",
    "schedule.missed": "Missed",

    // Confirmation
    "confirm.title": "Well done!",
    "confirm.message": "You took {name} at {time}",
    "confirm.subtext": "You are taking great care of yourself.",
    "confirm.btn_home": "Go Back Home",
    "confirm.redirecting": "Going back in {seconds}...",

    // Reassurance
    "reassure.title": "Did I Take My Medicine?",
    "reassure.subtext": "Don't worry. Here is everything you need to know.",
    "reassure.taken": "{name} — Taken at {time}",
    "reassure.not_taken": "{name} — Not taken yet",
    "reassure.all_taken": "Wonderful! You have taken all your medicines today.",
    "reassure.some_missed": "Please take the remaining ones when you feel ready. No rush.",

    // Caregiver
    "caregiver.title": "Caregiver Setup",
    "caregiver.add.title": "Add Medicine",
    "caregiver.add.name": "Medicine Name",
    "caregiver.add.time": "Time (HH:MM)",
    "caregiver.add.dosage": "Dosage",
    "caregiver.add.frequency": "Frequency",
    "caregiver.add.btn": "Add Medicine",
    "caregiver.freq.daily": "Daily",
    "caregiver.freq.weekly": "Weekly",
    "caregiver.freq.as_needed": "As Needed",
    "caregiver.list.title": "All Medicines",
    "caregiver.recent.title": "Recently Taken",
    
    // Settings
    "settings.title": "Settings",
    "settings.name": "Your Name",
    "settings.text_size": "Text Size",
    "settings.text_size.normal": "Normal",
    "settings.text_size.large": "Large",
    "settings.text_size.xlarge": "Extra Large",
    "settings.sound": "Reminder Sound",
    "settings.language": "Language",
    "settings.about": "About ManoCare",
    "settings.about.desc": "A calming companion to help you remember your medicines without worry.",
  },
  te: {
    // General
    "app.title": "మనోకేర్",
    "nav.home": "హోమ్",
    "nav.schedule": "షెడ్యూల్",
    "nav.reassurance": "భరోసా",
    "nav.caregiver": "సంరక్షకుడు",
    "nav.settings": "సెట్టింగ్స్",
    "common.loading": "లోడ్ అవుతోంది...",
    "common.error": "ఏదో తప్పు జరిగింది.",
    "common.save": "సేవ్ చేయండి",
    "common.cancel": "రద్దు చేయండి",
    "common.delete": "తొలగించండి",
    "common.edit": "సవరించండి",

    // Home
    "home.greeting.morning": "శుభోదయం",
    "home.greeting.afternoon": "శుభాహ్నం",
    "home.greeting.evening": "శుభ సాయంత్రం",
    "home.friend": "మిత్రమా",
    "home.next_medicine": "మీ తదుపరి మందు",
    "home.no_medicine_due": "ఈరోజుకి మీరు వేసుకోవాల్సిన మందులు ఇక లేవు.",
    "home.all_done": "ఈరోజుకి అన్నీ పూర్తయ్యాయి!",
    "home.btn_took_it": "నేను నా మందు వేసుకున్నాను",
    "home.btn_did_i_take": "నేను నా మందు వేసుకున్నానా?",
    "home.status.due": "ఇప్పుడు వేసుకోవాలి",
    "home.status.upcoming": "రాబోయేది",
    "home.status.missed": "తప్పినది",
    "home.dashboard_summary": "ఈరోజు: {taken} / {total} వేసుకున్నారు",
    "home.streak": "{streak} రోజుల స్ట్రీక్ — అద్భుతం!",
    
    // Reminder Modal
    "reminder.title": "మీ మందు వేసుకునే సమయం",
    "reminder.btn_took_it": "నేను వేసుకున్నాను",
    "reminder.btn_snooze": "10 నిమిషాల్లో మళ్ళీ గుర్తుచేయి",

    // Schedule
    "schedule.title": "ఈరోజు షెడ్యూల్",
    "schedule.empty": "ఈరోజు షెడ్యూల్ చేయబడిన మందులు లేవు.",
    "schedule.mark_taken": "వేసుకున్నట్లు గుర్తించు",
    "schedule.taken_at": "{time} కి వేసుకున్నారు",
    "schedule.pending": "పెండింగ్‌లో ఉంది",
    "schedule.missed": "తప్పినది",

    // Confirmation
    "confirm.title": "చాలా బాగుంది!",
    "confirm.message": "మీరు {time} కి {name} వేసుకున్నారు",
    "confirm.subtext": "మీరు మీ ఆరోగ్యాన్ని బాగా చూసుకుంటున్నారు.",
    "confirm.btn_home": "హోమ్‌కి వెళ్లండి",
    "confirm.redirecting": "{seconds} లో వెనుకకు వెళ్తున్నాము...",

    // Reassurance
    "reassure.title": "నేను నా మందు వేసుకున్నానా?",
    "reassure.subtext": "కంగారుపడవద్దు. మీకు కావాల్సిన సమాచారం ఇక్కడ ఉంది.",
    "reassure.taken": "{name} — {time} కి వేసుకున్నారు",
    "reassure.not_taken": "{name} — ఇంకా వేసుకోలేదు",
    "reassure.all_taken": "అద్భుతం! మీరు ఈరోజు మీ మందులన్నీ వేసుకున్నారు.",
    "reassure.some_missed": "మిగిలిన మందులను మీకు వీలైనప్పుడు వేసుకోండి. కంగారు లేదు.",

    // Caregiver
    "caregiver.title": "సంరక్షకుని సెటప్",
    "caregiver.add.title": "మందును జోడించండి",
    "caregiver.add.name": "మందు పేరు",
    "caregiver.add.time": "సమయం (HH:MM)",
    "caregiver.add.dosage": "మోతాదు",
    "caregiver.add.frequency": "ఫ్రీక్వెన్సీ",
    "caregiver.add.btn": "మందును జోడించండి",
    "caregiver.freq.daily": "రోజూ",
    "caregiver.freq.weekly": "వారానికి",
    "caregiver.freq.as_needed": "అవసరమైనప్పుడు",
    "caregiver.list.title": "అన్ని మందులు",
    "caregiver.recent.title": "ఇటీవల వేసుకున్నవి",
    
    // Settings
    "settings.title": "సెట్టింగ్స్",
    "settings.name": "మీ పేరు",
    "settings.text_size": "అక్షరాల పరిమాణం",
    "settings.text_size.normal": "సాధారణం",
    "settings.text_size.large": "పెద్దది",
    "settings.text_size.xlarge": "చాలా పెద్దది",
    "settings.sound": "రిమైండర్ సౌండ్",
    "settings.language": "భాష",
    "settings.about": "మనోకేర్ గురించి",
    "settings.about.desc": "కంగారు లేకుండా మీ మందులను గుర్తుంచుకోవడంలో సహాయపడే ప్రశాంతమైన తోడు.",
  }
};

type TransKey = keyof typeof translations.en;

interface LangContextType {
  lang: Lang | null;
  setLang: (lang: Lang) => void;
  t: (key: TransKey, params?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang | null>(() => {
    const saved = localStorage.getItem("manocare:lang");
    return (saved === "en" || saved === "te") ? saved : null;
  });

  const setLang = (newLang: Lang) => {
    localStorage.setItem("manocare:lang", newLang);
    setLangState(newLang);
  };

  const t = (key: TransKey, params?: Record<string, string | number>) => {
    const currentLang = lang || "en";
    let text = translations[currentLang][key] || translations.en[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
};
