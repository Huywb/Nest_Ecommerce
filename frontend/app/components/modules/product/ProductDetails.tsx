import { useCart } from "@/app/hooks/useCart";
import { Product } from "@/app/types/product.type";
import Image from "next/image";
import React, { useState } from "react";

const ProductDetails = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const {addProductToCart,cart} = useCart()

  console.log(cart)
  const handleDecreseQuantity = () => {
    if(quantity <= 1) {
        setQuantity(1)
    }else{
        setQuantity(prev=>  prev-1)
    }
  };
  const handleIncreseQuantity = () => {
    if(quantity >= product.stock){
        setQuantity(product.stock)
    }else {
        setQuantity(prev=>prev+1)
    }
  };
  const handleAddToCart = () => {
    if(product.stock > 0) {
        addProductToCart({
            ...product,
            quantity
        })
        console.log({
            ...product,
            quantity
        })
        setQuantity(1)
        alert('Added' + quantity + ' ' + product.name + 'to cart success')
    }
  };
  return (
    <section className="min-h-[75vh] max-w-300 mx-auto mb-10 gap-10 mt-4 grid grid-cols-1 md:grid-cols-2 md:gap-4 p-4 ">
      <div className="w-[95%]">
        <Image
          className="rounded-md w-full h-full object-cover aspect-auto "
          width={400}
          height={400}
          loading="lazy"
          src={
            product.imageUrl?.trimEnd()
              ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D"
              : ""
          }
          alt={product.name}
        />
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-gray-600 text-base">{product.category}</h3>
        <h1 className="font-bold text-3xl">{product.name}</h1>
        <span className="text-3xl font-bold">{product.price}</span>
        <span
          className={`text-base font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
        >
          {product.stock > 0
            ? product.stock + " available in stock"
            : "out of stock"}
        </span>
        <span className="h-[0.5] bg-gray-300" />
        <p className="text-gray-600">{product.description}</p>
        <span className="h-[0.5] bg-gray-300" />
        <div className="flex gap-6 font-bold items-center">
          <button
            onClick={handleDecreseQuantity}
            className={`${quantity == 1 ? "cursor-not-allowed opacity-40 " : "cursor-pointer"} border border-gray-800 px-3 py-1   duration-300 transition-all`}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={handleIncreseQuantity}
            className={`${quantity >= product.stock ? "cursor-not-allowed opacity-40" : "cursor-pointer"} border border-gray-800 px-3 py-1  duration-300 transition-all`}
          >
            +
          </button>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-gray-800 text-white p-3 rounded-md font-bold hover:bg-gray-900 hover:text-amber-100 duration-300 cursor-pointer"
        >
          Add to Cart
        </button>
        <span className="text-gray-600 text-base">{product.sku}</span>
      </div>
    </section>
  );
};

export default ProductDetails;
