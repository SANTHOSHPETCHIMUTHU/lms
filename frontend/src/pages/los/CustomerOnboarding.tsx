import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Circle, User, Phone, Mail, MapPin } from "lucide-react";
import { useState } from "react";

const steps = [
  { label: "Basic Info", icon: User },
  { label: "Contact", icon: Phone },
  { label: "Demographics", icon: MapPin },
  { label: "Confirmation", icon: CheckCircle2 },
];

export default function CustomerOnboarding() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">Customer Onboarding</h1>
          <p className="text-sm text-muted-foreground">Create a new customer profile and loan application</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
                  i <= currentStep ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground"
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
                    <Input placeholder="Enter first name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Last Name</Label>
                    <Input placeholder="Enter last name" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Date of Birth</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <select className="h-10 w-full rounded-lg border bg-card px-3 text-sm">
                    <option>Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </>
            )}
            {currentStep === 1 && (
              <>
                <div className="space-y-1.5">
                  <Label>Mobile Number</Label>
                  <div className="flex gap-2">
                    <Input placeholder="+91 98765 43210" className="flex-1" />
                    <Button variant="outline" size="sm">Send OTP</Button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>OTP Verification</Label>
                  <Input placeholder="Enter 6-digit OTP" maxLength={6} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="customer@email.com" />
                </div>
              </>
            )}
            {currentStep === 2 && (
              <>
                <div className="space-y-1.5">
                  <Label>Address</Label>
                  <Input placeholder="Street address" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label>City</Label>
                    <Input placeholder="City" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>State</Label>
                    <Input placeholder="State" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>PIN Code</Label>
                    <Input placeholder="560001" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Employment Type</Label>
                  <select className="h-10 w-full rounded-lg border bg-card px-3 text-sm">
                    <option>Salaried</option>
                    <option>Self-Employed</option>
                    <option>Business Owner</option>
                  </select>
                </div>
              </>
            )}
            {currentStep === 3 && (
              <div className="rounded-xl border bg-accent/50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
                <h3 className="mt-3 font-heading text-lg font-semibold">Profile Created Successfully</h3>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <p>Customer ID: <span className="font-medium text-foreground">CUST-2024-4821</span></p>
                  <p>Loan Application ID: <span className="font-medium text-foreground">CL-2024-1248</span></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))} disabled={currentStep === steps.length - 1}>
            {currentStep === steps.length - 2 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
