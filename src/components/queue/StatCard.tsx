interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  type: "critical" | "info" | "time";
}

export default function StatCard({ title, value, icon, type }: StatCardProps) {
  const getIconContainerClass = () => {
    switch (type) {
      case "critical": return "bg-error-container text-on-error-container";
      case "time": return "bg-tertiary-container text-on-tertiary-container";
      default: return "bg-secondary-container text-on-secondary-container";
    }
  };

  const getValueClass = () => {
    return type === "critical" ? "text-error font-bold" : "text-on-surface font-bold";
  };

  return (
    <div className="bg-surface p-md rounded-xl border border-outline-variant/60 shadow-soft flex items-center gap-md transition-all duration-300 hover:shadow-md hover:-translate-y-px">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm ${getIconContainerClass()}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">{title}</p>
        <p className={`font-headline-md text-headline-md mt-0.5 ${getValueClass()}`}>{value}</p>
      </div>
    </div>
  );
}
