import EditableSection, { type FieldGroup } from "./EditableSection";
import { GraduationCap, Award } from "lucide-react";

const allFields = [
  { key: "university", label: "University" },
  { key: "degree", label: "Degree" },
  { key: "fieldOfStudy", label: "Field of Study" },
  { key: "graduationYear", label: "Graduation Year" },
  { key: "gpa", label: "GPA" },
  { key: "honors", label: "Honors / Awards" },
];

const groups: FieldGroup[] = [
  {
    title: "Institution",
    icon: GraduationCap,
    fields: [
      { key: "university", label: "University" },
      { key: "degree", label: "Degree" },
      { key: "fieldOfStudy", label: "Field of Study" },
    ],
  },
  {
    title: "Academics",
    icon: Award,
    fields: [
      { key: "graduationYear", label: "Graduation Year" },
      { key: "gpa", label: "GPA" },
      { key: "honors", label: "Honors / Awards" },
    ],
  },
];

const EducationSection = ({ highlightField }: { highlightField?: string | null }) => (
  <EditableSection
    title="Education"
    subtitle="Manage your education history."
    icon={GraduationCap}
    firestoreKey="education"
    defaultFields={allFields}
    groups={groups}
    highlightField={highlightField}
  />
);

export default EducationSection;
