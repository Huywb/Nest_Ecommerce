'use client'
import React, { useEffect } from 'react'
import Breadcrumbs from './Breadcrumbs'
import { useProducts } from '@/app/hooks/useProducts'
import ProductDetails from './ProductDetails'
import SimilarProducts from './SimilarProducts'

const ProductDetailClient = ({productId}: {productId: string}) => {

    const {productById,getProductById,isLoading,error} = useProducts()

    useEffect(()=>{
        if (productId){
        getProductById(productId)            
        }
    },[productId,getProductById])

    if(isLoading) {
      return (
        <div className='flex min-h-[60vh] items-center justify-center text-gray-800 animate-pulse'>
              <p>Loading product details...</p>
        </div>
      )
    }

    if(error || !productById){
      return (
        <div className='flex min-h-[20vh] items-center justify-center flex-col '>
          <h2 className='font-bold text-xl'>Product not found</h2>
          <p className='text-gray-400'>The product you are looking for does not exist.</p>
        </div>
      ) 
    }

  return (
    <div>
      <Breadcrumbs ProductName={productById?.name || ''}/>
      <ProductDetails product={productById} />
      <SimilarProducts category={productById.name} productId={productById.id}/>
    </div>
  )
}

export default ProductDetailClient
