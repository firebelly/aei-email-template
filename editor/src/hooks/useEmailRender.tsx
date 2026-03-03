import { useState, useEffect, useRef } from "react";
import { render } from "@react-email/render";
import { AEIConnect } from "@emails/aei-connect";
import type { AEIConnectProps } from "@emails/aei-connect";

export function useEmailRender(props: AEIConnectProps) {
  const [html, setHtml] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        const result = await render(<AEIConnect {...props} />);
        setHtml(result);
      } catch (err) {
        console.error("Render error:", err);
      }
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [props]);

  return html;
}
