import Footer from '@/app/components/modules/landing/Footer'
import Header from '@/app/components/modules/landing/Header'
import ProductDetailClient from '@/app/components/modules/product/ProductDetailClient'
import React from 'react'

export const revalidate = false

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) { 
  const { id } = await params

  console.log(id)
  return (
    <>
      <Header />
      <ProductDetailClient productId={id} />
      <Footer />
    </>
  )
}

export function generateMetadata() {
  return {
    title: `Page - Title here`,
    description: "Page - Description here",
    icons: {
      icon: 'path to asset file'
    }
  }
}