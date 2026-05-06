import { useAuth } from "@/app/hooks/useAuth";
import { useCart } from "@/app/hooks/useCart";
import { CartItem as Cartitem, CartItemType } from "@/app/types/cart.type";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CartItemProps{
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {

  const {product,quantity} = item
  const {increaseProductQuantity,decreaseProductQuantity,removeProductFromCart} = useCart()
  const handleInCreaseQuantity = async (productId: string)=>{
    if(quantity < product.stock){
      await increaseProductQuantity(productId)
    } else {
      alert(`Only ${product.stock} in stock`)
    }
  }

  const handleDecreaseQuantity = async (productId: string)=>{
    await decreaseProductQuantity(productId)
  }

  const handleRemoveProduct = async (productId: string)=>{
    if(window.confirm('Are you sure you want to delete this product?')){
      await removeProductFromCart(productId)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 m-4 sm:m-0">
      <Link href={product.id}>
      <Image
        src={product.imageUrl?.trimEnd() ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D" : ''}
        alt={product.imageUrl?.trimEnd() ?? product.name}
        width={120}
        height={120}
        loading="lazy"
        className=" rounded-md object-cover min-h-30 aspect-auto"
      />
      </Link>
      <div className="flex flex-col gap-1 sm:flex-1">
        <h1 className="font-bold">{product.name}</h1>
        <span className="text-gray-500">{product.description}</span>
        <p className="font-bold text-lg">${product.price}</p>
      </div>
      <div className="flex gap-2 justify-between sm:justify-evenly sm:gap-0 sm:flex-col ">
        <div className="flex gap-4 items-center ">
          <button onClick={()=>handleDecreaseQuantity(product.id)} className={` text-xs ${quantity < 1 ? 'cursor-not-allowed' :' cursor-pointer'} border p-1 px-2`}>-</button>
          <span>{quantity}</span>
          <button onClick={()=>handleInCreaseQuantity(product.id)} className=" text-xs border p-1 px-2 cursor-pointer">+</button>
        </div>
        <div className="flex gap-4 items-center sm:flex-col sm:gap-2">
          <span className="font-bold text-md">$ {(quantity * product.price).toFixed(2)}</span>
          <Trash2 onClick={()=>handleRemoveProduct(product.id)} size={25} className="border  p-1 text-red-400 border-red-400 hover:text-red-700 hover:border-red-700 transition-all duration-300 cursor-pointer"/>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
