import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";
import { useNavigate } from "react-router-dom";
import {
  Page,
  Layout,
  Card,
  Button,
  Select,
  TextField,
  Box,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCollections() {
      try {
        const response = await fetch("/api/collections");
        if (!response.ok) throw new Error("Failed to fetch collections");

        const data = await response.json();
        setCollections(data.collections);
        setFilteredCollections(data.collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    }

    fetchCollections();
  }, []);

  const handleAddFolder = () => {
    navigate("/app/create_folder");
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/collections", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Failed to delete collection");

      setCollections((prev) => prev.filter((collection) => collection.id !== id));
      setFilteredCollections((prev) => prev.filter((collection) => collection.id !== id));
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const getRandomCondition = () => {
    const conditions = ["New", "Used", "Refurbished", "Excellent", "Good"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Handle filtering logic
  useEffect(() => {
    let filtered = collections;

    if (searchTerm) {
      filtered = filtered.filter((collection) =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter) {
      filtered = filtered.filter((collection) =>
        collection.priority.toLowerCase() === priorityFilter.toLowerCase()
      );
    }

    setFilteredCollections(filtered);
  }, [searchTerm, priorityFilter, collections]);

  return (
    <Page fullWidth>
      <TitleBar title="Dashboard">
        <button variant="primary" onClick={handleAddFolder}>
          Add Folder
        </button>
      </TitleBar>
      <Layout>
        {/* Filters Section */}
        <Layout.Section>
          <Card sectioned>
            <Box padding="4">
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <TextField
                    label="Search by Name"
                    value={searchTerm}
                    onChange={setSearchTerm}
                    autoComplete="off"
                    placeholder="Enter collection name..."
                  />
                </div>
                <div style={{ width: "250px" }}>
                  <Select
                    label="Filter by Priority"
                    options={[
                      { label: "All", value: "" },
                      { label: "High", value: "high" },
                      { label: "Medium", value: "medium" },
                      { label: "Low", value: "low" },
                    ]}
                    value={priorityFilter}
                    onChange={setPriorityFilter}
                  />
                </div>
              </div>
            </Box>
          </Card>
        </Layout.Section>

        {/* Collections Table */}
        <Layout.Section>
          <Card>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f4f6f8" }}>
                    <th style={tableHeaderStyle}>Title</th>
                    <th style={tableHeaderStyle}>Priority</th>
                    <th style={tableHeaderStyle}>Total Products</th>
                    <th style={tableHeaderStyle}>Product Condition</th>
                    <th style={tableHeaderStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollections.map((collection) => (
                    <tr key={collection.id} 
                    style={tableRowStyle}       
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0f2ff")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <td style={tableCellStyle}>{collection.name}</td>
                      <td style={{ ...tableCellStyle, ...getPriorityStyle(collection.priority) }}>
                        {collection.priority}
                      </td>
                      <td style={tableCellStyle}>{collection.products.length}</td>
                      <td style={tableCellStyle}>{getRandomCondition()}</td>
                      <td style={tableCellStyle}>
                        <button
                          onClick={() => handleDelete(collection.id)}
                          style={deleteButtonStyle}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "10px", fontWeight: "bold", textAlign: "right" }}>
              Total collections: {filteredCollections.length}
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// Table styling
const tableHeaderStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #ddd",
  backgroundColor: "#f4f6f8",
  fontWeight: "bold",
};

const tableCellStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

const tableRowStyle = {
  borderBottom: "1px solid #ddd",
  transition: "background-color 0.3s",
  cursor: "pointer",
};

const deleteButtonStyle = {
  backgroundColor: "#d72c2c",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};


const getPriorityStyle = (priority) => {
  switch (priority.toLowerCase()) {
    case "high":
      return { color: "red", fontWeight: "bold" };
    case "medium":
      return { color: "orange", fontWeight: "bold" };
    case "low":
      return { color: "green", fontWeight: "bold" };
    default:
      return {};
  }
};
