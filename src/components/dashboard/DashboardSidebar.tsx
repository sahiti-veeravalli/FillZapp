import { cn } from "@/lib/utils";
import { LayoutDashboard, User, FileText, Building2, BarChart3, Settings, Zap } from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "documents", label: "Resume Upload", icon: FileText },
  { id: "applications", label: "Applications", icon: Building2 },
  { id: "insights", label: "Match Insights", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-primary" />
        </div>
        <span className="font-display text-xl font-bold text-sidebar-foreground">FillzApp</span>
      </div>

      <nav className="flex-1 px-3 mt-2">
        <p className="px-3 mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
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
      </nav>

      <div className="p-4 m-3 rounded-xl bg-primary text-primary-foreground">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-semibold">AI Engine Active</span>
        </div>
        <p className="text-xs opacity-80">Auto-filling forms in real time</p>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
