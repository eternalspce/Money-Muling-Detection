import { useEffect, useRef, useState } from "react";
import { Loader2, Filter } from "lucide-react";
import cytoscape from "cytoscape";

const GraphCard = ({ graph, suspicious, isLoading }) => {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const [filterMode, setFilterMode] = useState("suspicious"); // "all", "suspicious", "rings"

  useEffect(() => {
    if (!cyRef.current || !graph) return;

    // destroy previous instance safely
    if (cyInstance.current) {
      cyInstance.current.destroy();
      cyInstance.current = null;
    }

    const suspiciousSet = new Set(
      (suspicious || []).map(s => s.account_id)
    );

    const allNodes = Array.from(graph?.nodes || []);
    const allEdges = Array.from(graph?.edges || []);

    let nodesToShow = allNodes;
    let edgesToShow = allEdges;

    // Filter based on mode
    if (filterMode === "suspicious" && suspicious?.length > 0) {
      // Only show suspicious accounts + their direct connections
      const suspiciousArray = suspicious.slice(0, 100); // Limit to top 100
      const suspiciousIds = new Set(suspiciousArray.map(s => s.account_id));
      const connectedAccounts = new Set(suspiciousIds);

      // Add accounts connected to suspicious ones
      allEdges.forEach(e => {
        if (suspiciousIds.has(e.source)) connectedAccounts.add(e.target);
        if (suspiciousIds.has(e.target)) connectedAccounts.add(e.source);
      });

      nodesToShow = allNodes.filter(n => connectedAccounts.has(n));
      edgesToShow = allEdges.filter(
        e => connectedAccounts.has(e.source) && connectedAccounts.has(e.target)
      );
    }

    const elements = [
      ...nodesToShow.map(id => ({
        data: {
          id,
          label: id.substring(0, 6), // Truncate long IDs
          suspicious: suspiciousSet.has(id)
        }
      })),
      ...edgesToShow.map(e => ({
        data: { source: e.source, target: e.target }
      }))
    ];

    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements,

      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "10px",
            "font-family": "Inter, sans-serif",
            "font-weight": 500,
            color: "#fff",
            width: 36,
            height: 36,
            "background-color": "#3b82f6",
            "border-width": 2,
            "border-color": "#2563eb"
          }
        },
        {
          selector: "node[?suspicious]",
          style: {
            "background-color": "#ef4444",
            "border-color": "#dc2626"
          }
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#cbd5e1",
            "target-arrow-color": "#94a3b8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            "arrow-scale": 0.8
          }
        }
      ],

      layout: {
        name: "cose",
        directed: false,
        animate: false,
        nodeRepulsion: (node) => 10000,
        nodeOverlap: 100,
        idealEdgeLength: 150,
        edgeElasticity: 0.1,
        nestingFactor: 2,
        gravity: 0.5,
        numIter: 2500,
        initialTemp: 200,
        coolingFactor: 0.95,
        minTemp: 1,
        padding: 80
      },

      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    return () => {
      cyInstance.current?.destroy();
      cyInstance.current = null;
    };

  }, [graph, suspicious, filterMode]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-800 bg-gray-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Transaction Network
          </h2>
          <p className="text-xs text-gray-400">
            Interactive graph visualization
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Filter className="h-4 w-4" />
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="rounded bg-gray-800 px-2 py-1 text-xs text-white border border-gray-700 hover:border-gray-600"
            >
              <option value="suspicious">Show Suspicious Only</option>
              <option value="all">Show All Accounts</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" />
              Normal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
              Suspicious
            </span>
          </div>
        </div>
      </div>

      <div id="cy" ref={cyRef} className="min-h-100 relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-b-xl bg-black bg-opacity-50 z-50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium text-white">
                Processing transactions...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphCard;
