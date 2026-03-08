import { Sparkles } from "lucide-react";

const suggestions = [
  "Add 'distributed systems' and 'Kubernetes' to your resume keywords",
  "Highlight ML projects more prominently in your profile",
  "Add quantifiable achievements to experience section",
  "Consider adding a portfolio link to boost match scores",
];

const AISuggestions = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-display font-bold text-foreground">AI Suggestions</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Improve your chances</p>
      <ul className="space-y-4">
        {suggestions.map((s, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
            <span className="text-sm text-muted-foreground leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AISuggestions;
