import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User, Briefcase, GraduationCap } from "lucide-react";

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
  fullName: "", email: "", phone: "", address: "", dateOfBirth: "",
  linkedin: "", github: "", portfolio: "",
  university: "", degree: "", graduationYear: "", gpa: "",
};

const stats = [
  { value: "12", label: "Fields Saved", color: "text-primary" },
  { value: "48", label: "Forms Filled", color: "text-primary" },
  { value: "2.5 hrs", label: "Time Saved", color: "text-primary" },
];

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
    <div className="flex-1">
      <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
      <p className="text-sm text-foreground">{value || "—"}</p>
    </div>
  </div>
);

const ProfileOverview = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          setProfile({ ...emptyProfile, ...snap.data() } as ProfileData);
        } else {
          setProfile({ ...emptyProfile, fullName: user.displayName || "", email: user.email || "" });
        }
      } catch {
        setProfile({ ...emptyProfile, fullName: user.displayName || "", email: user.email || "" });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Profile Overview</h1>
        <p className="text-muted-foreground mt-1">A summary of your saved information. Edit details in each section.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
            <p className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Personal Information</h2>
          </div>
          <ReadOnlyField label="Full Name" value={profile.fullName} />
          <ReadOnlyField label="Email" value={profile.email} />
          <ReadOnlyField label="Phone" value={profile.phone} />
          <ReadOnlyField label="Address" value={profile.address} />
          <ReadOnlyField label="Date of Birth" value={profile.dateOfBirth} />
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Professional</h2>
          </div>
          <ReadOnlyField label="LinkedIn" value={profile.linkedin} />
          <ReadOnlyField label="GitHub" value={profile.github} />
          <ReadOnlyField label="Portfolio" value={profile.portfolio} />
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Education</h2>
          </div>
          <ReadOnlyField label="University" value={profile.university} />
          <ReadOnlyField label="Degree" value={profile.degree} />
          <ReadOnlyField label="Graduation Year" value={profile.graduationYear} />
          <ReadOnlyField label="GPA" value={profile.gpa} />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
