import { useRef, useState } from "react";
import { Download } from "lucide-react";

import Navbar from "@/components/Navbar";
import GraphCard from "@/components/GraphCard";
import UploadCard from "@/components/UploadCard";
import SummaryCard from "@/components/SummaryCard";
import RingsTable from "@/components/RingsTable";
import { Button } from "@/components/ui/button";

const Index = () => {

  const uploadRef = useRef(null);

  // store backend response here
  const [data, setData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const downloadJSON = () => {
    if (!data?.result) return;

    try {
      // Only include essential data, exclude large graph object
      const reportData = {
        summary: data.result.summary,
        suspicious_accounts: data.result.suspicious_accounts,
        fraud_rings: data.result.fraud_rings,
        timestamp: new Date().toISOString()
      };

      const blob = new Blob(
        [JSON.stringify(reportData, null, 2)],
        { type: "application/json" }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fraud_report_${Date.now()}.json`;
      a.click();

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">

      <Navbar onUploadClick={scrollToUpload} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-6">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* LEFT: GRAPH */}
          <div className="lg:col-span-2">
            <GraphCard
              graph={data?.graph}
              suspicious={data?.result?.suspicious_accounts}
              isLoading={isProcessing}
            />
          </div>

          {/* RIGHT: STACKED CARDS */}
          <div className="flex flex-col gap-6" ref={uploadRef}>

            <UploadCard onResult={setData} onProcessingChange={setIsProcessing} />

            <SummaryCard summary={data?.result?.summary} />

            <RingsTable rings={data?.result?.fraud_rings} />

            <Button onClick={downloadJSON} className="gap-2">
            <Download className="h-4 w-4" />
            Download JSON Report
          </Button>

          </div>

        </div>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-4">

          <p className="text-xs text-gray-400">
            © 2026 Financial Crime Detection Engine
          </p>

        </div>
      </footer>

    </div>
  );
};

export default Index;
