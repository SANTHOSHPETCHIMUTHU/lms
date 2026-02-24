import { AppLayout } from "@/components/layout/AppLayout";
import {
  TrendingUp, Users, CheckCircle2, Banknote, AlertTriangle, ArrowUpRight,
  ArrowDownRight, Clock, FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

const fetchDashboardStats = async () => {
  try {
    const response = await api.get("/servicing/stats"); // Assuming this exists or will be added
    return response.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
    return null;
  }
};

const stats = [
  { label: "Total Applications", value: "1,247", change: "+12.5%", up: true, icon: FileText, color: "bg-primary/10 text-primary" },
  { label: "Approved Loans", value: "834", change: "+8.2%", up: true, icon: CheckCircle2, color: "bg-success/10 text-success" },
  { label: "Disbursed Amount", value: "₹42.6 Cr", change: "+15.3%", up: true, icon: Banknote, color: "bg-info/10 text-info" },
  { label: "Overdue Accounts", value: "67", change: "-3.1%", up: false, icon: AlertTriangle, color: "bg-warning/10 text-warning" },
];

const pipelineData = [
  { stage: "Applied", count: 245 },
  { stage: "KYC", count: 198 },
  { stage: "Documents", count: 172 },
  { stage: "Review", count: 145 },
  { stage: "Approved", count: 118 },
  { stage: "Disbursed", count: 102 },
];

const loanTypeData = [
  { name: "Personal", value: 42, color: "hsl(221, 83%, 53%)" },
  { name: "Home", value: 28, color: "hsl(142, 71%, 45%)" },
  { name: "Business", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Vehicle", value: 12, color: "hsl(199, 89%, 48%)" },
];

const trendData = [
  { month: "Aug", applications: 180, disbursed: 120 },
  { month: "Sep", applications: 210, disbursed: 145 },
  { month: "Oct", applications: 195, disbursed: 130 },
  { month: "Nov", applications: 240, disbursed: 170 },
  { month: "Dec", applications: 220, disbursed: 155 },
  { month: "Jan", applications: 270, disbursed: 190 },
];

const recentApps = [
  { id: "CL-2024-1247", name: "Rajesh Kumar", type: "Personal", amount: "₹5,00,000", status: "Under Review", cibil: 742 },
  { id: "CL-2024-1246", name: "Priya Sharma", type: "Home", amount: "₹35,00,000", status: "Approved", cibil: 789 },
  { id: "CL-2024-1245", name: "Amit Patel", type: "Business", amount: "₹15,00,000", status: "KYC Pending", cibil: 655 },
  { id: "CL-2024-1244", name: "Sneha Reddy", type: "Vehicle", amount: "₹8,00,000", status: "Disbursed", cibil: 718 },
  { id: "CL-2024-1243", name: "Vikram Singh", type: "Personal", amount: "₹3,00,000", status: "Rejected", cibil: 580 },
];

const statusStyles: Record<string, string> = {
  "Under Review": "bg-warning/10 text-warning border-warning/20",
  "Approved": "bg-success/10 text-success border-success/20",
  "KYC Pending": "bg-info/10 text-info border-info/20",
  "Disbursed": "bg-primary/10 text-primary border-primary/20",
  "Rejected": "bg-destructive/10 text-destructive border-destructive/20",
};

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  // Use dashboardData if available, otherwise fallback to hardcoded stats for demo
  const displayStats = dashboardData?.stats || stats;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back. Here's your lending overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayStats.map((s) => (
            <Card key={s.label} className="card-shadow transition-shadow hover:card-shadow-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                    <p className="mt-1 font-heading text-2xl font-bold text-foreground">{s.value}</p>
                    <div className="mt-1 flex items-center gap-1 text-xs">
                      {s.up ? (
                        <ArrowUpRight className="h-3 w-3 text-success" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-destructive" />
                      )}
                      <span className={s.up ? "text-success" : "text-destructive"}>{s.change}</span>
                      <span className="text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="card-shadow lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base font-semibold">Loan Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="stage" tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 9%, 46%)" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(221, 83%, 53%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base font-semibold">Loan Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={loanTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {loanTypeData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {loanTypeData.map((t) => (
                  <div key={t.name} className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-muted-foreground">{t.name} ({t.value}%)</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend + Recent */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="card-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base font-semibold">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 9%, 46%)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="applications" stroke="hsl(221, 83%, 53%)" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="disbursed" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="card-shadow lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-base font-semibold">Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="pb-2 font-medium">Application ID</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Type</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">CIBIL</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map((app) => (
                      <tr key={app.id} className="border-b last:border-0">
                        <td className="py-3 font-medium text-primary">{app.id}</td>
                        <td className="py-3">{app.name}</td>
                        <td className="py-3 text-muted-foreground">{app.type}</td>
                        <td className="py-3 font-medium">{app.amount}</td>
                        <td className="py-3">
                          <span className={`font-medium ${app.cibil >= 700 ? "text-success" : app.cibil >= 600 ? "text-warning" : "text-destructive"}`}>
                            {app.cibil}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusStyles[app.status] || ""}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
