import { json } from "@remix-run/node";
import { prisma } from "../prisma.server";

// ✅ Loader for handling GET requests
export const loader = async () => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        products: true,
      },
    });

    return json({ success: true, collections }, { status: 200 });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};

// ✅ Action for handling POST & DELETE requests
export const action = async ({ request }) => {
  if (request.method === "POST") {
    return createCollection(request);
  } else if (request.method === "DELETE") {
    return deleteCollection(request);
  } else {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
};

// ✅ Create a new collection
async function createCollection(request) {
  try {
    const { name, priority, products } = await request.json();

    if (!name || !priority || !products || !Array.isArray(products)) {
      return json({ error: "Invalid input data" }, { status: 400 });
    }

    const newCollection = await prisma.collection.create({
      data: {
        name,
        priority,
        products: {
          connect: await Promise.all(
            products.map(async (product) => {
              const existingProduct = await prisma.product.findUnique({
                where: { id: product.id },
              });

              if (!existingProduct) {
                await prisma.product.create({
                  data: {
                    id: product.id,
                    title: product.title,
                    imageUrl: product.imageUrl || "",
                  },
                });
              }

              return { id: product.id };
            })
          ),
        },
      },
      include: {
        products: true,
      },
    });

    return json({ success: true, collection: newCollection }, { status: 201 });
  } catch (error) {
    console.error("Error creating collection:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}

// ✅ Delete a collection along with its products
async function deleteCollection(request) {
  try {
    const { id } = await request.json(); 

    if (!id) {
      return json({ error: "Collection ID is required" }, { status: 400 });
    }

    const existingCollection = await prisma.collection.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!existingCollection) {
      return json({ error: "Collection not found" }, { status: 404 });
    }

    await prisma.collection.delete({
      where: { id },
    });

    return json({ success: true, message: "Collection deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting collection:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
}
