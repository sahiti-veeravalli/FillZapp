import { UserCircle } from "lucide-react";
import EditableSection from "@/components/dashboard/EditableSection";

const defaultFields = [
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

const PersonalInfoSection = () => {
  return (
    <EditableSection
      title="Personal Information"
      subtitle="Your basic personal details used for auto-filling forms."
      icon={UserCircle}
      firestoreKey="personal"
      defaultFields={defaultFields}
    />
  );
};

export default PersonalInfoSection;
