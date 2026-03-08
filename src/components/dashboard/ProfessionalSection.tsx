import EditableSection from "./EditableSection";
import { Briefcase } from "lucide-react";

const defaultFields = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

const ProfessionalSection = () => (
  <EditableSection
    title="Professional"
    subtitle="Manage your professional links and details."
    icon={Briefcase}
    firestoreKey="professional"
    defaultFields={defaultFields}
  />
);

export default ProfessionalSection;
