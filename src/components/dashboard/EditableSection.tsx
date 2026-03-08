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
  /** If true, this field is a standalone password/secret (masked, no username) */
  isPassword?: boolean;
  /** If true, this field has a paired password stored at key_password */
  hasPassword?: boolean;
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
  groups?: FieldGroup[];
  highlightField?: string | null;
}

const EditableSection = ({ title, subtitle, icon: Icon, firestoreKey, defaultFields, groups, highlightField }: EditableSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<FieldItem[]>(defaultFields);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldNotes, setNewFieldNotes] = useState("");
  const [newFieldHasPassword, setNewFieldHasPassword] = useState(false);
  const [showAddField, setShowAddField] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          const values: Record<string, string> = {};
          defaultFields.forEach((f) => {
            values[f.key] = d[f.key] || "";
            if (f.hasPassword) values[`${f.key}_password`] = d[`${f.key}_password`] || "";
          });
          const customFields = (d[`${firestoreKey}_customFields`] as FieldItem[] | undefined) || [];
          customFields.forEach((f) => {
            values[f.key] = d[f.key] || "";
            if (f.hasPassword) values[`${f.key}_password`] = d[`${f.key}_password`] || "";
          });
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

  const saveFieldPair = async (key: string, mainVal: string, passVal: string) => {
    setEditing(null);
    const updated = { ...data, [key]: mainVal, [`${key}_password`]: passVal };
    setData(updated);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { [key]: mainVal, [`${key}_password`]: passVal }, { merge: true });
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
      hasPassword: newFieldHasPassword,
      notes: newFieldNotes.trim() || undefined,
    };
    const updatedFields = [...fields, newField];
    const customFields = updatedFields.filter((f) => f.isCustom);
    setFields(updatedFields);
    setData({ ...data, [key]: "", ...(newFieldHasPassword ? { [`${key}_password`]: "" } : {}) });
    setNewFieldName("");
    setNewFieldNotes("");
    setNewFieldHasPassword(false);
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
    delete newData[`${fieldToDelete.key}_password`];
    setData(newData);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), {
        [`${firestoreKey}_customFields`]: customFields,
        [fieldToDelete.key]: "",
        [`${fieldToDelete.key}_password`]: "",
      }, { merge: true });
      toast({ title: "Deleted" });
    } catch {}
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;

  const customFields = fields.filter((f) => f.isCustom);

  const addFieldProps = {
    showAddField, newFieldName, setNewFieldName,
    newFieldNotes, setNewFieldNotes,
    newFieldHasPassword, setNewFieldHasPassword,
    setShowAddField, addField,
  };

  const renderField = (f: FieldItem) => {
    const isEditing = editing === f.key;
    return (
      <EditableField
        key={f.key}
        fieldKey={f.key}
        highlighted={highlightField === f.key}
        label={f.label}
        value={data[f.key] || ""}
        password={f.hasPassword ? (data[`${f.key}_password`] || "") : undefined}
        isEditing={isEditing}
        isCustom={f.isCustom}
        isPassword={f.isPassword}
        hasPassword={f.hasPassword}
        notes={f.notes}
        onEdit={() => setEditing(f.key)}
        onSave={(v) => saveValue(f.key, v)}
        onSavePair={(main, pass) => saveFieldPair(f.key, main, pass)}
        onDelete={() => deleteField(f)}
      />
    );
  };

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
              {group.fields.map(renderField)}
            </div>
          ))}
        </div>

        {customFields.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 hover-glow">
            <h3 className="text-base font-display font-bold text-foreground mb-3">Additional Information</h3>
            <div className={`grid grid-cols-1 ${groups.length >= 2 ? "sm:grid-cols-2" : ""} gap-x-6`}>
              {customFields.map(renderField)}
            </div>
          </div>
        )}

        <AddFieldRow {...addFieldProps} />
      </div>
    );
  }

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
          {fields.map(renderField)}
        </div>
        <AddFieldRow {...addFieldProps} />
      </div>
    </div>
  );
};

/* ── Add Field Row ── */
const AddFieldRow = ({ showAddField, newFieldName, setNewFieldName, newFieldNotes, setNewFieldNotes, newFieldHasPassword, setNewFieldHasPassword, setShowAddField, addField }: {
  showAddField: boolean; newFieldName: string; newFieldNotes: string; newFieldHasPassword: boolean;
  setNewFieldName: (v: string) => void; setNewFieldNotes: (v: string) => void;
  setNewFieldHasPassword: (v: boolean) => void; setShowAddField: (v: boolean) => void; addField: () => void;
}) => (
  showAddField ? (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-display font-bold text-foreground">Add New Information</h3>
      <Input
        value={newFieldName}
        onChange={(e) => setNewFieldName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addField()}
        placeholder="Field name (e.g. Netflix, AWS Console)"
        autoFocus
        className="h-9 text-sm"
      />
      <Input
        value={newFieldNotes}
        onChange={(e) => setNewFieldNotes(e.target.value)}
        placeholder="Extra info / notes (optional)"
        className="h-9 text-sm"
      />
      <div className="flex items-center gap-2">
        <Checkbox
          id="hasPassword"
          checked={newFieldHasPassword}
          onCheckedChange={(checked) => setNewFieldHasPassword(checked === true)}
        />
        <label htmlFor="hasPassword" className="text-sm text-muted-foreground flex items-center gap-1.5 cursor-pointer">
          <KeyRound className="w-3.5 h-3.5" />
          Include a password / secret field
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={addField} className="gap-1.5">
          <PlusCircle className="w-3.5 h-3.5" /> Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setShowAddField(false); setNewFieldName(""); setNewFieldNotes(""); setNewFieldHasPassword(false); }}>
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

/* ── Editable Field (supports paired username + password) ── */
const EditableField = ({ fieldKey, highlighted, label, value, password, isEditing, isCustom, isPassword, hasPassword, notes, onEdit, onSave, onSavePair, onDelete }: {
  fieldKey: string; highlighted?: boolean;
  label: string; value: string; password?: string; isEditing: boolean; isCustom?: boolean;
  isPassword?: boolean; hasPassword?: boolean; notes?: string;
  onEdit: () => void; onSave: (v: string) => void; onSavePair: (main: string, pass: string) => void; onDelete: () => void;
}) => {
  const [tempVal, setTempVal] = useState(value);
  const [tempPass, setTempPass] = useState(password || "");
  const [passVisible, setPassVisible] = useState(false);
  useEffect(() => { setTempVal(value); }, [value]);
  useEffect(() => { setTempPass(password || ""); }, [password]);

  // Auto-scroll into view when highlighted
  useEffect(() => {
    if (highlighted) {
      document.getElementById(`field-${fieldKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlighted, fieldKey]);

  const handleSave = () => {
    if (hasPassword) {
      onSavePair(tempVal, tempPass);
    } else {
      onSave(tempVal);
    }
  };

  const maskedPass = password ? "••••••••" : "—";

  return (
    <div
      id={`field-${fieldKey}`}
      className={`py-3 border-b border-border last:border-b-0 transition-all duration-700 rounded-md ${
        highlighted
          ? "bg-primary/10 ring-2 ring-primary/40 shadow-[0_0_15px_hsl(var(--primary)/0.2)] px-3 -mx-3"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 mb-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {(hasPassword || isPassword) && <KeyRound className="w-3 h-3 text-muted-foreground/60" />}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {(hasPassword || isPassword) && (
            <button onClick={() => setPassVisible(!passVisible)}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              {passVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}
          {!isEditing && (
            <button onClick={onEdit}
              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {isCustom && !isEditing && (
            <button onClick={onDelete}
              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      {notes && <p className="text-[11px] text-muted-foreground/50 mb-1">{notes}</p>}

      {isEditing ? (
        <div className="space-y-2">
          {/* For standalone password fields, single masked input */}
          {isPassword && !hasPassword ? (
            <Input value={tempVal} onChange={(e) => setTempVal(e.target.value)}
              type={passVisible ? "text" : "password"} placeholder="Password"
              onBlur={handleSave} onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus className="h-8 text-sm" />
          ) : (
            <>
              <Input value={tempVal} onChange={(e) => setTempVal(e.target.value)}
                placeholder="Username / Email / URL"
                autoFocus className="h-8 text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleSave()} />
              {hasPassword && (
                <Input value={tempPass} onChange={(e) => setTempPass(e.target.value)}
                  type={passVisible ? "text" : "password"} placeholder="Password"
                  onBlur={handleSave} onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  className="h-8 text-sm" />
              )}
            </>
          )}
          <Button size="sm" variant="secondary" onClick={handleSave} className="h-7 text-xs">
            Save
          </Button>
        </div>
      ) : (
        <div className="space-y-0.5">
          {isPassword && !hasPassword ? (
            <p className="text-sm text-foreground">{passVisible ? (value || "—") : (value ? "••••••••" : "—")}</p>
          ) : (
            <>
              <p className="text-sm text-foreground truncate">{value || "—"}</p>
              {hasPassword && (
                <p className="text-xs text-muted-foreground font-mono">
                  {passVisible ? (password || "—") : maskedPass}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableSection;