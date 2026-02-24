import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CustomerOnboarding from "./pages/los/CustomerOnboarding";
import KycVerification from "./pages/los/KycVerification";
import DocumentCollection from "./pages/los/DocumentCollection";
import CreditReview from "./pages/los/CreditReview";
import LoanApproval from "./pages/los/LoanApproval";
import Disbursement from "./pages/los/Disbursement";
import LoanServicing from "./pages/lms/LoanServicing";
import CollectionFlow from "./pages/lms/CollectionFlow";
import CustomerPortal from "./pages/customer/CustomerPortal";
import Compliance from "./pages/compliance/Compliance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
  <BrowserRouter basename={import.meta.env.BASE_URL}>        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/los/onboarding" element={<CustomerOnboarding />} />
          <Route path="/los/kyc" element={<KycVerification />} />
          <Route path="/los/documents" element={<DocumentCollection />} />
          <Route path="/los/credit-review" element={<CreditReview />} />
          <Route path="/los/approval" element={<LoanApproval />} />
          <Route path="/los/disbursement" element={<Disbursement />} />
          <Route path="/lms/servicing" element={<LoanServicing />} />
          <Route path="/lms/collection" element={<CollectionFlow />} />
          <Route path="/customer" element={<CustomerPortal />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
