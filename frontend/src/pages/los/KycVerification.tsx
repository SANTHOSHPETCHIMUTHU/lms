import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CreditCard, CheckCircle2, XCircle, AlertTriangle, Video, Loader2, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function KycVerification() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Video KYC State
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [panNumber, setPanNumber] = useState("");
  const [panVerified, setPanVerified] = useState(false);

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  const [cibilScore, setCibilScore] = useState<number | null>(null);
  const [isFetchingCibil, setIsFetchingCibil] = useState(false);

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
      fetchKycDetails(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const fetchKycDetails = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await api.get("/kyc/complete", { params: { customer_id: id } }).catch(() => null);
      if (res && res.data) {
        setPanNumber(res.data.pan_number || "");
        setPanVerified(res.data.pan_verified || false);
        setAadhaarNumber(res.data.aadhaar_number || "");
        setAadhaarVerified(res.data.aadhaar_verified || false);
        setCibilScore(res.data.cibil_score || null);
      } else {
        // Reset if no record
        setPanNumber("");
        setPanVerified(false);
        setAadhaarNumber("");
        setAadhaarVerified(false);
        setCibilScore(null);
      }
    } catch (err) {
      console.error("Error fetching KYC", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePanVerify = async () => {
    if (!selectedCustomerId) return toast.error("Select a customer first");
    setIsLoading(true);
    try {
      await api.post("/kyc/pan", {
        customer_id: selectedCustomerId,
        pan_number: panNumber
      });
      setPanVerified(true);
      toast.success("PAN Verified Successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "PAN Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarVerify = async () => {
    if (!selectedCustomerId) return toast.error("Select a customer first");
    setIsLoading(true);
    try {
      await api.post("/kyc/aadhaar", {
        customer_id: selectedCustomerId,
        aadhaar_number: aadhaarNumber
      });
      setAadhaarVerified(true);
      toast.success("Aadhaar Verified Successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Aadhaar Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCibilFetch = async () => {
    if (!selectedCustomerId) return toast.error("Select a customer first");
    setIsFetchingCibil(true);
    try {
      const res = await api.post("/kyc/credit", {
        customer_id: selectedCustomerId,
        cibil_score: 700 + Math.floor(Math.random() * 150)
      });
      setCibilScore(res.data.score || 750);
      toast.success("Credit Score Fetched Successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to fetch credit score");
    } finally {
      setIsFetchingCibil(false);
    }
  };

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsVideoActive(true);
      toast.success("Camera Access Granted");
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please allow permissions.");
    }
  };

  const stopVideo = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsVideoActive(false);
  };

  useEffect(() => {
    return () => {
      // Cleanup: stop stream when unmounting
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const getScoreStatus = (score: number) => {
    if (score >= 700) return { label: "Eligible", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 };
    if (score >= 600) return { label: "Conditional", color: "bg-warning/10 text-warning border-warning/20", icon: AlertTriangle };
    return { label: "Rejected", color: "bg-destructive/10 text-destructive border-destructive/20", icon: XCircle };
  };

  const scoreStatus = cibilScore ? getScoreStatus(cibilScore) : null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">KYC & Verification</h1>
            <p className="text-sm text-muted-foreground">Verify customer identity and check credit eligibility</p>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Customer:</Label>
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

        <div className="grid gap-4 md:grid-cols-2">
          {/* PAN Verification */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between font-heading text-base">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" /> PAN Verification
                </div>
                <Badge variant="outline" className="text-[10px] uppercase bg-muted/50">Simulated</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>PAN Number</Label>
                <Input
                  placeholder="ABCDE1234F"
                  className="uppercase"
                  maxLength={10}
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                />
              </div>
              <Button className="w-full" onClick={handlePanVerify} disabled={isLoading || panVerified}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {panVerified ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Verified</> : "Run Mock Verification"}
              </Button>
              {panVerified && (
                <div className="rounded-lg border bg-success/5 p-3 text-sm">
                  <p className="font-medium text-success">PAN Verified (Mock)</p>
                  <p className="text-muted-foreground">Internal API check successful</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Aadhaar Verification */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between font-heading text-base">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Aadhaar Verification
                </div>
                <Badge variant="outline" className="text-[10px] uppercase bg-muted/50">Simulated</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Aadhaar Number</Label>
                <Input
                  placeholder="1234 5678 9012"
                  maxLength={14}
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleAadhaarVerify} disabled={isLoading || aadhaarVerified}>
                  {aadhaarVerified ? <><CheckCircle2 className="mr-2 h-4 w-4" /> Verified</> : "Simulate OTP"}
                </Button>
                <Input placeholder="OTP" maxLength={6} className="w-28" defaultValue="123456" />
              </div>
              <p className="text-[10px] text-muted-foreground italic">Note: Use default OTP 123456 for demo</p>
              {aadhaarVerified && (
                <div className="rounded-lg border bg-success/5 p-3 text-sm">
                  <p className="font-medium text-success">Aadhaar Verified (Mock)</p>
                  <p className="text-muted-foreground">eKYC simulated via holder service</p>
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
              <div className="relative flex h-48 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-muted/30">
                {isVideoActive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <Video className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Video KYC / Face Match</p>
                  </>
                )}

                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
                  {!isVideoActive ? (
                    <Button variant="outline" size="sm" className="bg-background" onClick={startVideo}>
                      Start Video KYC
                    </Button>
                  ) : (
                    <Button variant="destructive" size="sm" onClick={stopVideo}>
                      Stop Camera
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CIBIL Check */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">CIBIL Credit Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cibilScore === null ? (
                <Button className="w-full" onClick={handleCibilFetch} disabled={isFetchingCibil}>
                  {isFetchingCibil && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Fetch Credit Score
                </Button>
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
                  {scoreStatus && (
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${scoreStatus.color}`}>
                        <scoreStatus.icon className="h-3.5 w-3.5" />
                        {scoreStatus.label}
                      </span>
                    </div>
                  )}
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
