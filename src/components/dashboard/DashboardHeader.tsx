import { Bell, Search, PanelLeft } from "lucide-react";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            title="Open sidebar"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 w-64">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search...</span>
          <span className="ml-auto text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
          JD
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
