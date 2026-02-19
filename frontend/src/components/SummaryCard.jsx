import { Users, AlertTriangle, GitBranch, Clock } from "lucide-react";

const SummaryCard = ({ summary }) => {

  const stats = summary
    ? [
        {
          label: "Accounts Analyzed",
          value: summary.total_accounts_analyzed ?? 0,
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        },
        {
          label: "Suspicious Flagged",
          value: summary.suspicious_accounts_flagged ?? 0,
          icon: AlertTriangle,
          color: "text-red-600",
          bgColor: "bg-red-100",
        },
        {
          label: "Fraud Rings",
          value: summary.fraud_rings_detected ?? 0,
          icon: GitBranch,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100",
        },
        {
          label: "Processing Time",
          value: `${summary.processing_time_seconds ?? 0}s`,
          icon: Clock,
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
      ]
    : [];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-sm">

      <div className="border-b border-gray-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">
          Detection Summary
        </h2>
        <p className="text-xs text-gray-400">
          Analysis results overview
        </p>
      </div>

      {stats.length === 0 ? (

        <div className="flex items-center justify-center py-10 text-sm text-gray-400">
          Upload a CSV file to see detection summary
        </div>

      ) : (

        <div className="grid grid-cols-2 gap-4 p-5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-start gap-3">

              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>

              <div>
                <p className="text-lg font-semibold text-white">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-400">
                  {stat.label}
                </p>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
};

export default SummaryCard;
