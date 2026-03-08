import { IdCard, CreditCard, FileCheck } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "aadhaarNumber", label: "Aadhaar Number" },
  { key: "panNumber", label: "PAN Number" },
  { key: "voterIdNumber", label: "Voter ID Number" },
  { key: "driverLicenseNumber", label: "Driver's License Number" },
  { key: "passportNumber", label: "Passport Number" },
  { key: "passportExpiry", label: "Passport Expiry Date" },
];

const groups: FieldGroup[] = [
  {
    title: "National IDs",
    icon: IdCard,
    fields: [
      { key: "aadhaarNumber", label: "Aadhaar Number" },
      { key: "panNumber", label: "PAN Number" },
      { key: "voterIdNumber", label: "Voter ID Number" },
    ],
  },
  {
    title: "Licenses & Passport",
    icon: FileCheck,
    fields: [
      { key: "driverLicenseNumber", label: "Driver's License Number" },
      { key: "passportNumber", label: "Passport Number" },
      { key: "passportExpiry", label: "Passport Expiry Date" },
    ],
  },
];

const GovernmentIDsSection = () => (
  <EditableSection
    title="Government IDs"
    subtitle="Your identity document details for applications and verification."
    icon={CreditCard}
    firestoreKey="governmentIds"
    defaultFields={defaultFields}
    groups={groups}
  />
);

export default GovernmentIDsSection;
