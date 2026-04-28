"use client";
import { useProducts } from "@/app/hooks/useProducts";
import React, { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { isLoading, products, getProduct, error, meta } = useProducts();
  const limit = 12;

  useEffect(() => {
    getProduct({ page, limit, search: debouncedSearch });
  }, [getProduct, page, limit, debouncedSearch]);


  const handlePreviousPage = ()=>{
    if(page>1){
      setPage(page-1)

    }
  }

  const handleNextPage = ()=>{
    if(meta && page < meta.totalPages){
    setPage(page + 1)

    }
  }


  const handleChangeSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);

      setPage(1);

      setTimeout(() => {
        setDebouncedSearch(value);
      }, 500);
    },
    [],
  );
  return (
    <section className="w-full py-12 px-8 min-h-[60vh]">
      <div className="max-w-300 mx-auto">
        <div className="mb-4">
          <h2 className="text-3xl font-bold">Our products</h2>
          <p className="text-base text-gray-500">
            Discover our created collection of premium products
          </p>
        </div>
        <div className="mb-4">
          <input
            className="w-full max-w-125 outline-none p-2 border rounded-md border-gray-400  "
            type="text"
            placeholder="Search product"
            value={search}
            onChange={handleChangeSearch}
          />
        </div>

        {isLoading ? (
          <div className="text-gray-500 flex items-center justify-center min-h-40">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="text-gray-500 flex items-center justify-center min-h-40">
            {debouncedSearch
              ? `No product found for ${debouncedSearch}`
              : "No product available"}
          </div>
        ) : (
          <>
            <div className="mb-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

              {
                meta && meta.totalPages > 0 && (
                  <div className="flex items-center justify-center gap-4">
                      <button className={`${page == 1 ? 'cursor-not-allowed opacity-50': 'cursor-pointer'} border border-gray-300 p-1`} onClick={handlePreviousPage} disabled={page < 1}>Previous</button>
                      <span className="text-gray-500">Page {page} of {meta.totalPages}</span>
                      <button className={`${page == meta.totalPages ? 'cursor-not-allowed opacity-50': 'cursor-pointer'} border border-gray-300 p-1`} onClick={handleNextPage} disabled={page >= meta.totalPages} >Next</button>
                  </div>
                )
              }
          </>
        )}
      </div>
    </section>
  );
};

export default ProductList;
