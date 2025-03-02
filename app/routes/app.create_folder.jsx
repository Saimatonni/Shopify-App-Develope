import { useState, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  TextField,
  Button,
  Modal,
  ResourceList,
  ResourceItem,
  Thumbnail,
  Select,
} from "@shopify/polaris";
import { useFetcher } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { useNavigate } from "react-router-dom";

export default function CreateFolder() {
  const [folderName, setFolderName] = useState("");
  const [priority, setPriority] = useState("Medium"); // Default priority
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  console.log("sele",selectedProducts)

  const handleCreateFolder = async () => {
    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: folderName,
          priority,
          products: selectedProducts.map(({ id, title, image, images }) => ({
            id: String(id), 
            title,
            imageUrl: 
              image?.src || 
              (images?.length > 0 ? images[0].src : ""), 
          })),
        }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to create collection");
  
      console.log("Collection created successfully:", data.collection);
      navigate("/app"); 
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };
  

  const handleGoBack = () => {
    navigate("/app");
  };

  const toggleProductSelection = (product) => {
    const isSelected = selectedProducts.some((p) => p.id === product.id);
    if (isSelected) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  return (
    <Page fullWidth>
      <TitleBar title="Create Folder">
        <button onClick={handleGoBack}>Back</button>
      </TitleBar>
      <Layout>
        <Layout.Section>
          <Card title="Create a New Folder" sectioned>
            <FormLayout>
              {/* Folder Title Input */}
              <TextField
                label="Folder Title"
                value={folderName}
                onChange={(e) => setFolderName(e)}
                autoComplete="off"
              />

              {/* Priority Dropdown */}
              <Select
                label="Priority"
                options={[
                  { label: "High", value: "High" },
                  { label: "Medium", value: "Medium" },
                  { label: "Low", value: "Low" },
                ]}
                value={priority}
                onChange={(value) => setPriority(value)}
              />

              <h3>Search Products</h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <TextField
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e)}
                  autoComplete="off"
                  placeholder="Search for products..."
                />
                <Button primary onClick={() => setIsModalOpen(true)}>
                  Browse
                </Button>
              </div>

              {/* Selected Products Preview */}
              {selectedProducts.length > 0 && (
                <Card title="Selected Products" sectioned>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Image</th>
                        <th style={tableHeaderStyle}>Product Name</th>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedProducts.map((product) => (
                        <tr key={product.id} style={tableRowStyle}>
                          <td style={tableCellStyle}>
                            <Thumbnail
                              source={
                                product.images?.length > 0
                                  ? product.images[0].src
                                  : "https://via.placeholder.com/150"
                              }
                              alt={product.title}
                            />
                          </td>
                          <td style={tableCellStyle}>{product.title}</td>
                          <td style={tableCellStyle}>{product.id}</td>
                          <td style={tableCellStyle}>
                            <Button destructive size="slim" onClick={() => toggleProductSelection(product)}>
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}

              {/* Save Button */}
              <Button onClick={handleCreateFolder}>Save Collection</Button>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>

      {/* Product Selection Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Select Products"
          primaryAction={{
            content: "Done",
            onAction: () => setIsModalOpen(false),
          }}
          secondaryActions={[
            { content: "Cancel", onAction: () => setIsModalOpen(false) },
          ]}
        >
          <Modal.Section>
            <ResourceList
              resourceName={{ singular: "product", plural: "products" }}
              items={products}
              renderItem={(product) => {
                const { id, title, images } = product;
                const imageSrc =
                  images?.length > 0
                    ? images[0].src
                    : "https://via.placeholder.com/150";
                const isSelected = selectedProducts.some((p) => p.id === id);

                return (
                  <ResourceItem
                    key={id}
                    id={id}
                    media={<Thumbnail source={imageSrc} alt={title} />}
                    accessibilityLabel={`Select ${title}`}
                    onClick={() => toggleProductSelection(product)}
                  >
                    <h3
                      style={{
                        fontWeight: isSelected ? "bold" : "normal",
                        color: isSelected ? "green" : "black",
                      }}
                    >
                      {title}
                    </h3>
                    <p style={{ fontSize: "12px", margin: "0" }}>ID: {id}</p>
                  </ResourceItem>
                );
              }}
            />
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}

const tableHeaderStyle = { textAlign: "left", padding: "8px", borderBottom: "2px solid #ddd" };
const tableCellStyle = { padding: "8px", borderBottom: "1px solid #ddd" };
const tableRowStyle = { borderBottom: "1px solid #ddd" };
