import { useState, useCallback } from "react";
import type { AEIConnectProps, ContentSection } from "@emails/aei-connect";
import { defaultProps } from "@emails/aei-connect";
import { EditorForm } from "./components/EditorForm";
import { PreviewPane } from "./components/PreviewPane";
import { ExportButton } from "./components/ExportButton";

export function App() {
  const [props, setProps] = useState<AEIConnectProps>(() => ({
    ...defaultProps,
  }));

  const updateProps = useCallback(
    <K extends keyof AEIConnectProps>(key: K, value: AEIConnectProps[K]) => {
      setProps((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateSection = useCallback(
    (index: number, section: ContentSection) => {
      setProps((prev) => {
        const next = [...prev.sections];
        next[index] = section;
        return { ...prev, sections: next };
      });
    },
    [],
  );

  const reorderSections = useCallback(
    (fromIndex: number, toIndex: number) => {
      setProps((prev) => {
        const next = [...prev.sections];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return { ...prev, sections: next };
      });
    },
    [],
  );

  const removeSection = useCallback(
    (index: number) => {
      setProps((prev) => ({
        ...prev,
        sections: prev.sections.filter((_, i) => i !== index),
      }));
    },
    [],
  );

  const addSection = useCallback(
    (section: ContentSection) => {
      setProps((prev) => ({
        ...prev,
        sections: [...prev.sections, section],
      }));
    },
    [],
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>AEI Connect Editor</h1>
        <ExportButton props={props} />
      </header>
      <aside className="sidebar">
        <EditorForm
          props={props}
          updateProps={updateProps}
          updateSection={updateSection}
          reorderSections={reorderSections}
          removeSection={removeSection}
          addSection={addSection}
        />
      </aside>
      <main className="preview">
        <PreviewPane props={props} />
      </main>
    </div>
  );
}
