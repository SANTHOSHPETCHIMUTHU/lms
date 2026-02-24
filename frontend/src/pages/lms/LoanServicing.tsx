import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard, AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Calendar, IndianRupee, XCircle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

const loanOverview = {
  totalLoans: 834,
  activeLoans: 756,
  closedLoans: 78,
  totalDisbursed: "₹42.6 Cr",
  totalOutstanding: "₹38.2 Cr",
  collectionRate: "94.2%",
};

const emiTimeline = [
  { month: "Oct 2025", status: "paid", amount: "₹16,735", date: "15 Oct" },
  { month: "Nov 2025", status: "paid", amount: "₹16,735", date: "15 Nov" },
  { month: "Dec 2025", status: "paid", amount: "₹16,735", date: "15 Dec" },
  { month: "Jan 2026", status: "paid", amount: "₹16,735", date: "15 Jan" },
  { month: "Feb 2026", status: "overdue", amount: "₹16,735", date: "15 Feb" },
  { month: "Mar 2026", status: "upcoming", amount: "₹16,735", date: "15 Mar" },
];

const overdueBuckets = [
  { bucket: "DPD 1–30", count: 34, amount: "₹56.8 L", color: "bg-warning/10 text-warning border-warning/20" },
  { bucket: "DPD 31–60", count: 18, amount: "₹32.1 L", color: "bg-destructive/10 text-destructive/80 border-destructive/20" },
  { bucket: "DPD 60+", count: 15, amount: "₹41.5 L", color: "bg-destructive/10 text-destructive border-destructive/20" },
];

const paymentHistory = [
  { id: "TXN-8821", date: "15 Jan 2026", amount: "₹16,735", mode: "Auto-Debit", status: "Success" },
  { id: "TXN-8720", date: "15 Dec 2025", amount: "₹16,735", mode: "UPI", status: "Success" },
  { id: "TXN-8619", date: "15 Nov 2025", amount: "₹16,735", mode: "Auto-Debit", status: "Success" },
  { id: "TXN-8518", date: "15 Oct 2025", amount: "₹16,735", mode: "Net Banking", status: "Success" },
];

export default function LoanServicing() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Loan Servicing</h1>
          <p className="text-sm text-muted-foreground">Post-disbursement loan management and tracking</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Active Loans", value: loanOverview.activeLoans, icon: CreditCard, color: "text-primary" },
            { label: "Total Outstanding", value: loanOverview.totalOutstanding, icon: IndianRupee, color: "text-foreground" },
            { label: "Collection Rate", value: loanOverview.collectionRate, icon: TrendingUp, color: "text-success" },
          ].map((s) => (
            <Card key={s.label} className="card-shadow">
              <CardContent className="flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-heading text-xl font-bold">{s.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* EMI Timeline */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">EMI Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emiTimeline.map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      e.status === "paid" ? "bg-success/10" : e.status === "overdue" ? "bg-destructive/10" : "bg-muted"
                    }`}>
                      {e.status === "paid" ? <CheckCircle2 className="h-4 w-4 text-success" /> :
                       e.status === "overdue" ? <XCircle className="h-4 w-4 text-destructive" /> :
                       <Clock className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{e.month}</p>
                      <p className="text-xs text-muted-foreground">{e.date}</p>
                    </div>
                    <span className="text-sm font-medium">{e.amount}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                      e.status === "paid" ? "bg-success/10 text-success" : 
                      e.status === "overdue" ? "bg-destructive/10 text-destructive" : 
                      "bg-muted text-muted-foreground"
                    }`}>{e.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overdue Buckets + NPA */}
          <div className="space-y-4">
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Overdue Buckets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {overdueBuckets.map((b) => (
                  <div key={b.bucket} className={`flex items-center justify-between rounded-lg border p-3 ${b.color}`}>
                    <div>
                      <p className="text-sm font-semibold">{b.bucket}</p>
                      <p className="text-xs opacity-70">{b.count} accounts</p>
                    </div>
                    <span className="font-heading text-lg font-bold">{b.amount}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">NPA & Penal Interest</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">NPA Accounts</span><span className="font-bold text-destructive">8</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Penal Interest</span><span className="font-medium">₹2.4 L</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Legal Tagged</span><span className="font-medium text-destructive">3 accounts</span></div>
                <Progress value={8 / 756 * 100} className="mt-2 h-1.5" />
                <p className="text-[10px] text-muted-foreground">NPA ratio: 1.06%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment History */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Recent Payment Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Transaction ID</th>
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Mode</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-2.5 font-medium text-primary">{p.id}</td>
                      <td className="py-2.5">{p.date}</td>
                      <td className="py-2.5 font-medium">{p.amount}</td>
                      <td className="py-2.5 text-muted-foreground">{p.mode}</td>
                      <td className="py-2.5"><span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
