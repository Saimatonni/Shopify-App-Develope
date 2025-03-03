# Shopify Collections App

This is a Shopify app built using **Remix.js**, **Polaris**, **Prisma**, and **MySQL**. The app allows Shopify merchants to organize products into custom collections by creating, viewing, and editing collections with priority levels and associated products.

## Features

- Create, view, and delete collections
- Assign priority levels (High, Medium, Low) to collections
- Search and filter collections
- Browse and select products for collections

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (>= 18.x)
- **npm** or **yarn**
- **MySQL**
- **Shopify Partner Account**
- **Shopify Store (Development Store recommended)**

## Installation

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/shopify-collections-app.git
cd shopify-collections-app
```

### 2. Install dependencies

```sh
npm install  # or yarn install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add your Shopify and database credentials:

```sh
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret
SCOPES=read_products,write_products
SHOP=yourshop.myshopify.com
DATABASE_URL=mysql://user:password@localhost:3306/dbname
```

### 4. Set up the database

Run Prisma migrations to create the necessary tables:

```sh
npx prisma migrate dev --name init
```

### 5. Start the development server

```sh
shopify run dev  
```

## Running the App in Shopify

1. Open the **Shopify Partner Dashboard**.
2. Create a new Shopify app (or use an existing one).
3. Set the **App URL** to `https://your-app-url.com`.
4. Install the app on your development store.

## Deployment

To deploy, you can use **Vercel**, **Railway**, or **Heroku**. Make sure to:

- Set up your **environment variables** in the hosting platform.
- Run database migrations (`npx prisma migrate deploy`).
- Use `npm run build && npm start` for production.

## Demo

### Here is the demo link : https://drive.google.com/file/d/1SyfIeoaCXLBVrgp1zEMFM0Z-t-tTYJii/view?usp=drive_link

### Creating a Collection

1. Click on **Add Folder**.
2. Enter a **Title** and select **Priority**.
3. Search or browse products and add them to the collection.
4. Click **Save**.

### Managing Collections

- **Search** for collections using the search bar.
- **Filter** collections by priority.
- **Delete** collections using the red delete button.


