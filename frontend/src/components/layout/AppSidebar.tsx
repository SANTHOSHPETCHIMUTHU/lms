import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard, UserPlus, ShieldCheck, FileText, UserCog, CheckCircle2,
  Banknote, CreditCard, AlertTriangle, Smartphone, Scale, Settings,
  ChevronDown, LogOut, Bell, Search,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";

const losItems = [
  { title: "Customer Onboarding", url: "/los/onboarding", icon: UserPlus },
  { title: "KYC Verification", url: "/los/kyc", icon: ShieldCheck },
  { title: "Document Collection", url: "/los/documents", icon: FileText },
  { title: "Credit Review", url: "/los/credit-review", icon: UserCog },
  { title: "Loan Approval", url: "/los/approval", icon: CheckCircle2 },
  { title: "Disbursement", url: "/los/disbursement", icon: Banknote },
];

const lmsItems = [
  { title: "Loan Servicing", url: "/lms/servicing", icon: CreditCard },
  { title: "Collection & Recovery", url: "/lms/collection", icon: AlertTriangle },
];

const otherItems = [
  { title: "Customer Portal", url: "/customer", icon: Smartphone },
  { title: "Compliance", url: "/compliance", icon: Scale },
];

function SidebarSection({ label, items }: { label: string; items: typeof losItems }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/60 text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  return (
    <Sidebar className="border-r-0">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <span className="font-heading text-sm font-bold text-sidebar-primary-foreground">C3</span>
        </div>
        <div>
          <h1 className="font-heading text-sm font-bold text-sidebar-foreground">CubeLoan360</h1>
          <p className="text-[10px] text-sidebar-foreground/50">LOS / LMS Platform</p>
        </div>
      </div>

      <SidebarContent className="px-3 pt-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  >
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSection label="Loan Origination" items={losItems} />
        <SidebarSection label="Loan Management" items={lmsItems} />
        <SidebarSection label="Other" items={otherItems} />
      </SidebarContent>

      <div className="mt-auto border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
            AK
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs font-medium text-sidebar-foreground">Admin User</p>
            <p className="truncate text-[10px] text-sidebar-foreground/50">admin@cubeloan360.com</p>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
