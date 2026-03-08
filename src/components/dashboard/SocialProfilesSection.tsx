import { Globe, Instagram } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "twitter", label: "Twitter / X", hasPassword: true },
  { key: "instagram", label: "Instagram", hasPassword: true },
  { key: "facebook", label: "Facebook", hasPassword: true },
  { key: "youtube", label: "YouTube", hasPassword: true },
  { key: "personalWebsite", label: "Personal Website" },
  { key: "stackOverflow", label: "Stack Overflow", hasPassword: true },
  { key: "dribbble", label: "Dribbble / Behance", hasPassword: true },
  { key: "discord", label: "Discord", hasPassword: true },
];

const groups: FieldGroup[] = [
  {
    title: "Social Media",
    icon: Instagram,
    fields: [
      { key: "twitter", label: "Twitter / X", hasPassword: true },
      { key: "instagram", label: "Instagram", hasPassword: true },
      { key: "facebook", label: "Facebook", hasPassword: true },
      { key: "youtube", label: "YouTube", hasPassword: true },
    ],
  },
  {
    title: "Web & Community",
    icon: Globe,
    fields: [
      { key: "personalWebsite", label: "Personal Website" },
      { key: "stackOverflow", label: "Stack Overflow", hasPassword: true },
      { key: "dribbble", label: "Dribbble / Behance", hasPassword: true },
      { key: "discord", label: "Discord", hasPassword: true },
    ],
  },
];

const SocialProfilesSection = () => (
  <EditableSection
    title="Social Profiles"
    subtitle="Social media and community accounts with credentials for quick access."
    icon={Globe}
    firestoreKey="socialProfiles"
    defaultFields={defaultFields}
    groups={groups}
  />
);

export default SocialProfilesSection;