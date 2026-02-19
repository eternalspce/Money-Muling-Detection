import { useEffect, useRef } from "react";
import cytoscape from "cytoscape";

const GraphCard = ({ graph, suspicious }) => {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);

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

    const elements = [
      ...(graph.nodes || []).map(id => ({
        data: {
          id,
          label: id,
          suspicious: suspiciousSet.has(id)
        }
      })),
      ...(graph.edges || []).map(e => ({
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
        animate: true,
        animationDuration: 800,
        nodeRepulsion: () => 6000,
        idealEdgeLength: () => 100,
        padding: 40
      },

      userZoomingEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: false
    });

    return () => {
      cyInstance.current?.destroy();
      cyInstance.current = null;
    };

  }, [graph, suspicious]);

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

      <div id="cy" ref={cyRef} className="min-h-100 flex-1" />
    </div>
  );
};

export default GraphCard;
