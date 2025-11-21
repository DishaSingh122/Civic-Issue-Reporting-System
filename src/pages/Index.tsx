import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ReportingFlow from "@/components/ReportingFlow";
import IssueTracker from "@/components/IssueTracker";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import FloatingMenu from "@/components/FloatingMenu";
import TelegramFAB from "@/components/TelegramFAB";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        <Hero />
        <div id="report">
          <ReportingFlow />
        </div>
        <IssueTracker />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingMenu />
      <TelegramFAB />
    </div>
  );
};

export default Index;