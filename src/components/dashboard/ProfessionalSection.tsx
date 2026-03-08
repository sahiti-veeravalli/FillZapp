import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pencil, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ProfessionalData {
  linkedin: string;
  github: string;
  portfolio: string;
}

const emptyData: ProfessionalData = { linkedin: "", github: "", portfolio: "" };

const fields: { key: keyof ProfessionalData; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "portfolio", label: "Portfolio" },
];

const ProfessionalSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<ProfessionalData>(emptyData);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setData({ ...emptyData, ...snap.data() } as ProfessionalData);
      } catch {}
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSave = async (key: string, value: string) => {
    setEditing(null);
    const updated = { ...data, [key]: value };
    setData(updated);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), updated, { merge: true });
      toast({ title: "Saved", description: `${key} updated.` });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Professional</h1>
        <p className="text-muted-foreground mt-1">Manage your professional links and details.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">Professional Details</h2>
        </div>
        {fields.map((f) => (
          <EditableField
            key={f.key}
            label={f.label}
            value={data[f.key]}
            fieldKey={f.key}
            editing={editing}
            onEdit={setEditing}
            onSave={handleSave}
          />
        ))}
      </div>
    </div>
  );
};

const EditableField = ({ label, value, fieldKey, editing, onEdit, onSave }: {
  label: string; value: string; fieldKey: string; editing: string | null;
  onEdit: (k: string) => void; onSave: (k: string, v: string) => void;
}) => {
  const [temp, setTemp] = useState(value);
  useEffect(() => { setTemp(value); }, [value]);
  const isEditing = editing === fieldKey;

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {isEditing ? (
          <Input value={temp} onChange={(e) => setTemp(e.target.value)}
            onBlur={() => onSave(fieldKey, temp)} onKeyDown={(e) => e.key === "Enter" && onSave(fieldKey, temp)}
            autoFocus className="h-8 text-sm" />
        ) : (
          <p className="text-sm text-foreground">{value || "—"}</p>
        )}
      </div>
      {!isEditing && (
        <button onClick={() => onEdit(fieldKey)}
          className="ml-3 p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ProfessionalSection;
