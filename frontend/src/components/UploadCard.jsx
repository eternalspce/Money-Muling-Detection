import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import axios from "axios";

// If you use shadcn button keep this import,
// otherwise replace with normal button (see note below)
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UploadCard = ({ onResult }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".csv")) setFile(dropped);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await axios.post(
        `${API_URL}/upload`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // send result back to parent dashboard
      onResult?.(res.data);

    } catch (err) {
      console.error(err);
      alert("Upload failed. Check backend or CSV format.");
    }

    setIsProcessing(false);
  };

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-sm">

      <div className="border-b border-gray-800 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">
          Upload Transactions
        </h2>
        <p className="text-xs text-gray-400">
          CSV file with transaction records
        </p>
      </div>

      <div className="p-5">

        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-950"
              : "border-gray-700 hover:border-gray-600"
          }`}
        >
          <Upload className="mb-2 h-8 w-8 text-gray-500" />
          <p className="text-sm font-medium text-white">
            Drop CSV file here
          </p>
          <p className="text-xs text-gray-400">or click to browse</p>

          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {file && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-800 px-3 py-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-200">{file.name}</span>
            </div>

            <button
              onClick={() => setFile(null)}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || isProcessing}
          className="mt-4 w-full gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload & Analyze
            </>
          )}
        </Button>

      </div>
    </div>
  );
};

export default UploadCard;
