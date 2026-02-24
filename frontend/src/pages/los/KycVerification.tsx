import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, CheckCircle2, XCircle, AlertTriangle, Video } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

export default function KycVerification() {
  const [panVerified, setPanVerified] = useState(false);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [cibilFetched, setCibilFetched] = useState(false);
  const [cibilScore] = useState(742);

  const getScoreStatus = (score: number) => {
    if (score >= 700) return { label: "Eligible", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 };
    if (score >= 600) return { label: "Conditional", color: "bg-warning/10 text-warning border-warning/20", icon: AlertTriangle };
    return { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle };
  };

  const scoreStatus = getScoreStatus(cibilScore);

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">KYC & Verification</h1>
          <p className="text-sm text-muted-foreground">Verify customer identity and check credit eligibility</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* PAN Verification */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <CreditCard className="h-4 w-4 text-primary" /> PAN Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>PAN Number</Label>
                <Input placeholder="ABCDE1234F" className="uppercase" maxLength={10} />
              </div>
              <Button className="w-full" onClick={() => setPanVerified(true)}>
                {panVerified ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Verified</> : "Verify PAN"}
              </Button>
              {panVerified && (
                <div className="rounded-lg border bg-success/5 p-3 text-sm">
                  <p className="font-medium text-success">PAN Verified Successfully</p>
                  <p className="text-muted-foreground">Name: RAJESH KUMAR | Status: Active</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aadhaar Verification */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <ShieldCheck className="h-4 w-4 text-primary" /> Aadhaar Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Aadhaar Number</Label>
                <Input placeholder="1234 5678 9012" maxLength={14} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setAadhaarVerified(true)}>Send OTP</Button>
                <Input placeholder="OTP" maxLength={6} className="w-28" />
              </div>
              {aadhaarVerified && (
                <div className="rounded-lg border bg-success/5 p-3 text-sm">
                  <p className="font-medium text-success">Aadhaar Verified</p>
                  <p className="text-muted-foreground">eKYC completed via OTP</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video KYC */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 font-heading text-base">
                <Video className="h-4 w-4 text-primary" /> Video KYC (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
                <Video className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Video KYC / Face Match</p>
                <Button variant="outline" size="sm" className="mt-2">Start Video KYC</Button>
              </div>
            </CardContent>
          </Card>

          {/* CIBIL Check */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">CIBIL Credit Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!cibilFetched ? (
                <Button className="w-full" onClick={() => setCibilFetched(true)}>Fetch Credit Score</Button>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Credit Score</p>
                    <p className="font-heading text-5xl font-bold text-foreground">{cibilScore}</p>
                    <Progress value={(cibilScore / 900) * 100} className="mt-3 h-2" />
                    <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                      <span>300</span><span>900</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${scoreStatus.color}`}>
                      <scoreStatus.icon className="h-3.5 w-3.5" />
                      {scoreStatus.label}
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground">Decision Logic:</p>
                    <p>• &lt;600 → Reject</p>
                    <p>• 600–700 → Refer to Credit Manager</p>
                    <p>• 700+ → Proceed to next stage</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
