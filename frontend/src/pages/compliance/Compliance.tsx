import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Clock, Shield, Database, Eye, FileText, CreditCard, Fingerprint, Lock } from "lucide-react";

const complianceItems = [
  { title: "RBI Digital Lending Guidelines", status: "compliant", icon: Shield, detail: "Fair Practices Code implemented" },
  { title: "CKYC Integration", status: "active", icon: Fingerprint, detail: "Connected to CERSAI CKYC registry" },
  { title: "CIBIL/Experian Integration", status: "active", icon: CreditCard, detail: "Real-time credit bureau API" },
  { title: "Aadhaar eSign Verification", status: "active", icon: FileText, detail: "ESP compliant eSign gateway" },
  { title: "Data Encryption (AES-256)", status: "compliant", icon: Lock, detail: "At-rest and in-transit encryption" },
  { title: "Audit Logs", status: "compliant", icon: Eye, detail: "All actions logged with timestamps" },
];

const statusMap = {
  compliant: { label: "Compliant", color: "bg-success/10 text-success", icon: CheckCircle2 },
  active: { label: "Active", color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  warning: { label: "Review Needed", color: "bg-warning/10 text-warning", icon: AlertTriangle },
  pending: { label: "Pending", color: "bg-muted text-muted-foreground", icon: Clock },
};

const auditLogs = [
  { time: "19 Feb 2026, 14:32", user: "Admin", action: "Updated RLS policy for loans table", type: "Security" },
  { time: "19 Feb 2026, 11:15", user: "Credit Mgr", action: "Approved loan CL-2024-1247", type: "Decision" },
  { time: "18 Feb 2026, 16:45", user: "System", action: "CIBIL API health check passed", type: "Integration" },
  { time: "18 Feb 2026, 09:30", user: "Sales Exec", action: "Created customer CUST-2024-4821", type: "Data" },
];

export default function Compliance() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Compliance & Security</h1>
          <p className="text-sm text-muted-foreground">Regulatory compliance status and audit trail</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {complianceItems.map((item) => {
            const s = statusMap[item.status as keyof typeof statusMap];
            return (
              <Card key={item.title} className="card-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.detail}</p>
                      <div className="mt-2 flex items-center gap-1.5">
                        <s.icon className="h-3.5 w-3.5" />
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${s.color}`}>{s.label}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Audit Log */}
        <Card className="card-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Recent Audit Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="pb-2 font-medium">Timestamp</th>
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">Action</th>
                    <th className="pb-2 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="py-2.5 text-muted-foreground">{log.time}</td>
                      <td className="py-2.5 font-medium">{log.user}</td>
                      <td className="py-2.5">{log.action}</td>
                      <td className="py-2.5">
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">{log.type}</span>
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
