import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileOverview from "@/components/dashboard/ProfileOverview";
import { PanelLeft } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && <ProfileOverview />}

          {activeTab === "professional" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Professional</h2>
              <p className="text-muted-foreground">Work experience and professional details coming soon.</p>
            </div>
          )}

          {activeTab === "education" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Education</h2>
              <p className="text-muted-foreground">Education history details coming soon.</p>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Documents</h2>
              <p className="text-muted-foreground">Upload resumes, memos, and ID proofs here.</p>
            </div>
          )}

          {activeTab === "custom-fields" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Custom Fields</h2>
              <p className="text-muted-foreground">Add custom autofill fields coming soon.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Settings</h2>
              <p className="text-muted-foreground">Theme, account, and extension settings.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
