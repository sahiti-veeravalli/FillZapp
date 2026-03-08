import { useState, useEffect } from "react";
import { Bookmark, Copy, Check, Zap, AlertCircle, ExternalLink } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// The field synonym map (same as the chrome extension)
const FIELD_SYNONYMS: Record<string, string[]> = {
  fullName: ["full name", "name", "your name", "applicant name", "candidate name", "full_name", "fullname"],
  firstName: ["first name", "first_name", "firstname", "given name"],
  lastName: ["last name", "last_name", "lastname", "surname", "family name"],
  email: ["email", "e-mail", "email address", "mail", "email_address"],
  phone: ["phone", "telephone", "mobile", "cell", "contact number", "phone number", "mobile number", "tel"],
  dateOfBirth: ["date of birth", "dob", "birth date", "birthday", "date_of_birth"],
  gender: ["gender", "sex"],
  address: ["address", "street address", "street", "residential address", "mailing address"],
  city: ["city", "town"],
  state: ["state", "province", "region"],
  zipCode: ["zip", "zip code", "postal code", "pincode", "pin code", "zipcode", "pin"],
  country: ["country", "nation"],
  university: ["university", "college", "institution", "school", "institute"],
  degree: ["degree", "qualification", "education level"],
  fieldOfStudy: ["field of study", "major", "specialization", "branch", "department", "course"],
  gpa: ["gpa", "cgpa", "grade", "percentage", "marks", "score"],
  graduationYear: ["graduation year", "year of graduation", "passing year", "batch"],
  currentCompany: ["current company", "company", "employer", "organization", "organisation"],
  jobTitle: ["job title", "position", "designation", "role", "title"],
  experience: ["experience", "years of experience", "work experience", "total experience"],
  skills: ["skills", "skill set", "key skills", "technical skills", "competencies"],
  linkedin: ["linkedin", "linkedin url", "linkedin profile"],
  expectedSalary: ["expected salary", "salary expectation", "desired salary", "salary"],
  jobType: ["job type", "employment type", "work type"],
  preferredLocation: ["preferred location", "location preference", "desired location", "work location"],
  noticePeriod: ["notice period", "availability", "joining time"],
};

function flattenData(obj: Record<string, any>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null || value === "") continue;
    
    // Handle customFields array specially
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
      const nested = flattenData(value, prefix);
      Object.assign(result, nested);
    } else {
      const str = String(value).trim();
      if (str && str !== "[object Object]") {
        result[key] = str;
      }
    }
  }
  return result;
}

function generateBookmarkletCode(data: Record<string, string>): string {
  const synonymsJson = JSON.stringify(FIELD_SYNONYMS);
  const dataJson = JSON.stringify(data);

  const code = `
(function(){
  var D=${dataJson};
  var S=${synonymsJson};
  function m(t){if(!t)return null;var l=t.toLowerCase().trim();for(var k in S){for(var i=0;i<S[k].length;i++){if(l.indexOf(S[k][i])>-1||S[k][i].indexOf(l)>-1)return k;}}return null;}
  function gl(el){if(el.id){var lb=document.querySelector('label[for=\"'+el.id+'\"]');if(lb)return lb.textContent;}var p=el.closest('label');if(p)return p.textContent;if(el.getAttribute('aria-label'))return el.getAttribute('aria-label');if(el.placeholder)return el.placeholder;if(el.name)return el.name.replace(/[_-]/g,' ');var pr=el.previousElementSibling;if(pr&&pr.textContent)return pr.textContent;return null;}
  var inputs=document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=reset]):not([type=file]):not([type=image]),textarea,select');
  var c=0;
  inputs.forEach(function(el){
    var label=gl(el);var key=m(label);
    if(key&&D[key]){
      var v=D[key];
      if(el.tagName==='SELECT'){var opts=Array.from(el.options);var mt=opts.find(function(o){return o.value.toLowerCase()===v.toLowerCase()||o.textContent.toLowerCase().indexOf(v.toLowerCase())>-1;});if(mt){el.value=mt.value;el.dispatchEvent(new Event('change',{bubbles:true}));c++;}}
      else if(el.type==='radio'){if(el.value.toLowerCase()===v.toLowerCase()){el.checked=true;el.dispatchEvent(new Event('change',{bubbles:true}));c++;}}
      else if(el.type==='checkbox'){var sc=v==='true'||v==='yes'||v==='1';if(el.checked!==sc){el.checked=sc;el.dispatchEvent(new Event('change',{bubbles:true}));c++;}}
      else{var ns=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value');if(ns&&ns.set){ns.set.call(el,v);}else{el.value=v;}el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));c++;el.style.transition='background-color 0.3s';el.style.backgroundColor='#00e5c030';setTimeout(function(){el.style.backgroundColor='';},1500);}
    }
  });
  var t=document.createElement('div');t.style.cssText='position:fixed;bottom:20px;right:20px;background:#0a0a0a;color:#00e5c0;padding:12px 20px;border-radius:10px;font-family:system-ui;font-size:14px;z-index:99999;border:1px solid #00e5c040;box-shadow:0 0 20px #00e5c020;';
  t.textContent=c>0?'✓ FillZapp filled '+c+' field'+(c>1?'s':''):'No matching fields found';
  document.body.appendChild(t);setTimeout(function(){t.style.opacity='0';t.style.transition='opacity 0.3s';setTimeout(function(){t.remove();},300);},3000);
})();`;

  return `javascript:${encodeURIComponent(code.replace(/\n/g, "").replace(/\s{2,}/g, " "))}`;
}

const BookmarkletSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<Record<string, string> | null>(null);
  const [bookmarkletUrl, setBookmarkletUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [fieldCount, setFieldCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const raw = snap.data();
          const flat = flattenData(raw);
          // Remove metadata fields and password fields
          const keysToRemove = Object.keys(flat).filter(
            (k) => k === "createdAt" || k === "updatedAt" || k.toLowerCase().includes("password")
          );
          keysToRemove.forEach((k) => delete flat[k]);
          
          // Only keep fields that have actual values
          const cleanData: Record<string, string> = {};
          for (const [k, v] of Object.entries(flat)) {
            if (v && v.trim() && v !== "undefined" && v !== "null") {
              cleanData[k] = v;
            }
          }
          
          setUserData(cleanData);
          setFieldCount(Object.keys(cleanData).length);
          setBookmarkletUrl(generateBookmarkletCode(cleanData));
        }
      } catch (err) {
        console.error("Failed to load user data for bookmarklet", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCopy = async () => {
    if (!bookmarkletUrl) return;
    await navigator.clipboard.writeText(bookmarkletUrl);
    setCopied(true);
    toast({ title: "Copied!", description: "Bookmarklet code copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Auto-Fill Bookmarklet
        </h2>
        <p className="text-muted-foreground mt-1">
          Fill forms on any website — no extension needed. Just drag the button to your bookmarks bar.
        </p>
      </div>

      {/* Bookmarklet drag target */}
      <Card className="border-primary/30 bg-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            Your FillZapp Bookmarklet
          </CardTitle>
          <CardDescription>
            Drag this button to your bookmarks bar, then click it on any page with a form.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Status */}
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-xs">
              {fieldCount} fields loaded
            </Badge>
          </div>

          {/* Primary: Copy & manual install */}
          {bookmarkletUrl ? (
            <div className="space-y-4">
              {/* Method 1: Drag to bookmarks bar */}
              <div className="flex flex-col items-center gap-4 py-6 px-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5">
                <p className="text-sm font-medium text-foreground">Method 1: Drag this to your bookmarks bar</p>
                <a
                  href={bookmarkletUrl}
                  onClick={(e) => e.preventDefault()}
                  draggable
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-[0_0_20px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-shadow cursor-grab active:cursor-grabbing select-none"
                >
                  <Zap className="w-4 h-4" />
                  ⚡ FillZapp
                </a>
                <p className="text-xs text-muted-foreground">
                  (Works when visiting the site directly — not inside Lovable preview)
                </p>
              </div>

              {/* Method 2: Copy + manual install */}
              <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">Method 2: Copy &amp; add manually</p>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Bookmarklet Code"}
                </Button>
                <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                  <li>Open <strong className="text-foreground">chrome://bookmarks</strong> in a new tab</li>
                  <li>Click <strong className="text-foreground">⋮ → Add new bookmark</strong></li>
                  <li>Name: <strong className="text-foreground">⚡ FillZapp</strong> — URL: paste the copied code</li>
                  <li>Click <strong className="text-foreground">Save</strong></li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-6">
              No profile data found. Fill in your profile first.
            </div>
          )}
        </CardContent>
      </Card>

      {/* How it works */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">How to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
              <span><strong className="text-foreground">Show bookmarks bar</strong> — Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+Shift+B</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘+Shift+B</kbd> on Mac)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
              <span><strong className="text-foreground">Drag the button</strong> above to your bookmarks bar</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
              <span><strong className="text-foreground">Visit any form</strong> — job applications, surveys, sign-ups, etc.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">4</span>
              <span><strong className="text-foreground">Click "⚡ FillZapp"</strong> in your bookmarks bar — fields auto-fill instantly</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Security note */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="pt-5">
          <div className="flex gap-3 text-sm">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Privacy Note</p>
              <p className="text-muted-foreground">
                The bookmarklet contains your profile data encoded in the URL. Don't share it with others. 
                If you update your profile, come back here to get a fresh bookmarklet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview of loaded data */}
      {userData && Object.keys(userData).length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Fields Included</CardTitle>
            <CardDescription>These fields will be matched and filled automatically</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(userData).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 text-sm">
                  <span className="font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                  <span className="text-muted-foreground truncate">{String(value).substring(0, 30)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BookmarkletSection;
