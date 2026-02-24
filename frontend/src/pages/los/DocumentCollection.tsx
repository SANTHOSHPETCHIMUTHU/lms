import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, Loader2, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const statusIcon = {
  UPLOADED: <CheckCircle2 className="h-4 w-4 text-success" />,
  VERIFIED: <CheckCircle2 className="h-4 w-4 text-success" />,
  PROCESSING: <Loader2 className="h-4 w-4 animate-spin text-info" />,
  MISSING: <Clock className="h-4 w-4 text-muted-foreground" />,
  complete: <CheckCircle2 className="h-4 w-4 text-success" />,
  processing: <Loader2 className="h-4 w-4 animate-spin text-info" />,
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
};

const DOC_NAMES: Record<string, string> = {
  PAN_CARD: "PAN Card",
  AADHAAR_CARD: "Aadhaar Card",
  BANK_STATEMENT: "Bank Statement",
  SALARY_SLIP: "Salary Slip",
};

export default function DocumentCollection() {
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
      fetchSummary();
    }
  }, [selectedCustomerId]);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/documents/summary/${selectedCustomerId}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  const handleUpload = async (docType: string) => {
    if (!selectedCustomerId) return toast.error("Select a customer first");
    setIsLoading(true);
    try {
      const uploadRes = await api.post("/documents/upload", {
        customer_id: selectedCustomerId,
        document_type: docType,
        file_path: `mock_${docType.toLowerCase()}.pdf`
      });

      // Auto-verify for testing purposes
      await api.post("/documents/verify", {
        document_id: uploadRes.data.document_id,
        verified: true,
        processing_status: "COMPLETED"
      });

      toast.success(`${DOC_NAMES[docType] || docType} uploaded and verified`);
      fetchSummary();

      // Check if all documents are ready to move application status
      await api.get(`/documents/check/${selectedCustomerId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Document Collection</h1>
            <p className="text-sm text-muted-foreground">Upload and verify customer documents for loan processing</p>
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
          {/* Upload Section */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data?.documents?.map((doc: any) => (
                <div key={doc.document_type} className="flex items-center gap-3 rounded-lg border p-3">
                  {statusIcon[doc.status as keyof typeof statusIcon] || <Clock className="h-4 w-4" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{DOC_NAMES[doc.document_type] || doc.document_type}</p>
                    {doc.file && <p className="truncate text-xs text-muted-foreground">{doc.file}</p>}
                  </div>
                  {doc.status === "MISSING" ? (
                    <Button size="sm" variant="outline" onClick={() => handleUpload(doc.document_type)} disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />}
                      <Upload className="mr-1.5 h-3 w-3" /> Upload
                    </Button>
                  ) : (
                    <span className={`text-[11px] font-medium capitalize ${doc.status === "VERIFIED" ? "text-success" : doc.status === "PROCESSING" ? "text-info" : "text-muted-foreground"}`}>
                      {doc.status.toLowerCase()}
                    </span>
                  )}
                </div>
              ))}

              {!data && (
                <p className="text-center text-sm text-muted-foreground py-8">Select a customer to see required documents</p>
              )}
            </CardContent>
          </Card>

          {/* Employment Details */}
          <div className="space-y-4">
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Company Name</Label>
                  <Input defaultValue={data?.employment?.company_name || "N/A"} readOnly />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Designation</Label>
                    <Input defaultValue={data?.employment?.designation || "N/A"} readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Experience (Years)</Label>
                    <Input type="number" defaultValue={data?.employment?.experience_years || 0} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Monthly Income</Label>
                    <Input defaultValue={`₹${data?.employment?.monthly_income || 0}`} readOnly />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Employment Type</Label>
                    <Input defaultValue={data?.employment?.employment_type || "N/A"} readOnly />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Status */}
            <Card className="card-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-base">Processing Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.processing?.length > 0 ? data.processing.map((p: any) => (
                  <div key={p.step_name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {statusIcon[p.status.toLowerCase() as keyof typeof statusIcon]}
                        <span>{p.step_name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1.5" />
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No active processing</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
