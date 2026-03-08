import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Pencil, PlusCircle, Trash2, Eye, EyeOff, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { type LucideIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface FieldItem {
  key: string;
  label: string;
  isCustom?: boolean;
  isPassword?: boolean;
  notes?: string;
}

export interface FieldGroup {
  title: string;
  icon: LucideIcon;
  fields: FieldItem[];
}

interface EditableSectionProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  firestoreKey: string;
  defaultFields: FieldItem[];
  /** Optional field groups for multi-column layout */
  groups?: FieldGroup[];
}

const EditableSection = ({ title, subtitle, icon: Icon, firestoreKey, defaultFields, groups }: EditableSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FieldItem[]>(defaultFields);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldNotes, setNewFieldNotes] = useState("");
  const [newFieldIsPassword, setNewFieldIsPassword] = useState(false);
  const [showAddField, setShowAddField] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          const values: Record<string, string> = {};
          defaultFields.forEach((f) => { values[f.key] = d[f.key] || ""; });
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
    const newField: FieldItem = {
      key,
      label: newFieldName.trim(),
      isCustom: true,
      isPassword: newFieldIsPassword,
      notes: newFieldNotes.trim() || undefined,
    };
    const updatedFields = [...fields, newField];
    const customFields = updatedFields.filter((f) => f.isCustom);
    setFields(updatedFields);
    setData({ ...data, [key]: "" });
    setNewFieldName("");
    setNewFieldNotes("");
    setNewFieldIsPassword(false);
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

  // Get custom fields (not in any group)
  const customFields = fields.filter((f) => f.isCustom);

  const addFieldProps = {
    showAddField,
    newFieldName,
    setNewFieldName,
    newFieldNotes,
    setNewFieldNotes,
    newFieldIsPassword,
    setNewFieldIsPassword,
    setShowAddField,
    addField,
  };

  // If groups are provided, render multi-column layout
  if (groups && groups.length > 0) {
    const gridCols = groups.length === 2 ? "lg:grid-cols-2" : groups.length >= 3 ? "lg:grid-cols-3" : "";

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <div className={`grid grid-cols-1 ${gridCols} gap-5`}>
          {groups.map((group) => (
            <div key={group.title} className="bg-card border border-border rounded-xl p-5 hover-glow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <group.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-base font-display font-bold text-foreground">{group.title}</h3>
              </div>
              {group.fields.map((f) => {
                const isEditing = editing === f.key;
                return (
                  <EditableField
                    key={f.key}
                    label={f.label}
                    value={data[f.key] || ""}
                    isEditing={isEditing}
                    isCustom={f.isCustom}
                    isPassword={f.isPassword}
                    notes={f.notes}
                    onEdit={() => setEditing(f.key)}
                    onSave={(v) => saveValue(f.key, v)}
                    onDelete={() => deleteField(f)}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Custom fields in a full-width card below */}
        {customFields.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 hover-glow">
            <h3 className="text-base font-display font-bold text-foreground mb-3">Additional Information</h3>
            <div className={`grid grid-cols-1 ${groups.length >= 2 ? "sm:grid-cols-2" : ""} gap-x-6`}>
              {customFields.map((f) => {
                const isEditing = editing === f.key;
                return (
                  <EditableField
                    key={f.key}
                    label={f.label}
                    value={data[f.key] || ""}
                    isEditing={isEditing}
                    isCustom={f.isCustom}
                    isPassword={f.isPassword}
                    notes={f.notes}
                    onEdit={() => setEditing(f.key)}
                    onSave={(v) => saveValue(f.key, v)}
                    onDelete={() => deleteField(f)}
                  />
                );
              })}
            </div>
          </div>
        )}

        <AddFieldRow {...addFieldProps} />
      </div>
    );
  }

  // Fallback: single-column layout
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          {fields.map((f) => {
            const isEditing = editing === f.key;
            return (
              <EditableField
                key={f.key}
                label={f.label}
                value={data[f.key] || ""}
                isEditing={isEditing}
                isCustom={f.isCustom}
                isPassword={f.isPassword}
                notes={f.notes}
                onEdit={() => setEditing(f.key)}
                onSave={(v) => saveValue(f.key, v)}
                onDelete={() => deleteField(f)}
              />
            );
          })}
        </div>

        <AddFieldRow {...addFieldProps} />
      </div>
    </div>
  );
};

const AddFieldRow = ({ showAddField, newFieldName, setNewFieldName, newFieldNotes, setNewFieldNotes, newFieldIsPassword, setNewFieldIsPassword, setShowAddField, addField }: {
  showAddField: boolean; newFieldName: string; newFieldNotes: string; newFieldIsPassword: boolean;
  setNewFieldName: (v: string) => void; setNewFieldNotes: (v: string) => void;
  setNewFieldIsPassword: (v: boolean) => void; setShowAddField: (v: boolean) => void; addField: () => void;
}) => (
  showAddField ? (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-display font-bold text-foreground">Add New Information</h3>
      <div className="flex items-center gap-3">
        <Input
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addField()}
          placeholder="Field name (e.g. Netflix Password, API Key)"
          autoFocus
          className="h-9 text-sm flex-1"
        />
      </div>
      <Input
        value={newFieldNotes}
        onChange={(e) => setNewFieldNotes(e.target.value)}
        placeholder="Extra info / notes (optional)"
        className="h-9 text-sm"
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="isPassword"
          checked={newFieldIsPassword}
          onCheckedChange={(checked) => setNewFieldIsPassword(checked === true)}
        />
        <label htmlFor="isPassword" className="text-sm text-muted-foreground flex items-center gap-1.5 cursor-pointer">
          <KeyRound className="w-3.5 h-3.5" />
          This is a password / secret
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={addField} className="gap-1.5">
          <PlusCircle className="w-3.5 h-3.5" /> Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setShowAddField(false); setNewFieldName(""); setNewFieldNotes(""); setNewFieldIsPassword(false); }}>
          Cancel
        </Button>
      </div>
    </div>
  ) : (
    <button
      onClick={() => setShowAddField(true)}
      className="flex items-center gap-2 mt-4 pt-3 border-t border-border text-sm font-medium text-primary hover:text-primary/80 transition-colors"
    >
      <PlusCircle className="w-4 h-4" />
      Add Information
    </button>
  )
);

const EditableField = ({ label, value, isEditing, isCustom, isPassword, notes, onEdit, onSave, onDelete }: {
  label: string; value: string; isEditing: boolean; isCustom?: boolean; isPassword?: boolean; notes?: string;
  onEdit: () => void; onSave: (v: string) => void; onDelete: () => void;
}) => {
  const [temp, setTemp] = useState(value);
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTemp(value); }, [value]);

  const maskedValue = value ? "••••••••" : "—";

  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {isPassword && <KeyRound className="w-3 h-3 text-muted-foreground/60" />}
        </div>
        {notes && <p className="text-[11px] text-muted-foreground/50 mb-1">{notes}</p>}
        {isEditing ? (
          <Input value={temp} onChange={(e) => setTemp(e.target.value)}
            type={isPassword && !visible ? "password" : "text"}
            onBlur={() => onSave(temp)} onKeyDown={(e) => e.key === "Enter" && onSave(temp)}
            autoFocus className="h-8 text-sm" />
        ) : (
          <p className="text-sm text-foreground truncate">
            {isPassword ? (visible ? (value || "—") : maskedValue) : (value || "—")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1 ml-3 shrink-0">
        {isPassword && (
          <button onClick={() => setVisible(!visible)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
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