import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const documents = [
  { name: "PAN Card", status: "uploaded", file: "pan_card_rajesh.pdf" },
  { name: "Aadhaar Card", status: "uploaded", file: "aadhaar_rajesh.pdf" },
  { name: "Bank Statements (6 months)", status: "processing", file: "bank_stmt.pdf" },
  { name: "Salary Slips (3 months)", status: "pending", file: null },
];

const processing = [
  { label: "OCR Extraction", status: "complete", progress: 100 },
  { label: "Bank Statement Analysis", status: "processing", progress: 65 },
  { label: "Income Validation", status: "pending", progress: 0 },
  { label: "EMI Eligibility Calculation", status: "pending", progress: 0 },
];

const statusIcon = {
  uploaded: <CheckCircle2 className="h-4 w-4 text-success" />,
  processing: <Loader2 className="h-4 w-4 animate-spin text-info" />,
  pending: <Clock className="h-4 w-4 text-muted-foreground" />,
  complete: <CheckCircle2 className="h-4 w-4 text-success" />,
};

export default function DocumentCollection() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Document Collection</h1>
          <p className="text-sm text-muted-foreground">Upload and verify customer documents for loan processing</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Upload Section */}
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-base">Required Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.name} className="flex items-center gap-3 rounded-lg border p-3">
                  {statusIcon[doc.status as keyof typeof statusIcon]}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{doc.name}</p>
                    {doc.file && <p className="truncate text-xs text-muted-foreground">{doc.file}</p>}
                  </div>
                  {doc.status === "pending" ? (
                    <Button size="sm" variant="outline">
                      <Upload className="mr-1.5 h-3 w-3" /> Upload
                    </Button>
                  ) : (
                    <span className={`text-[11px] font-medium capitalize ${doc.status === "uploaded" ? "text-success" : doc.status === "processing" ? "text-info" : "text-muted-foreground"}`}>
                      {doc.status}
                    </span>
                  )}
                </div>
              ))}

              <div className="rounded-xl border-2 border-dashed p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm font-medium text-muted-foreground">Drag & drop or click to upload</p>
                <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
              </div>
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
                  <Input defaultValue="Infosys Ltd." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Designation</Label>
                    <Input defaultValue="Senior Analyst" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Experience (Years)</Label>
                    <Input type="number" defaultValue="8" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Monthly Income</Label>
                    <Input defaultValue="₹85,000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Employment Type</Label>
                    <Input defaultValue="Salaried" readOnly />
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
                {processing.map((p) => (
                  <div key={p.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {statusIcon[p.status as keyof typeof statusIcon]}
                        <span>{p.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{p.progress}%</span>
                    </div>
                    <Progress value={p.progress} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
