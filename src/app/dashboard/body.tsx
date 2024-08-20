import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth-context"; // Adjust the path as needed
import ProductCard from "@/components/product-card/product-card";
import SearchBar from "@/components/search-bar/search-bar";
import Preloader from "@/components/preloader/preloader";

interface Product {
  ProductMasterId: number;
  Name: string;
  Quantity: number;
  sizename: string;
  Description: string;
  Price: number;
  BrandName: string;
  ImageUrl: string[];
}

const Body: React.FC = () => {
  const { authState } = useAuth(); // Get the auth state
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (searchTerm = "") => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get("/api/products", {
        params: { search: searchTerm }
      });
      setProducts(response.data.products);
      setLoading(false); // Stop loading after data is fetched
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authState.isAuthenticated) {
      router.push("/login"); // Redirect to login if not authenticated
      return;
    }

    fetchProducts();
  }, [authState.isAuthenticated, router]);

  if (!authState.isAuthenticated) {
    return <div><Preloader/></div>; // You can show a loading state or redirect immediately
  }

  if (loading) {
    return <div><Preloader/></div>; // Loading state for fetching products
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state for fetching products
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="searchbar flex flex-col min-w-3/4 mb-6">
        <SearchBar onSearchResults={setProducts} /> 
      </div>
      <div className="flex  lg:flex-row">
        <div className="flex-1 px-2 lg:px-10 py-4">
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ">
            {products.map((product) => (
              <ProductCard key={product.ProductMasterId} product={product} />
            ))} 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;
