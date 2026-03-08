import { Globe, Twitter, Instagram, Facebook } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "twitter", label: "Twitter / X" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "youtube", label: "YouTube" },
  { key: "personalWebsite", label: "Personal Website" },
  { key: "stackOverflow", label: "Stack Overflow" },
  { key: "dribbble", label: "Dribbble / Behance" },
  { key: "discord", label: "Discord Username" },
];

const groups: FieldGroup[] = [
  {
    title: "Social Media",
    icon: Instagram,
    fields: [
      { key: "twitter", label: "Twitter / X" },
      { key: "instagram", label: "Instagram" },
      { key: "facebook", label: "Facebook" },
      { key: "youtube", label: "YouTube" },
    ],
  },
  {
    title: "Web & Community",
    icon: Globe,
    fields: [
      { key: "personalWebsite", label: "Personal Website" },
      { key: "stackOverflow", label: "Stack Overflow" },
      { key: "dribbble", label: "Dribbble / Behance" },
      { key: "discord", label: "Discord Username" },
    ],
  },
];

const SocialProfilesSection = () => (
  <EditableSection
    title="Social Profiles"
    subtitle="Social media and community links for account creation and applications."
    icon={Globe}
    firestoreKey="socialProfiles"
    defaultFields={defaultFields}
    groups={groups}
  />
);

export default SocialProfilesSection;
