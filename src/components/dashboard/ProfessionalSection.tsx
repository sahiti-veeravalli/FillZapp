import EditableSection, { type FieldGroup } from "./EditableSection";
import { Briefcase, Link2, Building, KeyRound } from "lucide-react";

const allFields = [
  { key: "jobTitle", label: "Job Title" },
  { key: "company", label: "Company" },
  { key: "experience", label: "Years of Experience" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "linkedinPassword", label: "LinkedIn Password", isPassword: true },
  { key: "github", label: "GitHub" },
  { key: "githubPassword", label: "GitHub Password", isPassword: true },
  { key: "portfolio", label: "Portfolio" },
];

const groups: FieldGroup[] = [
  {
    title: "Work",
    icon: Building,
    fields: [
      { key: "jobTitle", label: "Job Title" },
      { key: "company", label: "Company" },
      { key: "experience", label: "Years of Experience" },
    ],
  },
  {
    title: "Links & Credentials",
    icon: KeyRound,
    fields: [
      { key: "linkedin", label: "LinkedIn" },
      { key: "linkedinPassword", label: "LinkedIn Password", isPassword: true },
      { key: "github", label: "GitHub" },
      { key: "githubPassword", label: "GitHub Password", isPassword: true },
      { key: "portfolio", label: "Portfolio" },
    ],
  },
];

const ProfessionalSection = () => (
  <EditableSection
    title="Professional"
    subtitle="Manage your professional links, credentials, and work details."
    icon={Briefcase}
    firestoreKey="professional"
    defaultFields={allFields}
    groups={groups}
  />
);

export default ProfessionalSection;