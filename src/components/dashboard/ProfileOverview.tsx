import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pencil, User, Briefcase, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  linkedin: string;
  github: string;
  portfolio: string;
  university: string;
  degree: string;
  graduationYear: string;
  gpa: string;
}

const emptyProfile: ProfileData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  dateOfBirth: "",
  linkedin: "",
  github: "",
  portfolio: "",
  university: "",
  degree: "",
  graduationYear: "",
  gpa: "",
};

const stats = [
  { value: "12", label: "Fields Saved", color: "text-primary" },
  { value: "48", label: "Forms Filled", color: "text-primary" },
  { value: "2.5 hrs", label: "Time Saved", color: "text-primary" },
];

interface EditableFieldProps {
  label: string;
  value: string;
  fieldKey: string;
  editing: string | null;
  onEdit: (key: string) => void;
  onSave: (key: string, value: string) => void;
}

const EditableField = ({ label, value, fieldKey, editing, onEdit, onSave }: EditableFieldProps) => {
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const isEditing = editing === fieldKey;

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {isEditing ? (
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onBlur={() => onSave(fieldKey, tempValue)}
            onKeyDown={(e) => e.key === "Enter" && onSave(fieldKey, tempValue)}
            autoFocus
            className="h-8 text-sm"
          />
        ) : (
          <p className="text-sm text-foreground">{value || "—"}</p>
        )}
      </div>
      {!isEditing && (
        <button
          onClick={() => onEdit(fieldKey)}
          className="ml-3 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

const ProfileOverview = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile({ ...emptyProfile, ...snap.data() } as ProfileData);
        } else {
          setProfile({
            ...emptyProfile,
            fullName: user.displayName || "",
            email: user.email || "",
          });
        }
      } catch {
        // fallback
        setProfile({
          ...emptyProfile,
          fullName: user.displayName || "",
          email: user.email || "",
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (key: string, value: string) => {
    setEditing(null);
    const updated = { ...profile, [key]: value };
    setProfile(updated);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });
      toast({ title: "Saved", description: `${key} updated successfully.` });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Profile Overview</h1>
        <p className="text-muted-foreground mt-1">Manage the information FillzApp uses to autofill forms.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Personal Information</h2>
          </div>
          <EditableField label="Full Name" value={profile.fullName} fieldKey="fullName" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Email" value={profile.email} fieldKey="email" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Phone" value={profile.phone} fieldKey="phone" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Address" value={profile.address} fieldKey="address" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Date of Birth" value={profile.dateOfBirth} fieldKey="dateOfBirth" editing={editing} onEdit={setEditing} onSave={handleSave} />
        </div>

        {/* Professional */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Professional</h2>
          </div>
          <EditableField label="LinkedIn" value={profile.linkedin} fieldKey="linkedin" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="GitHub" value={profile.github} fieldKey="github" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Portfolio" value={profile.portfolio} fieldKey="portfolio" editing={editing} onEdit={setEditing} onSave={handleSave} />
        </div>

        {/* Education */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Education</h2>
          </div>
          <EditableField label="University" value={profile.university} fieldKey="university" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Degree" value={profile.degree} fieldKey="degree" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="Graduation Year" value={profile.graduationYear} fieldKey="graduationYear" editing={editing} onEdit={setEditing} onSave={handleSave} />
          <EditableField label="GPA" value={profile.gpa} fieldKey="gpa" editing={editing} onEdit={setEditing} onSave={handleSave} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
