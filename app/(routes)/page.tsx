"use client"

import { useEffect, useState } from "react";
import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";
import { Product, Billboard as BillboardType } from "@/types"; // Import the actual types

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [billboard, setBillboard] = useState<BillboardType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts({ isFeatured: true });
        const billboardData = await getBillboard("0e12e5cf-29ab-4529-b8d5-c5371dae1f7b");

        setProducts(productsData);
        setBillboard(billboardData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means the effect runs once on mount

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
