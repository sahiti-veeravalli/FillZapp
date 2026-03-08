import { cn } from "@/lib/utils";
import { User, Briefcase, GraduationCap, FileText, PlusCircle, Settings, Zap, LogOut, PanelLeftClose, Tag } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { type CustomField } from "@/components/dashboard/CustomFields";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  customFields?: CustomField[];
}

const menuItems = [
  { id: "overview", label: "Overview", icon: User },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "custom-fields", label: "Custom Fields", icon: PlusCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

const DashboardSidebar = ({ activeTab, onTabChange, onClose, customFields = [] }: DashboardSidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <button onClick={() => navigate("/")} className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <span className="font-display text-xl font-bold text-sidebar-foreground">FillZapp</span>
      </button>

      <nav className="flex-1 px-3 mt-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}

        {/* Dynamic custom fields */}
        {customFields.length > 0 && (
          <div className="mt-4 pt-3 border-t border-sidebar-border">
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Custom</p>
            {customFields.map((field) => (
              <button
                key={field.id}
                onClick={() => onTabChange("custom-fields")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5",
                  "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Tag className="w-3.5 h-3.5" />
                <span className="truncate">{field.name}</span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>

        <button
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors border-t border-border pt-3 mt-2"
        >
          <PanelLeftClose className="w-4 h-4" />
          <span>Close sidebar</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
