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
    return type === "critical" ? "text-error" : "text-on-surface";
  };

  return (
    <div className="bg-surface p-md rounded-lg border border-outline-variant shadow-sm flex items-center gap-md">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconContainerClass()}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">{title}</p>
        <p className={`font-headline-md text-headline-md ${getValueClass()}`}>{value}</p>
      </div>
    </div>
  );
}
