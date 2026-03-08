import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Application {
  id: string;
  company: string;
  role: string;
  date: string;
  status: "Interview" | "Applied" | "Under Review" | "Rejected" | "Offered";
  formUrl?: string;
}

const statusStyles: Record<string, string> = {
  Interview: "bg-primary/20 text-primary",
  Applied: "bg-blue-500/20 text-blue-400",
  "Under Review": "bg-yellow-500/20 text-yellow-400",
  Rejected: "bg-destructive/20 text-destructive",
  Offered: "bg-emerald-500/20 text-emerald-400",
};

const mockApplications: Application[] = [
  { id: "1", company: "Google", role: "ML Engineer", date: "Mar 5, 2026", status: "Interview", formUrl: "#" },
  { id: "2", company: "Meta", role: "Software Engineer", date: "Mar 4, 2026", status: "Applied", formUrl: "#" },
  { id: "3", company: "Stripe", role: "Full Stack Developer", date: "Mar 3, 2026", status: "Under Review", formUrl: "#" },
  { id: "4", company: "OpenAI", role: "Research Scientist", date: "Mar 2, 2026", status: "Applied", formUrl: "#" },
  { id: "5", company: "Vercel", role: "Frontend Engineer", date: "Mar 1, 2026", status: "Rejected", formUrl: "#" },
];

const ApplicationsTable = () => {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-display font-bold text-foreground">Recent Applications</h3>
      <p className="text-sm text-muted-foreground mb-4">Your latest job applications</p>
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Company</TableHead>
            <TableHead className="text-muted-foreground">Role</TableHead>
            <TableHead className="text-muted-foreground">Date</TableHead>
            <TableHead className="text-muted-foreground">Status</TableHead>
            <TableHead className="text-muted-foreground">Form</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockApplications.map((app) => (
            <TableRow key={app.id} className="border-border">
              <TableCell className="font-semibold text-foreground">{app.company}</TableCell>
              <TableCell className="text-muted-foreground">{app.role}</TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">{app.date}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    statusStyles[app.status]
                  )}
                >
                  {app.status}
                </span>
              </TableCell>
              <TableCell>
                {app.formUrl && (
                  <a
                    href={app.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                    title="Open original form"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApplicationsTable;
