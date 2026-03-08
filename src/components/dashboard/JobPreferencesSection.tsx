import { Target, Languages, Coins } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "skills", label: "Key Skills" },
  { key: "expectedSalary", label: "Expected Salary (CTC)" },
  { key: "currentSalary", label: "Current Salary (CTC)" },
  { key: "noticePeriod", label: "Notice Period" },
  { key: "preferredLocation", label: "Preferred Location" },
  { key: "jobType", label: "Job Type (Full-time / Remote)" },
  { key: "languages", label: "Languages Known" },
  { key: "certifications", label: "Certifications" },
  { key: "availability", label: "Available From" },
];

const groups: FieldGroup[] = [
  {
    title: "Career Details",
    icon: Coins,
    fields: [
      { key: "skills", label: "Key Skills" },
      { key: "expectedSalary", label: "Expected Salary (CTC)" },
      { key: "currentSalary", label: "Current Salary (CTC)" },
      { key: "noticePeriod", label: "Notice Period" },
      { key: "availability", label: "Available From" },
    ],
  },
  {
    title: "Preferences & Languages",
    icon: Languages,
    fields: [
      { key: "preferredLocation", label: "Preferred Location" },
      { key: "jobType", label: "Job Type (Full-time / Remote)" },
      { key: "languages", label: "Languages Known" },
      { key: "certifications", label: "Certifications" },
    ],
  },
];

const JobPreferencesSection = ({ highlightField }: { highlightField?: string | null }) => (
  <EditableSection
    title="Job Preferences"
    subtitle="Career preferences and skills for job portal applications."
    icon={Target}
    firestoreKey="jobPreferences"
    defaultFields={defaultFields}
    groups={groups}
    highlightField={highlightField}
  />
);

export default JobPreferencesSection;
