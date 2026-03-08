import { Building2, Calendar, Clock, Target, TrendingUp } from "lucide-react";

const stats = [
  {
    label: "Total Applications",
    value: "47",
    change: "+12 this week",
    icon: Building2,
  },
  {
    label: "Interviews",
    value: "8",
    change: "+3 this week",
    icon: Calendar,
  },
  {
    label: "Pending",
    value: "23",
    change: "5 new today",
    icon: Clock,
  },
  {
    label: "Match Score Avg",
    value: "84%",
    change: "+2% improvement",
    icon: Target,
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card border border-border rounded-xl p-5 flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-primary flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              {stat.change}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <stat.icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
