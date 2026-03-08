import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, GraduationCap } from "lucide-react";

interface FieldItem { key: string; label: string; isCustom?: boolean; }

const defaultPersonal = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "dateOfBirth", label: "Date of Birth" },
];
const defaultEducation = [
  { key: "university", label: "University" },
  { key: "degree", label: "Degree" },
  { key: "graduationYear", label: "Graduation Year" },
  { key: "gpa", label: "GPA" },
];

const stats = [
  { value: "12", label: "Fields Saved", color: "text-primary" },
  { value: "48", label: "Forms Filled", color: "text-primary" },
  { value: "2.5 hrs", label: "Time Saved", color: "text-primary" },
];

const ReadOnlyField = ({ label, value, fieldKey, highlighted }: { label: string; value: string; fieldKey: string; highlighted?: boolean }) => {
  useEffect(() => {
    if (highlighted) {
      document.getElementById(`field-${fieldKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted, fieldKey]);

  return (
    <div
      id={`field-${fieldKey}`}
      className={`flex items-center justify-between py-3 border-b border-border last:border-b-0 transition-all duration-700 rounded-md ${
        highlighted
          ? "bg-primary/10 ring-2 ring-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.2)] px-3 -mx-3"
          : ""
      }`}
    >
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        <p className="text-sm text-foreground">{value || "—"}</p>
      </div>
    </div>
  );
};

const ProfileOverview = ({ highlightField }: { highlightField?: string | null }) => {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setData(snap.data());
        } else {
          setData({ fullName: user.displayName || "", email: user.email || "" });
        }
      } catch {
        setData({ fullName: user.displayName || "", email: user.email || "" });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const getFields = (defaults: FieldItem[], firestoreKey: string): FieldItem[] => {
    const custom = (data[`${firestoreKey}_customFields`] as FieldItem[] | undefined) || [];
    return [...defaults, ...custom];
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading profile...</div>;
  }

  const personalFields = defaultPersonal;
  
  const educationFields = getFields(defaultEducation, "education");

  const displayName = data.fullName || user?.displayName || "User";

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', 'Courier New', monospace" }}>
          <span className="text-foreground">Welcome </span>
          <span className="text-primary">{displayName}</span>
          <span className="inline-block w-[3px] h-[1.1em] bg-primary align-middle ml-1 animate-[blink_1s_step-end_infinite]" />
        </h1>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-foreground">Profile Overview</h2>
        <p className="text-muted-foreground mt-1">A summary of your saved information. Edit details in each section.</p>
        <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">No field is mandatory.</span> Fill only what you're comfortable with — your data is encrypted and never shared. Add the details you find yourself typing repeatedly, and let auto-fill handle the rest.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center hover-glow cursor-default">
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 hover-glow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Personal Information</h2>
          </div>
          {personalFields.map((f) => (
            <ReadOnlyField key={f.key} fieldKey={f.key} label={f.label} value={data[f.key] || ""} highlighted={highlightField === f.key} />
          ))}
        </div>


        <div className="bg-card border border-border rounded-xl p-6 hover-glow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Education</h2>
          </div>
          {educationFields.map((f) => (
            <ReadOnlyField key={f.key} fieldKey={f.key} label={f.label} value={data[f.key] || ""} highlighted={highlightField === f.key} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
