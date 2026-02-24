import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, User, Phone, Mail, MapPin, Loader2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

const steps = [
  { label: "Basic Info", icon: User },
  { label: "Contact", icon: Phone },
  { label: "Demographics", icon: MapPin },
  { label: "Confirmation", icon: CheckCircle2 },
];

export default function CustomerOnboarding() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [appId, setAppId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    mobileNumber: "",
    otp: "123456",
    email: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    employmentType: "Salaried",
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
      loadCustomer(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const loadCustomer = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/onboarding/customers/${id}`);
      const { customer, address, employment, application } = res.data;

      setFormData({
        firstName: customer.first_name || "",
        lastName: customer.last_name || "",
        dob: customer.dob || "",
        gender: customer.gender || "",
        mobileNumber: customer.mobile_number || "",
        otp: "123456",
        email: customer.email || "",
        address: address?.street_address || "",
        city: address?.city || "",
        state: address?.state || "",
        pinCode: address?.pin_code || "",
        employmentType: employment?.employment_type || "Salaried",
      });
      setCustomerId(customer.id);
      if (application) setAppId(application.application_number);
    } catch (err) {
      toast.error("Failed to load customer data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (currentStep === 0) {
        const res = await api.post("/onboarding/basic", {
          first_name: formData.firstName,
          last_name: formData.lastName,
          dob: formData.dob,
          gender: formData.gender,
        });
        setCustomerId(res.data.customer_id);
      } else if (currentStep === 1) {
        await api.post("/onboarding/contact", {
          customer_id: customerId,
          mobile_number: formData.mobileNumber,
          email: formData.email,
          otp: formData.otp,
        });
      } else if (currentStep === 2) {
        await api.post("/onboarding/demographics", {
          customer_id: customerId,
          street_address: formData.address,
          city: formData.city,
          state: formData.state,
          pin_code: formData.pinCode,
          employment_type: formData.employmentType,
        });
        const confirmRes = await api.post("/onboarding/confirm", {
          customer_id: customerId,
        });
        setAppId(confirmRes.data.application_number);
      }
      setCurrentStep(currentStep + 1);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold">Customer Onboarding</h1>
            <p className="text-sm text-muted-foreground">Create a new customer profile and loan application</p>
          </div>
          <div className="flex items-center gap-3">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">View Existing:</Label>
            <select
              className="h-9 rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
              value={selectedCustomerId || ""}
            >
              <option value="">New Application...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} (ID: {c.id})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${i <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
                  }`}>
                  {i < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-4 w-4" />}
                </div>
                <span className={`text-[11px] font-medium ${i <= currentStep ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 rounded ${i < currentStep ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="font-heading text-lg">{steps[currentStep].label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentStep === 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>First Name</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Last Name</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => updateField("dob", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <select
                    className="h-10 w-full rounded-lg border bg-card px-3 text-sm"
                    value={formData.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label>Mobile Number</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="+91 98765 43210"
                      className="flex-1"
                      value={formData.mobileNumber}
                      onChange={(e) => updateField("mobileNumber", e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => toast.success("OTP sent: 123456")}>Send OTP</Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>OTP Verification</Label>
                  <Input
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    value={formData.otp}
                    onChange={(e) => updateField("otp", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="customer@email.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>State</Label>
                    <Input
                      placeholder="State"
                      value={formData.state}
                      onChange={(e) => updateField("state", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>PIN Code</Label>
                    <Input
                      placeholder="560001"
                      value={formData.pinCode}
                      onChange={(e) => updateField("pinCode", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Employment Type</Label>
                  <select
                    className="h-10 w-full rounded-lg border bg-card px-3 text-sm"
                    value={formData.employmentType}
                    onChange={(e) => updateField("employmentType", e.target.value)}
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Business Owner">Business Owner</option>
                  </select>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <div className="rounded-xl border bg-accent/50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
                <h3 className="mt-3 font-heading text-lg font-semibold">Profile Created Successfully</h3>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <p>Customer ID: <span className="font-medium text-foreground">{customerId}</span></p>
                  <p>Loan Application ID: <span className="font-medium text-foreground">{appId}</span></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0 || isLoading}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1 || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {currentStep === steps.length - 2 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
