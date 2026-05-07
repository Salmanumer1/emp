// src/components/TableauEmbed.jsx
import { useEffect, useRef, useState } from "react";

function TableauEmbed({ url, height = "600px" }) {
  const vizRef = useRef(null);
  const vizInstance = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!window.tableau) return;

    if (vizInstance.current) {
      vizInstance.current.dispose();
    }

    vizInstance.current = new window.tableau.Viz(vizRef.current, url, {
      width: "100%",
      height: height,
      hideTabs: true,
      hideToolbar: false,
      onFirstInteractive: () => setLoading(false),
    });

    return () => {
      if (vizInstance.current) {
        vizInstance.current.dispose();
        vizInstance.current = null;
      }
    };
  }, [url]);

  return (
    <div style={{ position: "relative" }}>
      {loading && (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div ref={vizRef} style={{ width: "100%" }} />
    </div>
  );
}

export default TableauEmbed;