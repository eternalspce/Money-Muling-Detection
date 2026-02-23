import { Upload, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ onUploadClick }) => {
  return (
    <header className="border-b border-gray-800 bg-gray-900">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-700 overflow-hidden">
            <img
              src="/favicon-16x16.png"
              alt="Logo"
              className="h-5 w-5 object-contain"
            />
          </div>

          <div>
            <h1 className="text-lg font-semibold tracking-tight text-white">
              Financial Crime Detection Engine
            </h1>
            <p className="text-xs text-gray-400">
              Graph-based money muling analysis
            </p>
          </div>
        </div>

        <Button onClick={onUploadClick} size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload CSV
        </Button>

      </div>
    </header>
  );
};

export default Navbar;
