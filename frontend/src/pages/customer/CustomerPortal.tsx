import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard, Calendar, IndianRupee, Clock, FileText, Download,
  MessageSquare, Phone, AlertTriangle, Bell, CheckCircle2, Smartphone,
  Banknote, Shield
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function CustomerPortal() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-bold">Customer Portal</h1>
          <p className="text-sm text-muted-foreground">Mobile app interface preview</p>
        </div>

        {/* Loan Status Card */}
        <Card className="card-shadow overflow-hidden">
          <div className="bg-primary p-5 text-primary-foreground">
            <p className="text-xs opacity-80">Active Loan</p>
            <p className="font-heading text-3xl font-bold">₹4,41,153</p>
            <p className="text-xs opacity-80">Outstanding Balance</p>
          </div>
          <CardContent className="grid grid-cols-3 gap-4 p-4">
            <div className="text-center">
              <Calendar className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1 text-xs text-muted-foreground">Next EMI</p>
              <p className="text-sm font-semibold">15 Mar</p>
            </div>
            <div className="text-center">
              <IndianRupee className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1 text-xs text-muted-foreground">EMI Amount</p>
              <p className="text-sm font-semibold">₹16,735</p>
            </div>
            <div className="text-center">
              <Clock className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-1 text-xs text-muted-foreground">Remaining</p>
              <p className="text-sm font-semibold">31 months</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="repay" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="repay">Repay</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="repay" className="space-y-3 pt-3">
            <Card className="card-shadow">
              <CardHeader className="pb-2"><CardTitle className="text-base">Pay EMI</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "UPI", icon: Smartphone, desc: "Pay via Google Pay, PhonePe" },
                  { label: "Net Banking", icon: Banknote, desc: "Pay via bank account" },
                  { label: "Debit Card", icon: CreditCard, desc: "Pay via card" },
                ].map((m) => (
                  <button key={m.label} className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent">
                    <m.icon className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{m.label}</p>
                      <p className="text-xs text-muted-foreground">{m.desc}</p>
                    </div>
                  </button>
                ))}
                <div className="flex items-center justify-between rounded-lg border bg-accent/30 p-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Auto-Debit (NACH)</span>
                  </div>
                  <div className="relative h-6 w-11 rounded-full bg-primary">
                    <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-3 pt-3">
            {[
              { icon: Bell, title: "EMI Reminder", desc: "Your EMI of ₹16,735 is due on 15 Mar", time: "2 days ago", type: "info" },
              { icon: AlertTriangle, title: "Overdue Alert", desc: "Payment for Feb 2026 is overdue", time: "4 days ago", type: "warning" },
              { icon: CheckCircle2, title: "Payment Received", desc: "₹16,735 received for Jan 2026", time: "1 month ago", type: "success" },
            ].map((n, i) => (
              <Card key={i} className="card-shadow">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    n.type === "warning" ? "bg-warning/10" : n.type === "success" ? "bg-success/10" : "bg-primary/10"
                  }`}>
                    <n.icon className={`h-4 w-4 ${
                      n.type === "warning" ? "text-warning" : n.type === "success" ? "text-success" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="documents" className="space-y-3 pt-3">
            {["Sanction Letter", "Loan Agreement", "Account Statement", "EMI Schedule"].map((doc) => (
              <Card key={doc} className="card-shadow">
                <CardContent className="flex items-center gap-3 p-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="flex-1 text-sm font-medium">{doc}</span>
                  <Button size="sm" variant="outline"><Download className="mr-1.5 h-3 w-3" /> Download</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="support" className="space-y-3 pt-3">
            <Card className="card-shadow">
              <CardHeader className="pb-2"><CardTitle className="text-base">Raise a Ticket</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <select className="h-10 w-full rounded-lg border bg-card px-3 text-sm">
                  <option>Select issue type</option>
                  <option>Payment Issue</option>
                  <option>Statement Request</option>
                  <option>Foreclosure Query</option>
                  <option>Other</option>
                </select>
                <Textarea placeholder="Describe your issue..." rows={3} />
                <Button className="w-full">Submit Ticket</Button>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="flex items-center gap-3 p-4">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Chat with Support</p>
                  <p className="text-xs text-muted-foreground">Available 9 AM – 6 PM</p>
                </div>
                <Button size="sm" variant="outline">Open Chat</Button>
              </CardContent>
            </Card>
            <Card className="card-shadow">
              <CardContent className="flex items-center gap-3 p-4">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Collection Officer</p>
                  <p className="text-xs text-muted-foreground">Ravi Kumar — +91 98765 43210</p>
                </div>
                <Button size="sm" variant="outline">Call</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
