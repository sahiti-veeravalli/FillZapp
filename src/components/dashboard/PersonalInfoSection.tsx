import { UserCircle, MapPin, Calendar } from "lucide-react";
import EditableSection, { type FieldGroup } from "@/components/dashboard/EditableSection";

const allFields = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone Number" },
  { key: "dateOfBirth", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zipCode", label: "ZIP Code" },
  { key: "country", label: "Country" },
];

const groups: FieldGroup[] = [
  {
    title: "Basic Details",
    icon: UserCircle,
    fields: [
      { key: "fullName", label: "Full Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone Number" },
      { key: "dateOfBirth", label: "Date of Birth" },
      { key: "gender", label: "Gender" },
    ],
  },
  {
    title: "Address",
    icon: MapPin,
    fields: [
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "state", label: "State" },
      { key: "zipCode", label: "ZIP Code" },
      { key: "country", label: "Country" },
    ],
  },
];

const PersonalInfoSection = ({ highlightField }: { highlightField?: string | null }) => {
  return (
    <EditableSection
      title="Personal Information"
      subtitle="Your basic personal details used for auto-filling forms."
      icon={UserCircle}
      firestoreKey="personal"
      defaultFields={allFields}
      groups={groups}
      highlightField={highlightField}
    />
  );
};

export default PersonalInfoSection;
