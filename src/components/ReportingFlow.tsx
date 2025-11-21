import ReportForm from "@/components/ReportForm";
import AuthenticatedReportForm from "@/components/AuthenticatedReportForm";
import { useAuth } from "@/hooks/useAuth";

const ReportingFlow = () => {
  const { user } = useAuth();

  return user ? <AuthenticatedReportForm /> : <ReportForm />;
};

export default ReportingFlow;