import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type LucideIcon } from "lucide-react";

interface FieldItem {
  key: string;
  label: string;
  isCustom?: boolean;
}

interface EditableSectionProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  firestoreKey: string; // e.g. "professional", "education"
  defaultFields: FieldItem[];
}

const EditableSection = ({ title, subtitle, icon: Icon, firestoreKey, defaultFields }: EditableSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FieldItem[]>(defaultFields);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");
  const [showAddField, setShowAddField] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          // Load field values
          const values: Record<string, string> = {};
          defaultFields.forEach((f) => { values[f.key] = d[f.key] || ""; });
          // Load custom fields for this section
          const customFields = (d[`${firestoreKey}_customFields`] as FieldItem[] | undefined) || [];
          customFields.forEach((f) => { values[f.key] = d[f.key] || ""; });
          setFields([...defaultFields, ...customFields]);
          setData(values);
        }
      } catch {}
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const saveValue = async (key: string, value: string) => {
    setEditing(null);
    const updated = { ...data, [key]: value };
    setData(updated);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { [key]: value }, { merge: true });
      toast({ title: "Saved" });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  const addField = async () => {
    if (!newFieldName.trim()) return;
    const key = `${firestoreKey}_custom_${Date.now()}`;
    const newField: FieldItem = { key, label: newFieldName.trim(), isCustom: true };
    const updatedFields = [...fields, newField];
    const customFields = updatedFields.filter((f) => f.isCustom);
    setFields(updatedFields);
    setData({ ...data, [key]: "" });
    setNewFieldName("");
    setShowAddField(false);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { [`${firestoreKey}_customFields`]: customFields }, { merge: true });
      toast({ title: "Added", description: `"${newField.label}" added.` });
    } catch {
      toast({ title: "Error", description: "Failed to add field.", variant: "destructive" });
    }
  };

  const deleteField = async (fieldToDelete: FieldItem) => {
    const updatedFields = fields.filter((f) => f.key !== fieldToDelete.key);
    const customFields = updatedFields.filter((f) => f.isCustom);
    setFields(updatedFields);
    const newData = { ...data };
    delete newData[fieldToDelete.key];
    setData(newData);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        [`${firestoreKey}_customFields`]: customFields,
        [fieldToDelete.key]: "",
      }, { merge: true });
      toast({ title: "Deleted" });
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 hover-glow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">{title} Details</h2>
        </div>

        {fields.map((f) => {
          const isEditing = editing === f.key;
          return (
            <EditableField
              key={f.key}
              label={f.label}
              value={data[f.key] || ""}
              isEditing={isEditing}
              isCustom={f.isCustom}
              onEdit={() => setEditing(f.key)}
              onSave={(v) => saveValue(f.key, v)}
              onDelete={() => deleteField(f)}
            />
          );
        })}

        {/* Add information */}
        {showAddField ? (
          <div className="flex items-center gap-3 pt-4 mt-2 border-t border-border">
            <Input
              value={newFieldName}
              onChange={(e) => setNewFieldName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addField()}
              placeholder="e.g. Skills, Certifications"
              autoFocus
              className="h-8 text-sm flex-1"
            />
            <Button size="sm" onClick={addField} className="gap-1.5">
              <PlusCircle className="w-3.5 h-3.5" /> Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => { setShowAddField(false); setNewFieldName(""); }}>
              Cancel
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddField(true)}
            className="flex items-center gap-2 mt-4 pt-3 border-t border-border text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Information
          </button>
        )}
      </div>
    </div>
  );
};

const EditableField = ({ label, value, isEditing, isCustom, onEdit, onSave, onDelete }: {
  label: string; value: string; isEditing: boolean; isCustom?: boolean;
  onEdit: () => void; onSave: (v: string) => void; onDelete: () => void;
}) => {
  const [temp, setTemp] = useState(value);
  useEffect(() => { setTemp(value); }, [value]);

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex-1">
        <p className="text-xs font-medium text-muted-foreground mb-1">{label}</p>
        {isEditing ? (
          <Input value={temp} onChange={(e) => setTemp(e.target.value)}
            onBlur={() => onSave(temp)} onKeyDown={(e) => e.key === "Enter" && onSave(temp)}
            autoFocus className="h-8 text-sm" />
        ) : (
          <p className="text-sm text-foreground">{value || "—"}</p>
        )}
      </div>
      <div className="flex items-center gap-1 ml-3">
        {!isEditing && (
          <button onClick={onEdit}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {isCustom && !isEditing && (
          <button onClick={onDelete}
            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EditableSection;
