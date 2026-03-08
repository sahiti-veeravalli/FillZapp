import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PlusCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface CustomField {
  id: string;
  name: string;
  value: string;
}

interface CustomFieldsProps {
  onFieldsChange?: (fields: CustomField[]) => void;
}

const CustomFields = ({ onFieldsChange }: CustomFieldsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fields, setFields] = useState<CustomField[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().customFields) {
          const f = snap.data().customFields as CustomField[];
          setFields(f);
          onFieldsChange?.(f);
        }
      } catch {
        // ignore
      }
      setLoading(false);
    };
    fetchFields();
  }, [user]);

  const saveFields = async (updated: CustomField[]) => {
    setFields(updated);
    onFieldsChange?.(updated);
    if (!user) return;
    try {
      await setDoc(doc(db, "users", user.uid), { customFields: updated }, { merge: true });
    } catch {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  const handleAdd = () => {
    if (!fieldName.trim() || !fieldValue.trim()) {
      toast({ title: "Missing info", description: "Both field name and value are required.", variant: "destructive" });
      return;
    }
    const newField: CustomField = {
      id: Date.now().toString(),
      name: fieldName.trim(),
      value: fieldValue.trim(),
    };
    saveFields([...fields, newField]);
    setFieldName("");
    setFieldValue("");
    toast({ title: "Added", description: `"${newField.name}" field added.` });
  };

  const handleDelete = (id: string) => {
    saveFields(fields.filter((f) => f.id !== id));
    toast({ title: "Deleted", description: "Custom field removed." });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Custom Fields</h1>
        <p className="text-muted-foreground mt-1">Add any additional information for autofill.</p>
      </div>

      {/* Add New Field card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-display font-bold text-foreground mb-4">Add New Field</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">Field Name</p>
            <Input
              placeholder="e.g. Company Name"
              value={fieldName}
              onChange={(e) => setFieldName(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1.5">Value</p>
            <Input
              placeholder="e.g. Acme Corp"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
          </div>
        </div>
        <Button onClick={handleAdd} className="mt-4 gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Field
        </Button>
      </div>

      {/* Existing fields */}
      {fields.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No custom fields added yet.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((f) => (
            <div
              key={f.id}
              className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{f.name}</p>
                <p className="text-sm text-muted-foreground">{f.value}</p>
              </div>
              <button
                onClick={() => handleDelete(f.id)}
                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomFields;
