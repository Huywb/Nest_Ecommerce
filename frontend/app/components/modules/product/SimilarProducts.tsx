import { useProducts } from "@/app/hooks/useProducts";
import React, { useEffect } from "react";
import ProductCard from "../landing/ProductCard";

const SimilarProducts = ({
  category,
  productId,
}: {
  category: string;
  productId: string;
}) => {
  const { getProduct, products, isLoading, error } = useProducts();

  useEffect(() => {
    if (category) {
      getProduct({ search: category });
    }
  }, [category, getProduct]);

  const similarProduct = products
    .filter((product) => product.id !== productId)
    .slice(0, 4);
  console.log(products);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-gray-800 animate-pulse">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || similarProduct.length < 1) {
    return (
      <div className="flex min-h-[20vh] items-center justify-center flex-col ">
        <h2 className="font-bold text-xl">Product not have similar product</h2>
        <p className="text-gray-400">
          The product you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <section className=" py-10 bg-gray-100">
      <div className="max-w-300 mx-auto px-4 flex flex-col gap-4">
        <div className="mb-2">
          <h1 className="font-bold text-3xl mb-2">Similar Products </h1>
          <p className="text-gray-500">You might also like there products</p>
        </div>
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {similarProduct.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarProducts;
