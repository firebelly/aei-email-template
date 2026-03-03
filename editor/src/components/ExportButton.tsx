import { useState } from "react";
import { render } from "@react-email/render";
import { AEIConnect } from "@emails/aei-connect";
import type { AEIConnectProps } from "@emails/aei-connect";
import { getValidationErrors } from "../utils/validation";

export function ExportButton({ props }: { props: AEIConnectProps }) {
  const [exporting, setExporting] = useState(false);
  const errors = getValidationErrors(props);
  const hasErrors = errors.length > 0;

  const handleExport = async () => {
    setExporting(true);
    try {
      const html = await render(<AEIConnect {...props} />);
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "aei-connect.html";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export HTML. Check console for details.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      className="btn btn-export"
      onClick={handleExport}
      disabled={exporting || hasErrors}
      title={hasErrors ? "Fill in all required fields before exporting" : undefined}
    >
      {exporting ? "Exporting..." : "Export HTML"}
    </button>
  );
}
