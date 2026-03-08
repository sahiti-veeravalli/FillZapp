import { useState, useEffect, useMemo } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  User, UserCircle, MapPin, Briefcase, GraduationCap, Target,
  IdCard, CreditCard, Globe, FileText, PlusCircle, Settings,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";

export interface SearchResult {
  tab: string;
  fieldKey: string;
}

interface SearchableItem {
  tab: string;
  tabLabel: string;
  tabIcon: LucideIcon;
  fieldKey: string;
  fieldLabel: string;
}

const searchIndex: SearchableItem[] = [
  // Overview
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "fullName", fieldLabel: "Full Name" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "email", fieldLabel: "Email" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "phone", fieldLabel: "Phone" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "address", fieldLabel: "Address" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "dateOfBirth", fieldLabel: "Date of Birth" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "university", fieldLabel: "University" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "degree", fieldLabel: "Degree" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "graduationYear", fieldLabel: "Graduation Year" },
  { tab: "overview", tabLabel: "Overview", tabIcon: User, fieldKey: "gpa", fieldLabel: "GPA" },

  // Personal Info
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "fullName", fieldLabel: "Full Name" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "email", fieldLabel: "Email" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "phone", fieldLabel: "Phone Number" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "dateOfBirth", fieldLabel: "Date of Birth" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "gender", fieldLabel: "Gender" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "address", fieldLabel: "Address" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "city", fieldLabel: "City" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "state", fieldLabel: "State" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "zipCode", fieldLabel: "ZIP Code" },
  { tab: "personal", tabLabel: "Personal Info", tabIcon: UserCircle, fieldKey: "country", fieldLabel: "Country" },

  // Addresses
  { tab: "addresses", tabLabel: "Addresses", tabIcon: MapPin, fieldKey: "addresses", fieldLabel: "Addresses" },

  // Professional
  { tab: "professional", tabLabel: "Professional", tabIcon: Briefcase, fieldKey: "jobTitle", fieldLabel: "Job Title" },
  { tab: "professional", tabLabel: "Professional", tabIcon: Briefcase, fieldKey: "company", fieldLabel: "Company" },
  { tab: "professional", tabLabel: "Professional", tabIcon: Briefcase, fieldKey: "experience", fieldLabel: "Years of Experience" },
  { tab: "professional", tabLabel: "Professional", tabIcon: Briefcase, fieldKey: "linkedin", fieldLabel: "LinkedIn" },
  { tab: "professional", tabLabel: "Professional", tabIcon: Briefcase, fieldKey: "github", fieldLabel: "GitHub" },
  { tab: "professional", tabLabel: "Professional", tabIcon: Briefcase, fieldKey: "portfolio", fieldLabel: "Portfolio" },

  // Education
  { tab: "education", tabLabel: "Education", tabIcon: GraduationCap, fieldKey: "university", fieldLabel: "University" },
  { tab: "education", tabLabel: "Education", tabIcon: GraduationCap, fieldKey: "degree", fieldLabel: "Degree" },
  { tab: "education", tabLabel: "Education", tabIcon: GraduationCap, fieldKey: "graduationYear", fieldLabel: "Graduation Year" },
  { tab: "education", tabLabel: "Education", tabIcon: GraduationCap, fieldKey: "gpa", fieldLabel: "GPA" },

  // Job Preferences
  { tab: "job-preferences", tabLabel: "Job Preferences", tabIcon: Target, fieldKey: "desiredRole", fieldLabel: "Desired Role" },
  { tab: "job-preferences", tabLabel: "Job Preferences", tabIcon: Target, fieldKey: "preferredLocation", fieldLabel: "Preferred Location" },
  { tab: "job-preferences", tabLabel: "Job Preferences", tabIcon: Target, fieldKey: "salaryExpectation", fieldLabel: "Salary Expectation" },
  { tab: "job-preferences", tabLabel: "Job Preferences", tabIcon: Target, fieldKey: "jobType", fieldLabel: "Job Type" },

  // Government IDs
  { tab: "government-ids", tabLabel: "Government IDs", tabIcon: IdCard, fieldKey: "aadhaarNumber", fieldLabel: "Aadhaar Number" },
  { tab: "government-ids", tabLabel: "Government IDs", tabIcon: IdCard, fieldKey: "panNumber", fieldLabel: "PAN Number" },
  { tab: "government-ids", tabLabel: "Government IDs", tabIcon: IdCard, fieldKey: "voterIdNumber", fieldLabel: "Voter ID Number" },
  { tab: "government-ids", tabLabel: "Government IDs", tabIcon: IdCard, fieldKey: "driverLicenseNumber", fieldLabel: "Driver's License" },
  { tab: "government-ids", tabLabel: "Government IDs", tabIcon: IdCard, fieldKey: "passportNumber", fieldLabel: "Passport Number" },
  { tab: "government-ids", tabLabel: "Government IDs", tabIcon: IdCard, fieldKey: "passportExpiry", fieldLabel: "Passport Expiry" },

  // Financial
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "cardholderName", fieldLabel: "Cardholder Name" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "cardNumber", fieldLabel: "Card Number" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "cardExpiry", fieldLabel: "Card Expiry" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "cardCvv", fieldLabel: "CVV" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "billingZip", fieldLabel: "Billing ZIP" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "bankName", fieldLabel: "Bank Name" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "accountNumber", fieldLabel: "Account Number" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "ifscCode", fieldLabel: "IFSC Code" },
  { tab: "financial", tabLabel: "Financial & Payments", tabIcon: CreditCard, fieldKey: "upiId", fieldLabel: "UPI ID" },

  // Social Profiles
  { tab: "social-profiles", tabLabel: "Social Profiles", tabIcon: Globe, fieldKey: "socialProfiles", fieldLabel: "Social Profiles" },

  // Documents
  { tab: "documents", tabLabel: "Documents", tabIcon: FileText, fieldKey: "documents", fieldLabel: "Documents" },

  // Custom Fields
  { tab: "custom-fields", tabLabel: "Custom Fields", tabIcon: PlusCircle, fieldKey: "customFields", fieldLabel: "Custom Fields" },

  // Settings
  { tab: "settings", tabLabel: "Settings", tabIcon: Settings, fieldKey: "settings", fieldLabel: "Settings" },
];

interface DashboardSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (result: SearchResult) => void;
}

const DashboardSearch = ({ open, onOpenChange, onSelect }: DashboardSearchProps) => {
  const [query, setQuery] = useState("");

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  // Group results by tab
  const grouped = useMemo(() => {
    const groups: Record<string, { label: string; icon: LucideIcon; items: SearchableItem[] }> = {};
    for (const item of searchIndex) {
      if (!groups[item.tab]) {
        groups[item.tab] = { label: item.tabLabel, icon: item.tabIcon, items: [] };
      }
      groups[item.tab].items.push(item);
    }
    return groups;
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search fields, sections…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(grouped).map(([tab, group]) => (
          <CommandGroup key={tab} heading={group.label}>
            {group.items.map((item) => (
              <CommandItem
                key={`${item.tab}-${item.fieldKey}`}
                value={`${item.tabLabel} ${item.fieldLabel}`}
                onSelect={() => {
                  // Close first, then navigate after a tick so dialog doesn't swallow the event
                  onOpenChange(false);
                  setTimeout(() => {
                    onSelect({ tab: item.tab, fieldKey: item.fieldKey });
                  }, 50);
                }}
                className="gap-3 cursor-pointer"
              >
                <item.tabIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <span>{item.fieldLabel}</span>
                <span className="ml-auto text-xs text-muted-foreground">{item.tabLabel}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};

export default DashboardSearch;
