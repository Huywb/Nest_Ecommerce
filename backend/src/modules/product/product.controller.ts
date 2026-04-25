import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';
import { RolesGuard } from 'src/modules/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { QueryProductDto } from './dto/product-query.dto';
import { ProductData } from './dto/product-data.dto';
import type {Request} from 'express'
import { ProductResponseDto } from './dto/product-response.dto';

@ApiTags('Products')
@Controller('product')
export class ProductController {
    constructor(private readonly productService:ProductService){}

    @Get()
    @ApiOperation({
        summary: "Get All product"
    })
    @ApiResponse({
        status:200,
        description:'Get all product success',
    })
    async getAllProduct(@Query() productQuery: QueryProductDto){
        return this.productService.getAllProduct(productQuery)
    }


    @Get(':id')
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Get product by id"
    })
    @ApiResponse({
        status:200,
        description:'Get product by id success',
    })
    async getProductById(@Param('id') id :string): Promise<ProductResponseDto>{
        return this.productService.getProductById(id)
    }

    @Post()
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Create product"
    })
    @ApiResponse({
        status:200,
        description:'Create product success',
    })
    async createProduct(@Body() productData: ProductData): Promise<ProductResponseDto>{
        return this.productService.createProduct(productData)
    }


    @Patch(':id')
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Update product"
    })
    @ApiResponse({
        status:200,
        description:'Update product success',
    })
    async updateProductById(@Param('id') id :string, @Body() productData : ProductData): Promise<ProductResponseDto>{
        return this.productService.updateProductById(id,productData)
    }

    @Patch(':id/stock')
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Update product stock"
    })
    @ApiResponse({
        status:200,
        description:'Update product stock success',
    })
    async updateProductStock(@Param('id') id:string,@Body('stock')  stock: number): Promise<ProductResponseDto>{
        return this.productService.updateProductStock(id,stock)
    }

    @Delete(':id')
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Delete product by id"
    })
    @ApiResponse({
        status:200,
        description:'Delete product by id success',
    })
    async deleteProductById(@Param('id') id: string): Promise<{ message: string }>{
        return this.productService.deleteProductById(id)
    }

    @Delete('')
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: "Delete all product"
    })
    @ApiResponse({
        status:200,
        description:'Delete all product success',
    })
    async deleteAllProduct(): Promise<{ message: string }>{
        return this.productService.deleteAllProduct()
    }

}
