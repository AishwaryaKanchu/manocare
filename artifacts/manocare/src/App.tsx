import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { LangProvider, useLang } from "@/lib/i18n";
import { SettingsProvider } from "@/hooks/use-settings";
import { BottomNav } from "@/components/layout/bottom-nav";
import { LanguagePicker } from "@/pages/language-picker";

import Home from "@/pages/home";
import Schedule from "@/pages/schedule";
import Confirmation from "@/pages/confirmation";
import Reassurance from "@/pages/reassurance";
import Caregiver from "@/pages/caregiver";
import Settings from "@/pages/settings";

const queryClient = new QueryClient();

function Router() {
  const { lang, setLang } = useLang();
  
  if (!lang) {
    return <LanguagePicker />;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
          className="bg-card text-card-foreground px-4 py-2 rounded-full shadow-sm border border-border text-lg font-bold hover:bg-accent transition-colors cursor-pointer"
        >
          {lang === 'en' ? 'తె' : 'EN'}
        </button>
      </div>
      
      <main className="flex-1 w-full max-w-screen-xl mx-auto pt-16 md:pt-8">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/confirmation" component={Confirmation} />
          <Route path="/reassurance" component={Reassurance} />
          <Route path="/caregiver" component={Caregiver} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
      
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <LangProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </LangProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

export default App;
