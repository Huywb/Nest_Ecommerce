import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/queyCategory.dto';
import { CategoryResponseDto } from './dto/response-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(
    createDataCategory: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = createDataCategory;

    const categorySlug =
      slug ??
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    const checkExists = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (checkExists) {
      throw new Error();
    }
    const newCategory = await this.prisma.category.create({
      data: {
        name,
        slug: categorySlug,
        ...rest,
      },
    });

    return this.formatCategory(newCategory, 0);
  }

  async getCategoryById(CategoryId: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: CategoryId },
    });
    if (!category) {
      throw new Error('Category is empty');
    }
    return this.formatCategory(category, 0);
  }

  async getCategoryBySlug(slug: string): Promise<CategoryResponseDto> {
    const slugCategory = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!slugCategory) {
      throw new Error('Get category by slug Empty');
    }
    return this.formatCategory(slugCategory, 0);
  }

  async updateCategoryById(
    CategoryId: string,
    DataCategory: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = DataCategory;

    const categorySlug =
      slug ??
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');
    const checkExists = await this.prisma.category.findUnique({
      where: { id: CategoryId, slug: categorySlug },
    });
    if (!checkExists) {
      throw new Error();
    }
    const updateCategory = await this.prisma.category.update({
      where: { id: CategoryId },
      data: {
        name,
        slug,
        ...rest,
      },
    });

    return this.formatCategory(updateCategory, 0);
  }

  async deleteCategoryById(CategoryId: string) {
    await this.prisma.category.delete({ where: { id: CategoryId } });
    return { message: 'Delete Category by Id success' };
  }

  async deleteAllCategory() {
    await this.prisma.category.deleteMany();
    return { message: 'Delete All Category success' };
  }

  async getAllCategory(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const { isActive, search, page = 1, limit = 10 } = queryDto;
    const where: Prisma.CategoryWhereInput = {};
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

    const total = await this.prisma.category.count({ where });

    const categories = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      data: categories.map((category) =>
        this.formatCategory(category, category._count.products),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private formatCategory(
    category: Category,
    productCount: number,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
      productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
