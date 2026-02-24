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
  const [isSavingEmployment, setIsSavingEmployment] = useState(false);

  // Employment State
  const [employmentData, setEmploymentData] = useState({
    company_name: "",
    designation: "",
    experience_years: 0,
    monthly_income: 0,
    employment_type: "Salaried"
  });

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
      if (res.data.employment) {
        setEmploymentData({
          company_name: res.data.employment.company_name || "",
          designation: res.data.employment.designation || "",
          experience_years: res.data.employment.experience_years || 0,
          monthly_income: res.data.employment.monthly_income || 0,
          employment_type: res.data.employment.employment_type || "Salaried"
        });
      }
    } catch (err) {
      console.error("Failed to fetch summary", err);
    }
  };

  const handleEmploymentSave = async () => {
    if (!selectedCustomerId) return toast.error("Select a customer first");
    setIsSavingEmployment(true);
    try {
      await api.post("/documents/employment", {
        customer_id: selectedCustomerId,
        ...employmentData
      });
      toast.success("Employment details saved successfully");
      fetchSummary();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save employment details");
    } finally {
      setIsSavingEmployment(false);
    }
  };

  const handleUpload = async (docType: string, file?: File) => {
    if (!selectedCustomerId) return toast.error("Select a customer first");
    setIsLoading(true);
    try {
      const fileName = file ? file.name : `mock_${docType.toLowerCase()}.pdf`;
      const uploadRes = await api.post("/documents/upload", {
        customer_id: selectedCustomerId,
        document_type: docType,
        file_path: fileName
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
                    {doc.file ? (
                      <p className="truncate text-xs text-muted-foreground">{doc.file}</p>
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="file"
                          id={`file-${doc.document_type}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(doc.document_type, file);
                          }}
                        />
                        <Label
                          htmlFor={`file-${doc.document_type}`}
                          className="flex h-7 cursor-pointer items-center gap-1.5 rounded-md border bg-muted/50 px-2 text-[10px] hover:bg-muted"
                        >
                          <Upload className="h-3 w-3" /> Select File
                        </Label>
                        <span className="text-[10px] text-muted-foreground italic">No file chosen</span>
                      </div>
                    )}
                  </div>
                  <span className={`text-[11px] font-medium capitalize ${doc.status === "VERIFIED" ? "text-success" : doc.status === "PROCESSING" ? "text-info" : "text-muted-foreground"}`}>
                    {doc.status.toLowerCase()}
                  </span>
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
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Company Name</Label>
                  <Input
                    value={employmentData.company_name}
                    onChange={(e) => setEmploymentData({ ...employmentData, company_name: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Designation</Label>
                    <Input
                      value={employmentData.designation}
                      onChange={(e) => setEmploymentData({ ...employmentData, designation: e.target.value })}
                      placeholder="e.g. Manager"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Experience (Years)</Label>
                    <Input
                      type="number"
                      value={employmentData.experience_years}
                      onChange={(e) => setEmploymentData({ ...employmentData, experience_years: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Monthly Income</Label>
                    <Input
                      type="number"
                      value={employmentData.monthly_income}
                      onChange={(e) => setEmploymentData({ ...employmentData, monthly_income: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Employment Type</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={employmentData.employment_type}
                      onChange={(e) => setEmploymentData({ ...employmentData, employment_type: e.target.value })}
                    >
                      <option value="Salaried">Salaried</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Business">Business</option>
                    </select>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleEmploymentSave}
                  disabled={isSavingEmployment || !selectedCustomerId}
                >
                  {isSavingEmployment && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Employment Details
                </Button>
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
