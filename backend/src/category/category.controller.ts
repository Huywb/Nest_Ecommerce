import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/role.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryCategoryDto } from './dto/queyCategory.dto';


@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService:CategoryService){}


    @Post()
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary:"Create Category"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async createCategory(@Body() createDataCategory : CreateCategoryDto){
        return this.categoryService.createCategory(createDataCategory)
    }

    @Get()
    @ApiOperation({summary:"Get All Category"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async getAllCategory(@Query() queryData  : QueryCategoryDto){
        return this.categoryService.getAllCategory(queryData)
    }

    @Get(":id")
    @ApiOperation({summary:"Get Category By Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async getCategoryById(@Param('id') id : string){
        return this.categoryService.getCategoryById(id)
    }

    @Get("slug/:slug")
    @ApiOperation({summary:"Get Category By slug"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async getCategoryBySlug(@Param('slug') slug : string){
        return this.categoryService.getCategoryBySlug(slug)
    }

    @Patch(':id')
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({summary:"Update Category By Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async updateCategoryById(@Param('id') id : string,@Body() DataCategory : CreateCategoryDto){
        return this.categoryService.updateCategoryById(id,DataCategory)
    }

    @Delete(":id")
    @UseGuards(JwtGuard,RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({summary:"Delete Category By Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async deleteCategoryById(@Param('id') id : string){
        return this.categoryService.deleteCategoryById(id)
    }

    @Delete("all")
    @ApiOperation({summary:"Delete Category By Id"})
    @ApiResponse({
        status:200,
        description:'Get user success',
    })
    async deleteAllCategory(){
        return this.categoryService.deleteAllCategory()
    }


}
