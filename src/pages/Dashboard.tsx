import { useState, useCallback } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileOverview from "@/components/dashboard/ProfileOverview";
import PersonalInfoSection from "@/components/dashboard/PersonalInfoSection";
import AddressesSection from "@/components/dashboard/AddressesSection";
import ProfessionalSection from "@/components/dashboard/ProfessionalSection";
import EducationSection from "@/components/dashboard/EducationSection";
import JobPreferencesSection from "@/components/dashboard/JobPreferencesSection";
import GovernmentIDsSection from "@/components/dashboard/GovernmentIDsSection";
import FinancialSection from "@/components/dashboard/FinancialSection";
import SocialProfilesSection from "@/components/dashboard/SocialProfilesSection";
import CustomFields from "@/components/dashboard/CustomFields";

import SettingsSection from "@/components/dashboard/SettingsSection";
import DashboardSearch, { type SearchResult } from "@/components/dashboard/DashboardSearch";
import { type CustomField } from "@/components/dashboard/CustomFields";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightField, setHighlightField] = useState<string | null>(null);

  const handleSearchSelect = useCallback((result: SearchResult) => {
    setActiveTab(result.tab);
    setHighlightField(result.fieldKey);
    // Clear highlight after animation
    setTimeout(() => setHighlightField(null), 2500);
  }, []);

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
          onSearchOpen={() => setSearchOpen(true)}
        />
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === "overview" && <ProfileOverview highlightField={highlightField} />}
          {activeTab === "personal" && <PersonalInfoSection highlightField={highlightField} />}
          {activeTab === "addresses" && <AddressesSection />}
          {activeTab === "professional" && <ProfessionalSection highlightField={highlightField} />}
          {activeTab === "education" && <EducationSection highlightField={highlightField} />}
          {activeTab === "job-preferences" && <JobPreferencesSection highlightField={highlightField} />}
          {activeTab === "government-ids" && <GovernmentIDsSection highlightField={highlightField} />}
          {activeTab === "financial" && <FinancialSection highlightField={highlightField} />}
          {activeTab === "social-profiles" && <SocialProfilesSection />}
          
          {activeTab === "custom-fields" && (
            <CustomFields onFieldsChange={setCustomFields} />
          )}
          {activeTab === "settings" && <SettingsSection />}
        </main>
      </div>
      <DashboardSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSelect={handleSearchSelect}
      />
    </div>
  );
};

export default Dashboard;
