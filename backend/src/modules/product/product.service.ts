import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryProductDto } from './dto/product-query.dto';
import { Category, Prisma, Product } from '@prisma/client';
import { ProductData } from './dto/product-data.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllProduct(productQuery: QueryProductDto): Promise<{
    data: ProductResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { isActive, search, page = 1, limit = 10 } = productQuery;
    const where: Prisma.ProductWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        {
          name: { contains: search, mode: 'insensitive' },
        },
        {
          description: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.product.count({ where });

    const listProduct = await this.prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return {
      data: listProduct.map((product) => this.formatProduct(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id: string): Promise<ProductResponseDto> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new Error('Cannot find product');
    }
    return this.formatProduct(product);
  }

  async createProduct(productData: ProductData): Promise<ProductResponseDto> {
    const { name, sku, ...rest } = productData;
    const productSlug =
      sku ??
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    const checkExists = await this.prisma.product.findUnique({
      where: { sku: productSlug },
    });
    if (checkExists) {
      throw new Error();
    }
    const newProduct = await this.prisma.product.create({
      data: {
        name,
        sku: productSlug,
        ...rest,
      },
      include: {
        category: true,
      },
    });
    return this.formatProduct(newProduct);
  }

  async updateProductById(
    id: string,
    productData: ProductData,
  ): Promise<ProductResponseDto> {
    const productExits = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExits) {
      throw new Error('Product cannot find');
    }
    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(updateProduct);
  }

  async updateProductStock(id: string, stock: number) {
    const productExits = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productExits) {
      throw new Error('Product cannot find');
    }
    const updateProduct = await this.prisma.product.update({
      where: { id },
      data: {
        stock,
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(updateProduct);
  }

  async deleteProductById(id: string) {
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Delete product success' };
  }

  async deleteAllProduct() {
    await this.prisma.product.deleteMany();
    return { message: 'Delete all product success' };
  }

  private formatProduct(
    product: Product & { category: Category },
  ): ProductResponseDto {
    return {
      ...product,
      price: Number(product.price),
      category: product.category.name,
    };
  }
}
