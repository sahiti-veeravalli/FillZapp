import { useState } from "react";
import { Search, PanelLeft, Sun, Moon, LogOut, User, Home } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const DashboardHeader = ({ sidebarOpen, onToggleSidebar }: DashboardHeaderProps) => {
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  const handleLogout = async () => {
    setShowMenu(false);
    await logout();
    navigate("/");
  };

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
        <button
          onClick={toggle}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Go to home"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* Profile avatar with hover dropdown */}
        <div
          className="relative"
          onMouseEnter={() => setShowMenu(true)}
          onMouseLeave={() => setShowMenu(false)}
        >
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary cursor-pointer hover:shadow-[0_0_12px_hsl(var(--primary)/0.3)] transition-shadow duration-300">
            {initials}
          </div>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">{user?.displayName || "User"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { setShowMenu(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;