import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, RotateCcw, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FIELD_SYNONYMS: Record<string, string[]> = {
  fullName: ["full name", "name", "your name", "applicant name", "candidate name"],
  firstName: ["first name", "given name"],
  lastName: ["last name", "surname", "family name"],
  email: ["email", "e-mail", "email address"],
  phone: ["phone", "telephone", "mobile", "contact number", "phone number"],
  dateOfBirth: ["date of birth", "dob", "birth date", "birthday"],
  gender: ["gender", "sex"],
  address: ["address", "street address", "residential address"],
  city: ["city", "town"],
  state: ["state", "province", "region"],
  zipCode: ["zip code", "postal code", "pincode"],
  country: ["country", "nation"],
  university: ["university", "college", "institution"],
  degree: ["degree", "qualification"],
  fieldOfStudy: ["field of study", "major", "specialization"],
  gpa: ["gpa", "cgpa", "grade"],
  graduationYear: ["graduation year", "year of graduation"],
  currentCompany: ["current company", "company", "employer"],
  jobTitle: ["job title", "position", "designation"],
  experience: ["experience", "years of experience"],
  skills: ["skills", "key skills", "technical skills"],
  linkedin: ["linkedin", "linkedin url"],
  expectedSalary: ["expected salary", "salary expectation"],
  noticePeriod: ["notice period", "availability"],
};

interface FormField {
  id: string;
  label: string;
  dataKey: string;
  placeholder: string;
}

const SAMPLE_FIELDS: FormField[] = [
  { id: "full_name", label: "Full Name", dataKey: "fullName", placeholder: "Enter your full name" },
  { id: "email_addr", label: "Email Address", dataKey: "email", placeholder: "your@email.com" },
  { id: "phone_num", label: "Phone Number", dataKey: "phone", placeholder: "+1 (555) 000-0000" },
  { id: "dob", label: "Date of Birth", dataKey: "dateOfBirth", placeholder: "MM/DD/YYYY" },
  { id: "gender_field", label: "Gender", dataKey: "gender", placeholder: "Male / Female / Other" },
  { id: "street_address", label: "Address", dataKey: "address", placeholder: "123 Main St" },
  { id: "city_field", label: "City", dataKey: "city", placeholder: "City" },
  { id: "state_field", label: "State", dataKey: "state", placeholder: "State" },
  { id: "zip_code", label: "ZIP Code", dataKey: "zipCode", placeholder: "12345" },
  { id: "country_field", label: "Country", dataKey: "country", placeholder: "Country" },
  { id: "uni", label: "University", dataKey: "university", placeholder: "University name" },
  { id: "deg", label: "Degree", dataKey: "degree", placeholder: "B.Tech, MBA, etc." },
  { id: "major", label: "Field of Study", dataKey: "fieldOfStudy", placeholder: "Computer Science" },
  { id: "cgpa", label: "GPA", dataKey: "gpa", placeholder: "3.8" },
  { id: "grad_year", label: "Graduation Year", dataKey: "graduationYear", placeholder: "2024" },
  { id: "company", label: "Current Company", dataKey: "currentCompany", placeholder: "Company name" },
  { id: "position", label: "Job Title", dataKey: "jobTitle", placeholder: "Software Engineer" },
  { id: "exp", label: "Years of Experience", dataKey: "experience", placeholder: "3" },
  { id: "tech_skills", label: "Skills", dataKey: "skills", placeholder: "React, Python, etc." },
  { id: "linkedin_url", label: "LinkedIn", dataKey: "linkedin", placeholder: "linkedin.com/in/..." },
];

function flattenData(obj: Record<string, any>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    if (key === "customFields" && Array.isArray(value)) {
      for (const section of value) {
        if (section?.entries && Array.isArray(section.entries)) {
          for (const entry of section.entries) {
            if (entry?.label?.trim() && entry?.value?.trim()) {
              result[entry.label.trim()] = entry.value.trim();
            }
          }
        }
      }
      continue;
    }
    if (Array.isArray(value)) {
      const joined = value.filter(Boolean).join(", ");
      if (joined) result[key] = joined;
    } else if (typeof value === "object") {
      Object.assign(result, flattenData(value));
    } else {
      const str = String(value).trim();
      if (str && str !== "[object Object]" && str !== "undefined" && str !== "null") {
        result[key] = str;
      }
    }
  }
  return result;
}

const TestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [userData, setUserData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [filledCount, setFilledCount] = useState(0);
  const [filling, setFilling] = useState(false);
  const [filledFields, setFilledFields] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      if (!user) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const flat = flattenData(snap.data());
          const keysToRemove = Object.keys(flat).filter(
            (k) => k === "createdAt" || k === "updatedAt" || k.toLowerCase().includes("password")
          );
          keysToRemove.forEach((k) => delete flat[k]);
          setUserData(flat);
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleAutoFill = async () => {
    setFilling(true);
    const newValues: Record<string, string> = {};
    const newFilled = new Set<string>();
    let count = 0;

    for (const field of SAMPLE_FIELDS) {
      const value = userData[field.dataKey];
      if (value && value.trim()) {
        // Animate with delay
        await new Promise((r) => setTimeout(r, 80));
        newValues[field.id] = value;
        newFilled.add(field.id);
        count++;
        setFormValues((prev) => ({ ...prev, [field.id]: value }));
        setFilledFields((prev) => new Set([...prev, field.id]));
      }
    }

    setFilledCount(count);
    setFilling(false);
    toast({
      title: `✓ Filled ${count} field${count !== 1 ? "s" : ""}`,
      description: count > 0 
        ? "Your profile data was auto-filled into the form." 
        : "No matching data found. Fill in your profile first.",
    });
  };

  const handleReset = () => {
    setFormValues({});
    setFilledCount(0);
    setFilledFields(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const availableFields = SAMPLE_FIELDS.filter((f) => userData[f.dataKey]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            {filledCount > 0 && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {filledCount} filled
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={handleAutoFill} 
              disabled={filling}
              className="gap-2 shadow-[0_0_15px_hsl(var(--primary)/0.3)]"
            >
              <Zap className="w-4 h-4" />
              {filling ? "Filling..." : "Auto-Fill with FillZapp"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Info */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sample Job Application Form</h1>
          <p className="text-muted-foreground">
            This is a test form to demonstrate FillZapp auto-fill. Click the button above to fill it with your profile data.
          </p>
          <Badge variant="outline" className="text-xs">
            {availableFields.length} of {SAMPLE_FIELDS.length} fields can be filled from your profile
          </Badge>
        </div>

        {/* Form */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>Please fill in all required fields</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SAMPLE_FIELDS.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}
                    {userData[field.dataKey] && (
                      <span className="ml-1.5 text-xs text-primary">●</span>
                    )}
                  </Label>
                  <Input
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ""}
                    onChange={(e) => setFormValues((prev) => ({ ...prev, [field.id]: e.target.value }))}
                    className={`transition-all duration-300 ${
                      filledFields.has(field.id)
                        ? "border-primary/50 bg-primary/5 shadow-[0_0_8px_hsl(var(--primary)/0.15)]"
                        : ""
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submission preview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">How it works on real sites</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>This test form demonstrates the same matching logic used by the FillZapp bookmarklet and Chrome extension:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>FillZapp reads form field labels (like "Full Name", "Email Address")</li>
              <li>It matches them to your stored profile data using smart synonym matching</li>
              <li>Matched fields are instantly filled with your data</li>
            </ol>
            <p className="pt-2">
              <strong className="text-foreground">Tip:</strong> The more profile data you add in your dashboard, the more fields FillZapp can auto-fill.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestForm;
