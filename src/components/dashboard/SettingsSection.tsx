import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/hooks/use-theme";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Shield, Download, Trash2, LogOut, User, Palette, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SettingsSection = () => {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [autoFill, setAutoFill] = useState(() => localStorage.getItem("fz_autofill") !== "false");
  const [confirmBeforeFill, setConfirmBeforeFill] = useState(() => localStorage.getItem("fz_confirm") === "true");
  const [exporting, setExporting] = useState(false);

  const handleAutoFillToggle = (val: boolean) => {
    setAutoFill(val);
    localStorage.setItem("fz_autofill", String(val));
    toast({ title: val ? "Auto-fill enabled" : "Auto-fill disabled" });
  };

  const handleConfirmToggle = (val: boolean) => {
    setConfirmBeforeFill(val);
    localStorage.setItem("fz_confirm", String(val));
    toast({ title: val ? "Confirmation enabled" : "Confirmation disabled" });
  };

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const snap = await getDoc(doc(db, "users", user.uid));
      const data = snap.exists() ? snap.data() : {};
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fillzapp-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Exported", description: "Your data has been downloaded." });
    } catch {
      toast({ title: "Error", description: "Failed to export data.", variant: "destructive" });
    }
    setExporting(false);
  };

  const handleDeleteAllData = async () => {
    if (!user) return;
    const confirmed = window.confirm("Are you sure? This will permanently delete all your saved information. This action cannot be undone.");
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      toast({ title: "Data cleared", description: "All your saved information has been deleted." });
    } catch {
      toast({ title: "Error", description: "Failed to delete data.", variant: "destructive" });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, appearance, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Appearance */}
        <div className="bg-card border border-border rounded-xl p-5 hover-glow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base font-display font-bold text-foreground">Appearance</h3>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground mt-0.5">Switch between light and dark mode</p>
            </div>
            <button
              onClick={toggle}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {theme === "dark" ? "Dark" : "Light"}
            </button>
          </div>
        </div>

        {/* Account */}
        <div className="bg-card border border-border rounded-xl p-5 hover-glow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base font-display font-bold text-foreground">Account</h3>
          </div>

          <div className="py-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Email</p>
            <p className="text-sm text-foreground">{user?.email || "—"}</p>
          </div>
          <div className="py-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-1">Display Name</p>
            <p className="text-sm text-foreground">{user?.displayName || "—"}</p>
          </div>
          <div className="pt-3">
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </Button>
          </div>
        </div>

        {/* Extension Preferences */}
        <div className="bg-card border border-border rounded-xl p-5 hover-glow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base font-display font-bold text-foreground">Extension Preferences</h3>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-fill</p>
              <p className="text-xs text-muted-foreground mt-0.5">Automatically fill detected form fields</p>
            </div>
            <Switch checked={autoFill} onCheckedChange={handleAutoFillToggle} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Confirm before filling</p>
              <p className="text-xs text-muted-foreground mt-0.5">Ask for confirmation before auto-filling</p>
            </div>
            <Switch checked={confirmBeforeFill} onCheckedChange={handleConfirmToggle} />
          </div>
        </div>

        {/* Data & Privacy */}
        <div className="bg-card border border-border rounded-xl p-5 hover-glow">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <h3 className="text-base font-display font-bold text-foreground">Data & Privacy</h3>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium text-foreground">Export Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">Download all your saved information as JSON</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData} disabled={exporting} className="gap-2">
              <Download className="w-3.5 h-3.5" />
              {exporting ? "Exporting..." : "Export"}
            </Button>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Delete All Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently remove all saved information</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleDeleteAllData} className="gap-2 text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50">
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
