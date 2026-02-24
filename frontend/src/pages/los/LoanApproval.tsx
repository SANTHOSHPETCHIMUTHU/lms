import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, FileText, Mail, MessageSquare, Smartphone, PenTool, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LoanApproval() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      loadCustomer(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const loadCustomer = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/onboarding/customers/${id}`);
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load customer data");
    } finally {
      setIsLoading(false);
    }
  };

  const profile = data?.customer;
  const application = data?.application;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Loan Approval & Agreement</h1>
            <p className="text-sm text-muted-foreground">Generate sanction letter and complete digital signing</p>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Application:</Label>
            <select
              className="h-9 rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              value={selectedCustomerId || ""}
            >
              <option value="">Choose...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} (ID: {c.id})</option>
              ))}
            </select>
          </div>
        </div>

        {selectedCustomerId && !isLoading ? (
          <>
            {/* Sanction Letter */}
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Sanction Letter Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border bg-muted/20 p-6 font-body text-sm leading-relaxed">
                  <div className="mb-4 text-center">
                    <h3 className="font-heading text-lg font-bold text-primary">CubeLoan360 Finance Ltd.</h3>
                    <p className="text-xs text-muted-foreground">Ref: {application?.application_number || 'REG-PENDING'} | Date: {new Date().toLocaleDateString()}</p>
                  </div>
                  <p className="mb-2">Dear <strong>{profile?.first_name} {profile?.last_name}</strong>,</p>
                  <p className="mb-3">We are pleased to inform you that your loan application <strong>{application?.application_number}</strong> has been approved with the following terms:</p>
                  <div className="mb-4 grid gap-2 rounded-lg bg-accent/50 p-4 sm:grid-cols-2">
                    <div><span className="text-xs text-muted-foreground">Loan Amount</span><p className="font-semibold">₹5,00,000</p></div>
                    <div><span className="text-xs text-muted-foreground">Interest Rate</span><p className="font-semibold">12.5% p.a.</p></div>
                    <div><span className="text-xs text-muted-foreground">Tenure</span><p className="font-semibold">36 months</p></div>
                    <div><span className="text-xs text-muted-foreground">EMI Amount</span><p className="font-semibold">₹16,735</p></div>
                  </div>
                  <p className="text-xs text-muted-foreground">This sanction is valid for 30 days from the date of issue.</p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Download PDF</Button>
                  <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Email to Customer</Button>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Customer Notification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { icon: MessageSquare, label: "SMS Sent", status: "Delivered", ok: true },
                    { icon: Mail, label: "Email Sent", status: "Delivered", ok: true },
                    { icon: Smartphone, label: "App Notification", status: "Sent", ok: true },
                  ].map((n) => (
                    <div key={n.label} className="flex items-center gap-3 rounded-lg border p-3">
                      <n.icon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{n.label}</p>
                        <p className="text-xs text-success">{n.status}</p>
                      </div>
                      <CheckCircle2 className="ml-auto h-4 w-4 text-success" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* eSign */}
            <Card className="card-shadow border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-heading text-base">
                  <PenTool className="h-4 w-4 text-primary" /> Digital Agreement Signing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border-2 border-dashed bg-accent/30 p-8 text-center">
                  <PenTool className="mx-auto h-10 w-10 text-primary/40" />
                  <p className="mt-3 font-heading text-sm font-semibold">Aadhaar eSign Interface</p>
                  <p className="text-xs text-muted-foreground">Customer will authenticate via Aadhaar OTP to digitally sign the agreement</p>
                  <Button className="mt-4">Initiate eSign</Button>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>eSign compliant with Information Technology Act, 2000 and RBI Digital Lending Guidelines</span>
                </div>
              </CardContent>
            </Card>
          </>
        ) : selectedCustomerId && isLoading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
            <p className="text-muted-foreground">Select an application from the top right to generate agreement</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
