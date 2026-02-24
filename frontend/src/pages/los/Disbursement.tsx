import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Banknote, Building2, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const emiSchedule = [
  { no: 1, date: "15 Mar 2026", emi: "₹16,735", principal: "₹11,527", interest: "₹5,208", balance: "₹4,88,473" },
  { no: 2, date: "15 Apr 2026", emi: "₹16,735", principal: "₹11,647", interest: "₹5,088", balance: "₹4,76,826" },
  { no: 3, date: "15 May 2026", emi: "₹16,735", principal: "₹11,768", interest: "₹4,967", balance: "₹4,65,058" },
  { no: 4, date: "15 Jun 2026", emi: "₹16,735", principal: "₹11,891", interest: "₹4,844", balance: "₹4,53,167" },
  { no: 5, date: "15 Jul 2026", emi: "₹16,735", principal: "₹12,014", interest: "₹4,721", balance: "₹4,41,153" },
  { no: 6, date: "15 Aug 2026", emi: "₹16,735", principal: "₹12,140", interest: "₹4,595", balance: "₹4,29,013" },
];

export default function Disbursement() {
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
            <h1 className="font-heading text-2xl font-bold">Disbursement</h1>
            <p className="text-sm text-muted-foreground">Confirm disbursement and generate EMI schedule</p>
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
            {/* Disbursement Confirmation */}
            <Card className="card-shadow border-success/20 bg-success/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20">
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-success">Loan Approved & Ready for Disbursement</h3>
                    <p className="text-sm text-muted-foreground">Application {application?.application_number} – {profile?.first_name} {profile?.last_name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Bank Account */}
              <Card className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-heading text-base">
                    <Building2 className="h-4 w-4 text-primary" /> Disbursement Account
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Account Holder</span><span className="font-medium">{profile?.first_name} {profile?.last_name}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Bank</span><span className="font-medium">HDFC Bank</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Account No.</span><span className="font-medium">XXXX XXXX 4521</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">IFSC</span><span className="font-medium">HDFC0001234</span></div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-sm font-semibold"><span>Disbursement Amount</span><span className="text-primary">₹5,00,000</span></div>
                  </div>
                  <Button className="mt-2 w-full"><Banknote className="mr-2 h-4 w-4" /> Confirm Disbursement</Button>
                </CardContent>
              </Card>

              {/* Summary Card for Customer */}
              <Card className="card-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 font-heading text-base">
                    <Calendar className="h-4 w-4 text-primary" /> Loan Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Loan Amount</span><span className="font-medium">₹5,00,000</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Interest Rate</span><span className="font-medium">12.5% p.a.</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tenure</span><span className="font-medium">36 months</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Monthly EMI</span><span className="font-bold text-primary">₹16,735</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Interest</span><span className="font-medium">₹1,02,460</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">Total Payable</span><span className="font-medium">₹6,02,460</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted-foreground">First EMI Date</span><span className="font-medium">15 Mar 2026</span></div>
                </CardContent>
              </Card>
            </div>

            {/* EMI Schedule */}
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">EMI Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-xs text-muted-foreground">
                        <th className="pb-2 font-medium">#</th>
                        <th className="pb-2 font-medium">Due Date</th>
                        <th className="pb-2 font-medium">EMI</th>
                        <th className="pb-2 font-medium">Principal</th>
                        <th className="pb-2 font-medium">Interest</th>
                        <th className="pb-2 font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emiSchedule.map((e) => (
                        <tr key={e.no} className="border-b last:border-0">
                          <td className="py-2.5 font-medium">{e.no}</td>
                          <td className="py-2.5">{e.date}</td>
                          <td className="py-2.5 font-medium">{e.emi}</td>
                          <td className="py-2.5">{e.principal}</td>
                          <td className="py-2.5 text-muted-foreground">{e.interest}</td>
                          <td className="py-2.5 font-medium">{e.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-center text-xs text-muted-foreground">Showing first 6 of 36 installments</p>
              </CardContent>
            </Card>
          </>
        ) : selectedCustomerId && isLoading ? (
          <div className="flex h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex h-[40vh] items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
            <p className="text-muted-foreground">Select an application from the top right to view disbursement details</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
