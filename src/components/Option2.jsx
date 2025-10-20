import "../css/Option2.css";
import { Tree } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { useState, useEffect } from "react";

// Helper function to get appropriate icon based on data type
const getIconForValue = (value) => {
  if (value === null) return "ban-circle";
  if (typeof value === "boolean") return value ? "tick-circle" : "cross-circle";
  if (typeof value === "string") return "citation";
  if (typeof value === "number") return "numerical";
  if (Array.isArray(value)) return "array";
  if (typeof value === "object") return "property";
  return "help";
};

// Convert JSON data to Blueprint Tree node format
const convertToTreeNodes = (obj, key = "root", isRoot = false) => {
  if (typeof obj !== "object" || obj === null) {
    const icon = getIconForValue(obj);
    return [
      {
        id: key,
        label: (
          <span>
            <strong>{key}</strong>: {JSON.stringify(obj)}
          </span>
        ),
        isExpanded: true,
        icon: icon,
      },
    ];
  }

  if (Array.isArray(obj)) {
    return [
      {
        id: key,
        label: (
          <span>
            <strong>{key}</strong> (Array[{obj.length}])
          </span>
        ),
        isExpanded: true,
        childNodes: obj.map((item, index) => convertToTreeNodes(item, `[${index}]`, false)).flat(),
        icon: "array",
      },
    ];
  }

  const childNodes = Object.entries(obj)
    .map(([childKey, value]) => convertToTreeNodes(value, childKey, false))
    .flat();

  // For root level, return the children directly without wrapping
  if (isRoot) {
    return childNodes;
  }

  return [
    {
      id: key,
      label: (
        <span>
          <strong>{key}</strong> (Object)
        </span>
      ),
      isExpanded: true,
      childNodes: childNodes,
      icon: "property",
    },
  ];
};

function Option2({ data }) {
  const [treeNodes, setTreeNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading delay
    const loadData = () => {
      setIsLoading(true);
      setTimeout(() => {
        if (data) {
          setTreeNodes(convertToTreeNodes(data, "root", true));
        }
        setIsLoading(false);
      }, 1500); // 1.5 second delay to show loading
    };

    loadData();
  }, [data]);

  if (!data) return <div className="content">No data available</div>;

  const handleNodeClick = (nodeData, _nodePath, e) => {
    const originallyExpanded = nodeData.isExpanded;
    if (!e.shiftKey) {
      setTreeNodes((prevNodes) => updateTreeNode(prevNodes, nodeData.id, { isExpanded: !originallyExpanded }));
    }
  };

  const handleNodeCollapse = (nodeData) => {
    // Keep the original icon, no need to change based on expand/collapse state
    setTreeNodes((prevNodes) =>
      updateTreeNode(prevNodes, nodeData.id, {
        isExpanded: false,
      })
    );
  };

  const handleNodeExpand = (nodeData) => {
    // Keep the original icon, no need to change based on expand/collapse state
    setTreeNodes((prevNodes) =>
      updateTreeNode(prevNodes, nodeData.id, {
        isExpanded: true,
      })
    );
  };

  // Helper function to update tree nodes recursively
  const updateTreeNode = (nodes, targetId, updates) => {
    return nodes.map((node) => {
      if (node.id === targetId) {
        return { ...node, ...updates };
      }
      if (node.childNodes) {
        return {
          ...node,
          childNodes: updateTreeNode(node.childNodes, targetId, updates),
        };
      }
      return node;
    });
  };

  // Helper function to collapse all nodes recursively
  const collapseAllNodes = (nodes) => {
    return nodes.map((node) => ({
      ...node,
      isExpanded: false,
      childNodes: node.childNodes ? collapseAllNodes(node.childNodes) : undefined,
    }));
  };

  const handleCollapseAll = () => {
    setTreeNodes((prevNodes) => collapseAllNodes(prevNodes));
  };

  if (isLoading) {
    return (
      <div className="content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading tree data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="option2-header">
        <div className="option2-title">Raw Data</div>
        <button className="collapse-all-btn" onClick={handleCollapseAll}>
          Collapse All
        </button>
      </div>
      <div className="option2-tree-container">
        <Tree contents={treeNodes} onNodeClick={handleNodeClick} onNodeCollapse={handleNodeCollapse} onNodeExpand={handleNodeExpand} />
      </div>
    </div>
  );
}

export default Option2;
