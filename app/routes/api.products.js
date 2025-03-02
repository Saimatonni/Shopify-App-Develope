import { json } from "@remix-run/node";
import { authenticate, sessionStorage } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);

  if (!session) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const shop = session.shop;
  const accessToken = session.accessToken; 

  const url = `https://${shop}/admin/api/2025-01/products.json`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": accessToken, 
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }

    const data = await response.json();
    return json(data);
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};
