import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Phone, Mail, Scale, Clock, Bell, FileText,
  MessageSquare, ChevronRight, Users
} from "lucide-react";

const timeline = [
  { day: "Day 1", action: "SMS + Push Notification", icon: Bell, status: "sent", detail: "EMI reminder sent via SMS & app notification" },
  { day: "Day 3", action: "Email Reminder", icon: Mail, status: "sent", detail: "Payment reminder email with payment link" },
  { day: "Day 7", action: "Late Fee + Call Reminder", icon: Phone, status: "active", detail: "₹500 late fee applied. Call scheduled." },
  { day: "Day 15", action: "Collection Assignment", icon: Users, status: "pending", detail: "Assigned to field collection officer" },
  { day: "Day 30", action: "Bureau Report + Legal Notice", icon: Scale, status: "pending", detail: "CIBIL default report + legal escalation" },
];

const collections = [
  { name: "Amit Patel", loanId: "CL-2024-1180", dpd: 45, amount: "₹33,470", bucket: "DPD 31–60", officer: "Suresh M.", status: "In Progress" },
  { name: "Meera Iyer", loanId: "CL-2024-1092", dpd: 22, amount: "₹16,735", bucket: "DPD 1–30", officer: "Ravi K.", status: "Contacted" },
  { name: "Deepak Joshi", loanId: "CL-2024-0987", dpd: 78, amount: "₹50,205", bucket: "DPD 60+", officer: "Pradeep S.", status: "Legal" },
  { name: "Kavita Nair", loanId: "CL-2024-1156", dpd: 12, amount: "₹16,735", bucket: "DPD 1–30", officer: "Ravi K.", status: "Promise to Pay" },
];

const bucketColors: Record<string, string> = {
  "DPD 1–30": "bg-warning/10 text-warning border-warning/20",
  "DPD 31–60": "bg-destructive/10 text-destructive/80 border-destructive/20",
  "DPD 60+": "bg-destructive/10 text-destructive border-destructive/20",
};

const statusColors: Record<string, string> = {
  "In Progress": "bg-info/10 text-info",
  "Contacted": "bg-primary/10 text-primary",
  "Legal": "bg-destructive/10 text-destructive",
  "Promise to Pay": "bg-success/10 text-success",
};

export default function CollectionFlow() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Collection & Recovery</h1>
          <p className="text-sm text-muted-foreground">Default management and collection workflow</p>
        </div>

        {/* Missed EMI Timeline */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Default Escalation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {timeline.map((t, i) => (
                <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
                  )}
                  <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    t.status === "sent" ? "bg-success/10" : t.status === "active" ? "bg-warning/10" : "bg-muted"
                  }`}>
                    <t.icon className={`h-4 w-4 ${
                      t.status === "sent" ? "text-success" : t.status === "active" ? "text-warning" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{t.day}</span>
                      <span className="text-sm font-medium">{t.action}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.detail}</p>
                  </div>
                  <span className={`self-start rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${
                    t.status === "sent" ? "bg-success/10 text-success" : t.status === "active" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                  }`}>{t.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collection Board */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Collection Workflow Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Loan ID</th>
                    <th className="pb-2 font-medium">DPD</th>
                    <th className="pb-2 font-medium">Overdue Amount</th>
                    <th className="pb-2 font-medium">Bucket</th>
                    <th className="pb-2 font-medium">Officer</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c) => (
                    <tr key={c.loanId} className="border-b last:border-0">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3 text-primary">{c.loanId}</td>
                      <td className="py-3 font-bold text-destructive">{c.dpd}</td>
                      <td className="py-3 font-medium">{c.amount}</td>
                      <td className="py-3">
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${bucketColors[c.bucket]}`}>{c.bucket}</span>
                      </td>
                      <td className="py-3 text-muted-foreground">{c.officer}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                      </td>
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
