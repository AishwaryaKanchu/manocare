import { Link, useLocation } from "wouter";
import { Home, Calendar, HeartHandshake, UserCog, Settings } from "lucide-react";
import { useLang } from "@/lib/i18n";

export function BottomNav() {
  const [location] = useLocation();
  const { t } = useLang();

  // Hide nav on confirmation and language picker
  if (location === "/confirmation" || location === "/welcome") return null;

  const items = [
    { href: "/", icon: Home, label: t("nav.home") },
    { href: "/schedule", icon: Calendar, label: t("nav.schedule") },
    { href: "/reassurance", icon: HeartHandshake, label: t("nav.reassurance") },
    { href: "/caregiver", icon: UserCog, label: t("nav.caregiver") },
    { href: "/settings", icon: Settings, label: t("nav.settings") },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-around">
        {items.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-4 px-2 hover-elevate transition-colors ${
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-8 h-8 mb-1 ${isActive ? "text-primary" : ""}`} />
              <span className="text-[16px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
