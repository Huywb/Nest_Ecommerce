"use client";
import { useCart } from "@/app/hooks/useCart";
import React from "react";
import CartItem from "./CartItem";
import Link from "next/link";
import { ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

const CartClient = () => {
  const { items,cart,clearCart } = useCart();

    const {isAuthenticated} = useAuth()
    const router = useRouter()

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear all product?")) {
      await clearCart();
    }
  };
  
  const handleCheckout = ()=>{
    if(!isAuthenticated){
      router.push('/auth/login?redirect=/cart')
    }else{
      router.push('/checkout')
    }
  }

  if (items.length < 1) {
    return (
      <div className="max-w-300 mx-auto w-full mt-10">
        <div className="w-full flex items-center justify-center min-h-60">
          <div className="flex flex-col gap-4 bg-white w-[70%] mx-auto items-center rounded-md p-6">
            <Link href={'/'}>
              <ShoppingCartIcon className=' hover:-translate-y-2 hover:-rotate-12 transition-all duration-300' size={60}/>
            </Link>
            <div>

            <h1 className="font-semibold text-2xl">Your cart is empty</h1>
            <span className="text-gray-500">Add some products to get started</span>
            </div>

            <Link href={"/"}  className="cursor-pointer bg-black text-white hover:bg-gray-900 transition-all duration-300 p-2 px-4 rounded-md">Contunue shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-300 mx-auto w-full  ">
      <div className="flex justify-between gap-4 p-4 items-center">
        <h1 className="font-bold text-2xl">Shopping Cart</h1>
        <button
          onClick={handleClearCart}
          className="text-red-800 border-red-800 border py-1 px-2 rounded-md hover:text-red-600 hover:border-red-600 transition-all duration-300 cursor-pointer"
        >
          Clear Cart
        </button>
      </div>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="md:flex-2 bg-white p-4 mx-4 flex flex-col h-fit gap-4 border-gray-600 rounded-md">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        <div className="md:flex-1 bg-white p-4 mx-4 flex flex-col gap-4 border-gray-600 rounded-md">
          <h1 className="font-bold text-2xl">Order Sumary</h1>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <p className="text-gray-800 font-medium">${cart.totalPrice.toFixed(2)}</p>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <p className="text-gray-800 font-medium">Caculate at Checkout</p>
            </div>
          </div>
          <span className="bg-gray-300 h-[0.5]" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <p>${cart.totalPrice.toFixed(2)}</p>
          </div>
          <button onClick={handleCheckout} className="cursor-pointer bg-black text-white hover:bg-gray-900 transition-all duration-300 p-2 rounded-md">
            Proceed to Checkout
          </button>
          <Link
            href={"/"}
            className="text-gray-400 hover:text-gray-700 duration-300 transition-all underline text-sm text-center"
          >
            {" "}
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CartClient;
