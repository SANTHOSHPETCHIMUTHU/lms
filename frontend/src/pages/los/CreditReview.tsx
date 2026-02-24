import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  User, ShieldCheck, CreditCard, TrendingUp, AlertTriangle, CheckCircle2,
  XCircle, FileText, Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const profileData = {
  name: "Rajesh Kumar",
  customerId: "CUST-2024-4821",
  applicationId: "CL-2024-1247",
  age: 35,
  employment: "Salaried – Infosys Ltd.",
  income: "₹85,000/month",
  loanAmount: "₹5,00,000",
  tenure: "36 months",
  purpose: "Personal Loan",
};

const metrics = [
  { label: "KYC Status", value: "Verified", icon: ShieldCheck, color: "text-success" },
  { label: "CIBIL Score", value: "742", icon: CreditCard, color: "text-success" },
  { label: "Monthly Income", value: "₹85,000", icon: TrendingUp, color: "text-primary" },
  { label: "FOIR", value: "38%", icon: TrendingUp, color: "text-success" },
];

const liabilities = [
  { type: "Credit Card", amount: "₹12,000/mo", bank: "HDFC" },
  { type: "Car Loan", amount: "₹8,500/mo", bank: "ICICI" },
];

export default function CreditReview() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Credit Manager Dashboard</h1>
            <p className="text-sm text-muted-foreground">Review and approve loan application {profileData.applicationId}</p>
          </div>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="mr-1 h-3 w-3" /> Pending Review
          </Badge>
        </div>

        {/* Profile Summary */}
        <Card className="card-shadow">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                RK
              </div>
              <div className="flex-1 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-4">
                <div><span className="text-xs text-muted-foreground">Name</span><p className="text-sm font-medium">{profileData.name}</p></div>
                <div><span className="text-xs text-muted-foreground">Employment</span><p className="text-sm font-medium">{profileData.employment}</p></div>
                <div><span className="text-xs text-muted-foreground">Loan Amount</span><p className="text-sm font-bold text-primary">{profileData.loanAmount}</p></div>
                <div><span className="text-xs text-muted-foreground">Tenure</span><p className="text-sm font-medium">{profileData.tenure}</p></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <Card key={m.label} className="card-shadow">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <m.icon className={`h-5 w-5 ${m.color}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{m.label}</p>
                  <p className="font-heading text-lg font-bold">{m.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Income & FOIR */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">Income Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Gross Income</span><span className="font-medium">₹85,000</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Net Income</span><span className="font-medium">₹72,000</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Existing EMIs</span><span className="font-medium text-warning">₹20,500</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Proposed EMI</span><span className="font-medium">₹16,100</span></div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-sm font-semibold"><span>FOIR</span><span className="text-success">38%</span></div>
                <Progress value={38} className="mt-1 h-2" />
                <p className="mt-1 text-[10px] text-muted-foreground">Recommended: Below 50%</p>
              </div>
            </CardContent>
          </Card>

          {/* Existing Liabilities */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">Existing Liabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {liabilities.map((l) => (
                <div key={l.type} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{l.type}</p>
                    <p className="text-xs text-muted-foreground">{l.bank}</p>
                  </div>
                  <span className="text-sm font-semibold">{l.amount}</span>
                </div>
              ))}
              <div className="rounded-lg bg-muted/50 p-3">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Obligations</span><span className="font-bold">₹20,500/mo</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Fraud & Risk */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">Fraud & Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>No fraud indicators detected</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>Income consistency verified</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-warning/20 bg-warning/5 p-3 text-sm">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span>Multiple enquiries in last 3 months</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Panel */}
        <Card className="card-shadow border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Risk Grade</label>
                <select className="h-10 w-full rounded-lg border bg-card px-3 text-sm">
                  <option>A – Low Risk</option>
                  <option>B – Moderate Risk</option>
                  <option>C – High Risk</option>
                  <option>D – Very High Risk</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Decision</label>
                <select className="h-10 w-full rounded-lg border bg-card px-3 text-sm">
                  <option>Select decision</option>
                  <option>Approve</option>
                  <option>Reject</option>
                  <option>Request More Documents</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Remarks</label>
              <Textarea placeholder="Add review remarks..." rows={3} />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
              </Button>
              <Button variant="outline" className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/5">
                <XCircle className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" /> Request Docs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
