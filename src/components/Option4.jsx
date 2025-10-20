import "../css/Option4.css";
import ReactJson from "react-json-view";
import { useState, useRef, useEffect } from "react";

function Option4({ data }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const jsonViewerRef = useRef(null);

  useEffect(() => {
    if (data) {
      // Simulate loading time for JSON processing
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [data]);

  if (!data) return <div className="content">No data available</div>;

  const handleCollapseAll = () => {
    setCollapsed(!collapsed);
  };

  if (loading) {
    return (
      <div className="content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading JSON data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="option4-header">
        <div className="option4-title">Raw Data</div>
        <button className="collapse-all-btn" onClick={handleCollapseAll}>
          {collapsed ? "Expand All" : "Collapse All"}
        </button>
      </div>
      <div className="option4-json-display">
        <ReactJson
          ref={jsonViewerRef}
          src={data}
          theme="light"
          collapsed={collapsed}
          displayObjectSize={true}
          displayDataTypes={true}
          enableClipboard={true}
          indentWidth={4}
          iconStyle="triangle"
          name="data"
          collapseStringsAfterLength={100}
          shouldCollapse={() => {
            return collapsed;
          }}
          style={{
            fontSize: "14px",
          }}
        />
      </div>
    </div>
  );
}

export default Option4;
