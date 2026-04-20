import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductDto } from './dto/product-query.dto';
import { Prisma } from '@prisma/client';
import { ProductData } from './dto/product-data.dto';

@Injectable()
export class ProductService {
    constructor(private readonly prisma:PrismaService){}

    async getAllProduct(productQuery : QueryProductDto){
        const {isActive, search, page = 1, limit = 10} = productQuery
        const where: Prisma.ProductWhereInput = {}

        if(isActive !== undefined){
            where.isActive = isActive
        }
        
        if(search){
            where.OR = [
                {
                    name: {contains:search,mode:'insensitive'}
                },
                {
                    description: {contains:search,mode:'insensitive'}
                }
            ]
        }

        const total = await this.prisma.product.count({where})

        const listProduct = await this.prisma.product.findMany({
            where,
            skip :(page-1)*limit,
            take: limit,
            orderBy: {createdAt: 'desc'},
        })

        return {
            totalPage : Math.ceil(total/limit),
            listProduct,
            page,
            limit,
            total
        }
    }

    async getProductById(id:string){
        const product = await this.prisma.product.findUnique({where:{id}})
        if(!product){
            throw new Error("Cannot find product")
        }
        return product
    }

    async createProduct(productData : ProductData){
        const {name,sku,...rest} = productData
        const productSlug = sku ?? name.toLowerCase().replace(/\s+/g,"-").replace(/[^\w-]/g,"")
        const checkExists = await this.prisma.product.findUnique({
            where:{sku :productSlug}
        })
        if(checkExists){
            throw new Error()
        }
        const newProduct = await this.prisma.product.create({
            data: {
                name,
                sku : productSlug,
                ...rest
            },
            include: {
                category: true
            }
        })
        return newProduct
    }

    async updateProductById(id:string, productData: ProductData){
        const productExits = await this.prisma.product.findUnique({where:{id}})

        if(!productExits){
            throw new Error("Product cannot find")
        }
        const updateProduct = await this.prisma.product.update({
            where: {id},
            data:{
                ...productData
            }
        })

        return updateProduct
    }

    async updateProductStock(id:string, stock: number){
        const productExits = await this.prisma.product.findUnique({where:{id}})

        if(!productExits){
            throw new Error("Product cannot find")
        }
        const updateProduct = await this.prisma.product.update({
            where: {id},
            data:{
                stock
            }
        })

        return updateProduct
    }

    async deleteProductById(id: string){
        await this.prisma.product.delete({where:{id}})
        return {message:"Delete product success"}
    }


    async deleteAllProduct(){
        await this.prisma.product.deleteMany()
        return {message:"Delete all product success"}
    }
}
