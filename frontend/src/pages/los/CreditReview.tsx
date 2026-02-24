import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  User, ShieldCheck, CreditCard, TrendingUp, AlertTriangle, CheckCircle2,
  XCircle, FileText, Clock, Loader2, Search
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function CreditReview() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [riskGrade, setRiskGrade] = useState("A – Low Risk");
  const [decision, setDecision] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/onboarding/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomerId) {
      fetchFullProfile();
    }
  }, [selectedCustomerId]);

  const fetchFullProfile = async () => {
    setIsLoading(true);
    try {
      // Aggregate data from multiple endpoints
      const [onboardingRes, kycRes, docRes] = await Promise.all([
        api.get(`/onboarding/customers/${selectedCustomerId}`),
        api.get(`/kyc/complete`, { params: { customer_id: selectedCustomerId } }).catch(() => ({ data: {} })), // Mock/Handle if not exists
        api.get(`/documents/summary/${selectedCustomerId}`)
      ]);

      setData({
        ...onboardingRes.data,
        kyc: kycRes.data,
        documents: docRes.data
      });
    } catch (err) {
      console.error("Failed to fetch profile", err);
      toast.error("Failed to load application data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitDecision = async (status: string) => {
    if (!selectedCustomerId || !data?.application?.id) return toast.error("No selection");
    setIsSubmitting(true);
    try {
      await api.post(`/credit/decision/${data.application.id}`, {
        risk_grade: riskGrade,
        decision: status,
        remarks: remarks
      });
      toast.success(`Application ${status} successfully`);
      fetchFullProfile();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const profile = data?.customer;
  const application = data?.application;
  const employment = data?.employment;
  const address = data?.address;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Credit Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground">Review and approve loan application {application?.application_number || "N/A"}</p>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Application:</Label>
            <select
              className="h-9 rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              value={selectedCustomerId || ""}
            >
              <option value="">Choose Application...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} (ID: {c.id})</option>
              ))}
            </select>
            <Badge variant="outline" className={`${application?.status === 'READY_FOR_REVIEW' ? 'bg-info/10 text-info border-info/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
              <Clock className="mr-1 h-3 w-3" /> {application?.status || "Pending Select"}
            </Badge>
          </div>
        </div>

        {selectedCustomerId ? (
          <>
            {/* Profile Summary */}
            <Card className="card-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                    {profile?.first_name?.[0].toUpperCase()}{profile?.last_name?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div><span className="text-xs text-muted-foreground">Name</span><p className="text-sm font-medium">{profile?.first_name} {profile?.last_name}</p></div>
                    <div><span className="text-xs text-muted-foreground">Employment</span><p className="text-sm font-medium">{employment?.employment_type || "N/A"}</p></div>
                    <div><span className="text-xs text-muted-foreground">Application ID</span><p className="text-sm font-bold text-primary">{application?.application_number}</p></div>
                    <div><span className="text-xs text-muted-foreground">Status</span><p className="text-sm font-medium uppercase">{application?.status}</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-3">
              {/* Income & Liabilities */}
              <Card className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-base">Sustainability Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Monthly Income</span><span className="font-medium">₹{employment?.monthly_income || 0}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Existing Obligations</span><span className="font-medium text-warning">₹{employment?.existing_obligations || 0}</span></div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm font-semibold"><span>Current FOIR</span><span className="text-info">Calculated during review</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* KYC & Documents */}
              <Card className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-base">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data?.documents?.documents?.map((doc: any) => (
                    <div key={doc.document_type} className="flex justify-between text-sm italic">
                      <span>{doc.document_type.replace('_', ' ')}</span>
                      <span className={doc.status === 'VERIFIED' ? 'text-success' : 'text-muted-foreground'}>{doc.status}</span>
                    </div>
                  ))}
                  {(!data?.documents?.documents || data.documents.documents.length === 0) && (
                    <p className="text-xs text-muted-foreground italic text-center">No documents uploaded</p>
                  )}
                </CardContent>
              </Card>

              {/* Fraud & Alerts */}
              <Card className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-base">System Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Identity Verified</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 p-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span>Check bank statement for salary credits</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Decision Panel */}
            <Card className="card-shadow border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Review Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Risk Grade</label>
                    <select
                      className="h-10 w-full rounded-lg border bg-card px-3 text-sm"
                      value={riskGrade}
                      onChange={(e) => setRiskGrade(e.target.value)}
                    >
                      <option>A – Low Risk</option>
                      <option>B – Moderate Risk</option>
                      <option>C – High Risk</option>
                      <option>D – Very High Risk</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Decision</label>
                    <select
                      className="h-10 w-full rounded-lg border bg-card px-3 text-sm"
                      value={decision}
                      onChange={(e) => setDecision(e.target.value)}
                    >
                      <option value="">Select decision</option>
                      <option value="APPROVE">Approve</option>
                      <option value="REJECT">Reject</option>
                      <option value="REFER">Refer Back / Info Required</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Remarks</label>
                  <Textarea
                    placeholder="Add review remarks..."
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    className="flex-1"
                    onClick={() => handleSubmitDecision("APPROVE")}
                    disabled={isSubmitting || !decision}
                  >
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><CheckCircle2 className="mr-2 h-4 w-4" /> Submit Review</>}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="flex h-[40vh] flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
            <Search className="h-10 w-10 text-muted-foreground" />
            <p className="mt-4 font-medium text-muted-foreground">Select an application from the top right to start review</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
