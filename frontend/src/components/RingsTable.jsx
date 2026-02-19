const getRiskColor = (risk) => {
  if (risk >= 85) return "bg-red-100 text-red-600";
  if (risk >= 70) return "bg-yellow-100 text-yellow-600";
  return "bg-green-100 text-green-600";
};

const RingsTable = ({ rings }) => {

  const data = rings?.length
    ? rings.map(r => ({
        id: r.ring_id,
        pattern: r.pattern_type || "Cycle",
        members: r.member_accounts?.length || 0,
        risk: r.risk_score || 0
      }))
    : [];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-sm">

      <div className="border-b border-gray-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">Fraud Rings</h2>
        <p className="text-xs text-gray-400">Detected suspicious clusters</p>
      </div>

      <div className="max-h-56 overflow-auto">

        {data.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-sm text-gray-500">
           Upload CSV file to see detected rings
          </div>
        ) : (

          <table className="w-full text-sm">

            <thead>
              <tr className="border-b border-gray-800 bg-gray-800">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400">
                  Ring ID
                </th>
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-400">
                  Pattern
                </th>
                <th className="px-5 py-2.5 text-center text-xs font-medium text-gray-400">
                  Members
                </th>
                <th className="px-5 py-2.5 text-right text-xs font-medium text-gray-400">
                  Risk
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((ring) => (
                <tr
                  key={ring.id}
                  className="border-b border-gray-800 last:border-0 hover:bg-gray-800 transition-colors"
                >
                  <td className="px-5 py-3 font-medium text-white">
                    {ring.id}
                  </td>

                  <td className="px-5 py-3 text-gray-400">
                    {ring.pattern}
                  </td>

                  <td className="px-5 py-3 text-center text-gray-400">
                    {ring.members}
                  </td>

                  <td className="px-5 py-3 text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${getRiskColor(ring.risk)}`}
                    >
                      {ring.risk}%
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        )}

      </div>

    </div>
  );
};

export default RingsTable;
