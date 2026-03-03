import type { AEIConnectProps } from "@emails/aei-connect";
import { useEmailRender } from "../hooks/useEmailRender";
import { getValidationErrors } from "../utils/validation";

export function PreviewPane({ props }: { props: AEIConnectProps }) {
  const html = useEmailRender(props);
  const errors = getValidationErrors(props);

  return (
    <div className="preview-inner">
      {errors.length > 0 && (
        <div className="validation-banner">
          <strong>Missing required fields ({errors.length}):</strong>
          <ul>
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
      <iframe srcDoc={html || "<p>Rendering...</p>"} title="Email preview" />
    </div>
  );
}
