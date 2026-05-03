import { Product } from '@/app/types/product.type'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ProductProps{
    product: Product
}

const ProductCard:React.FC<ProductProps> = ({product}) => {
    const id = product.id
    console.log(id)
  return (
    <Link href={`/${id}`} className='shadow-md hover:shadow-xl rounded-md flex flex-col gap-2 border border-gray-300 transition duration-300 hover:-translate-y-2'>

        <div className='relative w-full aspect-auto overflow-hidden'>
            <Image
            className='rounded-t-md w-full h-full object-cover'
            width={400}
            height={400}
            loading='lazy' 
            src={product.imageUrl?.trimEnd() ? "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvZXN8ZW58MHx8MHx8fDA%3D" : ''} alt="product image" />
        </div>

        <div className='px-4 py-2 flex  flex-col gap-2 '>
            <span className='text-gray-500 text-md font-bold '>{product.category}</span>
            <h3 className='font-bold text-xl'>{product.name}</h3>
            <p className='min-h-15 text-gray-500'>{product.description}</p>
            <div className='m-2 flex justify-between items-center'>
                <span className='font-bold text-xl'>$ {product.price.toFixed(2)}</span>
                <span className={`${product.stock < 0 ? 'text-red-500' : 'text-green-500'} font-semibold`}>{product.stock > 0 ? product.stock + ' In Stock' : 'Out of Stock'}</span>
            </div>
        </div>
    </Link>
  )
}

export default ProductCard
