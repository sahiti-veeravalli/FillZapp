import { Globe, Instagram, KeyRound } from "lucide-react";
import EditableSection, { type FieldGroup } from "./EditableSection";

const defaultFields = [
  { key: "twitter", label: "Twitter / X" },
  { key: "twitterPassword", label: "Twitter / X Password", isPassword: true },
  { key: "instagram", label: "Instagram" },
  { key: "instagramPassword", label: "Instagram Password", isPassword: true },
  { key: "facebook", label: "Facebook" },
  { key: "facebookPassword", label: "Facebook Password", isPassword: true },
  { key: "youtube", label: "YouTube" },
  { key: "youtubePassword", label: "YouTube Password", isPassword: true },
  { key: "personalWebsite", label: "Personal Website" },
  { key: "stackOverflow", label: "Stack Overflow" },
  { key: "stackOverflowPassword", label: "Stack Overflow Password", isPassword: true },
  { key: "dribbble", label: "Dribbble / Behance" },
  { key: "discord", label: "Discord Username" },
  { key: "discordPassword", label: "Discord Password", isPassword: true },
];

const groups: FieldGroup[] = [
  {
    title: "Social Media",
    icon: Instagram,
    fields: [
      { key: "twitter", label: "Twitter / X" },
      { key: "twitterPassword", label: "Twitter / X Password", isPassword: true },
      { key: "instagram", label: "Instagram" },
      { key: "instagramPassword", label: "Instagram Password", isPassword: true },
      { key: "facebook", label: "Facebook" },
      { key: "facebookPassword", label: "Facebook Password", isPassword: true },
      { key: "youtube", label: "YouTube" },
      { key: "youtubePassword", label: "YouTube Password", isPassword: true },
    ],
  },
  {
    title: "Web & Community",
    icon: Globe,
    fields: [
      { key: "personalWebsite", label: "Personal Website" },
      { key: "stackOverflow", label: "Stack Overflow" },
      { key: "stackOverflowPassword", label: "Stack Overflow Password", isPassword: true },
      { key: "dribbble", label: "Dribbble / Behance" },
      { key: "discord", label: "Discord Username" },
      { key: "discordPassword", label: "Discord Password", isPassword: true },
    ],
  },
];

const SocialProfilesSection = () => (
  <EditableSection
    title="Social Profiles"
    subtitle="Social media and community links along with credentials for quick account access."
    icon={Globe}
    firestoreKey="socialProfiles"
    defaultFields={defaultFields}
    groups={groups}
  />
);

export default SocialProfilesSection;