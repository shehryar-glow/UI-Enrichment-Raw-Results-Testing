import "../css/Option3.css";
import { Tree, Text, Badge, MantineProvider, Box, Loader, Center } from "@mantine/core";
import "@mantine/core/styles.css";
import { useState, useEffect } from "react";

const getTypeInfo = (value) => {
  if (value === null) return { color: "gray", label: "null", symbol: "∅" };
  if (typeof value === "boolean")
    return {
      color: value ? "green" : "red",
      label: "boolean",
      symbol: value ? "✓" : "✗",
    };
  if (typeof value === "string") return { color: "teal", label: "string", symbol: '""' };
  if (typeof value === "number") return { color: "orange", label: "number", symbol: "#" };
  if (Array.isArray(value)) return { color: "violet", label: `array[${value.length}]`, symbol: "[]" };
  if (typeof value === "object") return { color: "cyan", label: "object", symbol: "{}" };
  return { color: "gray", label: "unknown", symbol: "?" };
};

const convertToTreeNodes = (obj, key = "root") => {
  if (typeof obj !== "object" || obj === null) {
    const typeInfo = getTypeInfo(obj);
    return [
      {
        value: key,
        label: (
          <Box style={{ display: "flex", alignItems: "start", gap: "8px", padding: "4px 0" }}>
            <Text size="sm" c={typeInfo.color} fw={700}>
              {typeInfo.symbol}
            </Text>
            <Text fw={600} size="sm" c="dark.7">
              {key}:
            </Text>
            <Text c={typeInfo.color} fw={500} size="sm">
              {typeof obj === "string" ? `"${obj}"` : JSON.stringify(obj)}
            </Text>
            <Badge size="xs" color={typeInfo.color} variant="dot" radius="sm">
              {typeInfo.label}
            </Badge>
          </Box>
        ),
      },
    ];
  }

  if (Array.isArray(obj)) {
    const typeInfo = getTypeInfo(obj);
    return [
      {
        value: key,
        label: (
          <Box style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
            <Text size="sm" c={typeInfo.color} fw={700}>
              {typeInfo.symbol}
            </Text>
            <Text fw={600} size="sm" c="dark.7">
              {key}
            </Text>
            <Badge size="xs" color="violet" variant="filled" radius="sm">
              {obj.length} items
            </Badge>
          </Box>
        ),
        children: obj.map((item, index) => convertToTreeNodes(item, `[${index}]`)).flat(),
      },
    ];
  }

  const children = Object.entries(obj)
    .map(([childKey, value]) => convertToTreeNodes(value, childKey))
    .flat();

  const typeInfo = getTypeInfo(obj);
  return [
    {
      value: key,
      label: (
        <Box style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
          <Text size="sm" c={typeInfo.color} fw={700}>
            {typeInfo.symbol}
          </Text>
          <Text fw={600} size="sm" c="dark.7">
            {key}
          </Text>
          <Badge size="xs" color="cyan" variant="filled" radius="sm">
            {children.length} properties
          </Badge>
        </Box>
      ),
      children: children,
    },
  ];
};

function Option3({ data }) {
  const [treeData, setTreeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      // Simulate loading time for rendering
      setTimeout(() => {
        setTreeData(convertToTreeNodes(data, "root"));
        setIsLoading(false);
      }, 800);
    }
  }, [data]);

  // Helper function to update tree node state
  const updateTreeNode = (nodes, targetId, updates) => {
    return nodes.map((node) => {
      if (node.value === targetId) {
        return { ...node, ...updates };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeNode(node.children, targetId, updates),
        };
      }
      return node;
    });
  };

  const handleNodeExpand = (nodeData) => {
    setTreeData((prevNodes) => updateTreeNode(prevNodes, nodeData.value, { isExpanded: true }));
  };

  const handleNodeCollapse = (nodeData) => {
    setTreeData((prevNodes) => updateTreeNode(prevNodes, nodeData.value, { isExpanded: false }));
  };

  if (!data) return <div className="content">No data available</div>;

  if (isLoading) {
    return (
      <MantineProvider>
        <div className="content">
          <Center style={{ padding: "60px" }}>
            <Box style={{ textAlign: "center" }}>
              <Loader size="md" />
              <Text size="sm" c="gray.6" mt="md">
                Loading JSON data...
              </Text>
            </Box>
          </Center>
        </div>
      </MantineProvider>
    );
  }

  return (
    <MantineProvider>
      <div className="content">
        <div className="option3-title">Raw Data</div>
        <div className="option3-tree-container">
          <Tree data={treeData} onNodeExpand={handleNodeExpand} onNodeCollapse={handleNodeCollapse} />
        </div>
      </div>
    </MantineProvider>
  );
}

export default Option3;
