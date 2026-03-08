import EditableSection from "./EditableSection";
import { GraduationCap } from "lucide-react";

const defaultFields = [
  { key: "university", label: "University" },
  { key: "degree", label: "Degree" },
  { key: "graduationYear", label: "Graduation Year" },
  { key: "gpa", label: "GPA" },
];

const EducationSection = () => (
  <EditableSection
    title="Education"
    subtitle="Manage your education history."
    icon={GraduationCap}
    firestoreKey="education"
    defaultFields={defaultFields}
  />
);

export default EducationSection;
