import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Upload, FileText, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface StoredDocument {
  id: string;
  fileName: string;
  label: string;
  url: string;
  storagePath: string;
  uploadedAt: string;
}

const DocumentsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<StoredDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists() && snap.data().documents) {
          setDocuments(snap.data().documents as StoredDocument[]);
        }
      } catch {}
      setLoading(false);
    };
    fetchDocs();
  }, [user]);

  const saveDocs = async (updated: StoredDocument[]) => {
    setDocuments(updated);
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), { documents: updated }, { merge: true });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !user) return;
    setUploading(true);

    try {
      const newDocs: StoredDocument[] = [];
      for (const file of Array.from(files)) {
        const storagePath = `documents/${user.uid}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, storagePath);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        // Default label = filename without extension
        const label = file.name.replace(/\.[^/.]+$/, "");

        newDocs.push({
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          fileName: file.name,
          label,
          url,
          storagePath,
          uploadedAt: new Date().toISOString(),
        });
      }

      await saveDocs([...documents, ...newDocs]);
      toast({ title: "Uploaded", description: `${newDocs.length} file(s) uploaded.` });
    } catch {
      toast({ title: "Error", description: "Upload failed.", variant: "destructive" });
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (docItem: StoredDocument) => {
    try {
      await deleteObject(ref(storage, docItem.storagePath));
    } catch {}
    const updated = documents.filter((d) => d.id !== docItem.id);
    await saveDocs(updated);
    toast({ title: "Deleted", description: `"${docItem.fileName}" removed.` });
  };

  const handleLabelChange = async (id: string, newLabel: string) => {
    const updated = documents.map((d) => (d.id === id ? { ...d, label: newLabel } : d));
    await saveDocs(updated);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">Upload files for automatic attachment during form filling.</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-2">
          <Upload className="w-4 h-4" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {documents.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-16 flex flex-col items-center justify-center text-center">
          <FileText className="w-12 h-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            Upload your first document
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((d) => (
            <div key={d.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{d.fileName}</p>
                <div className="mt-1">
                  <Input
                    value={d.label}
                    onChange={(e) => {
                      setDocuments((prev) => prev.map((doc) => doc.id === d.id ? { ...doc, label: e.target.value } : doc));
                    }}
                    onBlur={() => handleLabelChange(d.id, d.label)}
                    onKeyDown={(e) => e.key === "Enter" && handleLabelChange(d.id, d.label)}
                    placeholder="e.g. Resume, 10th Memo, Intermediate Memo"
                    className="h-7 text-xs max-w-xs"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleDelete(d)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsSection;
