import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ApplicationsTable from "@/components/dashboard/ApplicationsTable";
import AISuggestions from "@/components/dashboard/AISuggestions";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <StatsCards />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ApplicationsTable />
                </div>
                <AISuggestions />
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">My Profile</h2>
              <p className="text-muted-foreground">Profile forms coming soon — Basic Info, Address, Education, Work, Custom fields.</p>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Resume & Documents</h2>
              <p className="text-muted-foreground">Upload 10th memo, inter memo, resume, and ID proofs here.</p>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              <ApplicationsTable />
            </div>
          )}

          {activeTab === "insights" && (
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Match Insights</h2>
              <p className="text-muted-foreground">AI-powered field matching analytics coming soon.</p>
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
