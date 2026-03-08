import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileOverview from "@/components/dashboard/ProfileOverview";
import PersonalInfoSection from "@/components/dashboard/PersonalInfoSection";
import ProfessionalSection from "@/components/dashboard/ProfessionalSection";
import EducationSection from "@/components/dashboard/EducationSection";
import CustomFields from "@/components/dashboard/CustomFields";
import DocumentsSection from "@/components/dashboard/DocumentsSection";
import SettingsSection from "@/components/dashboard/SettingsSection";
import { type CustomField } from "@/components/dashboard/CustomFields";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onClose={() => setSidebarOpen(false)}
          customFields={customFields}
        />
      )}
      <div className="flex-1 flex flex-col">
        <DashboardHeader
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && <ProfileOverview />}
          {activeTab === "personal" && <PersonalInfoSection />}
          {activeTab === "professional" && <ProfessionalSection />}
          {activeTab === "education" && <EducationSection />}
          {activeTab === "documents" && <DocumentsSection />}
          {activeTab === "custom-fields" && (
            <CustomFields onFieldsChange={setCustomFields} />
          )}
          {activeTab === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
