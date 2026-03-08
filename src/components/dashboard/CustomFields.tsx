import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PlusCircle, Trash2, ChevronDown, ChevronRight, Plus, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface CustomFieldEntry {
  id: string;
  label: string;
  value: string;
}

export interface CustomField {
  id: string;
  name: string;
  entries?: CustomFieldEntry[];
}

interface CustomFieldsProps {
  onFieldsChange?: (fields: CustomField[]) => void;
}

const CustomFields = ({ onFieldsChange }: CustomFieldsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fields, setFields] = useState<CustomField[]>([]);
  const [fieldName, setFieldName] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [addingEntry, setAddingEntry] = useState<string | null>(null);
  const [newEntryLabel, setNewEntryLabel] = useState("");
  const [newEntryValue, setNewEntryValue] = useState("");

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
    if (!fieldName.trim()) {
      toast({ title: "Missing info", description: "Section name is required.", variant: "destructive" });
      return;
    }
    const newField: CustomField = {
      id: Date.now().toString(),
      name: fieldName.trim(),
      entries: [],
    };
    const updated = [...fields, newField];
    saveFields(updated);
    setFieldName("");
    setExpandedSections((prev) => new Set(prev).add(newField.id));
    toast({ title: "Added", description: `"${newField.name}" section created.` });
  };

  const handleDelete = (id: string) => {
    saveFields(fields.filter((f) => f.id !== id));
    toast({ title: "Deleted", description: "Custom section removed." });
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddEntry = (sectionId: string) => {
    if (!newEntryLabel.trim() || !newEntryValue.trim()) {
      toast({ title: "Missing info", description: "Both label and value are required.", variant: "destructive" });
      return;
    }
    const updated = fields.map((f) => {
      if (f.id !== sectionId) return f;
      return {
        ...f,
        entries: [
          ...(f.entries || []),
          { id: Date.now().toString(), label: newEntryLabel.trim(), value: newEntryValue.trim() },
        ],
      };
    });
    saveFields(updated);
    setNewEntryLabel("");
    setNewEntryValue("");
    setAddingEntry(null);
    toast({ title: "Entry added" });
  };

  const handleDeleteEntry = (sectionId: string, entryId: string) => {
    const updated = fields.map((f) => {
      if (f.id !== sectionId) return f;
      return { ...f, entries: (f.entries || []).filter((e) => e.id !== entryId) };
    });
    saveFields(updated);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Custom Sections</h1>
        <p className="text-muted-foreground mt-1">Create sections and add any additional information for autofill.</p>
      </div>

      {/* Add New Section */}
      <div className="bg-card border border-border rounded-xl p-6 hover-glow">
        <h2 className="text-lg font-display font-bold text-foreground mb-4">Add New Section</h2>
        <div>
          <p className="text-sm font-medium text-foreground mb-1.5">Section Name</p>
          <Input
            placeholder="e.g. Certifications, References, Skills"
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="max-w-md"
          />
        </div>
        <Button onClick={handleAdd} className="mt-4 gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {/* Existing fields */}
      {fields.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No custom sections yet.</p>
      ) : (
        <div className="space-y-3">
          {fields.map((f) => {
            const isExpanded = expandedSections.has(f.id);
            const entries = f.entries || [];
            return (
              <div key={f.id} className="bg-card border border-border rounded-xl overflow-hidden hover-glow">
                {/* Section header */}
                <div className="flex items-center justify-between p-4">
                  <button
                    onClick={() => toggleSection(f.id)}
                    className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    {f.name}
                    <span className="text-xs text-muted-foreground font-normal">
                      ({entries.length} {entries.length === 1 ? "entry" : "entries"})
                    </span>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (!isExpanded) toggleSection(f.id);
                        setAddingEntry(f.id);
                        setNewEntryLabel("");
                        setNewEntryValue("");
                      }}
                      className="p-2 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                      title="Add entry"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-border px-4 pb-4 pt-3 space-y-3">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2.5"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground">{entry.label}</span>
                          <p className="text-sm font-medium text-foreground truncate">{entry.value}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteEntry(f.id, entry.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-2 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {entries.length === 0 && addingEntry !== f.id && (
                      <p className="text-sm text-muted-foreground text-center py-2">No entries yet. Click + to add one.</p>
                    )}

                    {/* Add entry form */}
                    {addingEntry === f.id && (
                      <div className="bg-muted/30 border border-border rounded-lg p-3 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Label</p>
                            <Input
                              placeholder="e.g. Certification Name"
                              value={newEntryLabel}
                              onChange={(e) => setNewEntryLabel(e.target.value)}
                              className="h-9 text-sm"
                            />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Value</p>
                            <Input
                              placeholder="e.g. AWS Solutions Architect"
                              value={newEntryValue}
                              onChange={(e) => setNewEntryValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddEntry(f.id)}
                              className="h-9 text-sm"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAddEntry(f.id)} className="gap-1.5">
                            <Save className="w-3.5 h-3.5" />
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddingEntry(null)} className="gap-1.5">
                            <X className="w-3.5 h-3.5" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Quick add button when not already adding */}
                    {addingEntry !== f.id && (
                      <button
                        onClick={() => {
                          setAddingEntry(f.id);
                          setNewEntryLabel("");
                          setNewEntryValue("");
                        }}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors pt-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add new entry
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomFields;
