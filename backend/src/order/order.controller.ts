import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { ModerateThrottle, RelaxedThrottle } from 'src/common/decorator/Custom-throttle.decorator';
import { GetUser } from 'src/common/decorator/GetUser.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from 'src/common/decorator/role.decorator';
import { SearchOrderDto } from './dto/search-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiTags("Order")
@ApiBearerAuth("JWT-auth")
@UseGuards(JwtGuard,RolesGuard)
@Controller('order')
export class OrderController {

    constructor(private readonly orderService : OrderService){}

    @Post()
    @ModerateThrottle()
    @ApiOperation({summary: "Create a new order"})
    @ApiResponse({
        status: 201,
        description: "Order created successfully"
    })

    async createOrder(@Body() createOrderData: CreateOrderDto,@GetUser('id') id : string){
        return this.orderService.createOrder(createOrderData,id)
    }

    @Get('admin/all')
    @Roles("ADMIN")
    @RelaxedThrottle()
    @ApiOperation({summary: "Get all orders"})
    @ApiResponse({
        status: 200,
        description: "Orders retrieved successfully"
    })
    async getAllOrders(@Query() query: SearchOrderDto){
        return this.orderService.getAllOrders(query)
    }

    @Get('admin')
    @Roles("ADMIN")
    @RelaxedThrottle()
    @ApiOperation({summary: "Get order by ID"})
    @ApiResponse({
        status: 200,
        description: "Orders retrieved successfully"
    })
    async getOrderAdmin(@Query() query: SearchOrderDto,@GetUser('id') id: string){
        return this.orderService.getMyOrders(query,id)
    }


    @Get('admin/:id')
    @Roles("ADMIN")
    @RelaxedThrottle()
    @ApiOperation({summary: "Get order by ID"})
    @ApiResponse({
        status: 200,
        description: "Orders retrieved successfully"
    })
    async getOrderById(@Param('id') id: string){
        return this.orderService.getOrderById(id)
    }

    @Get(':id')
    @RelaxedThrottle()
    @ApiOperation({summary: "Get order by ID"})
    @ApiResponse({
        status: 200,
        description: "Orders retrieved successfully"
    })
    async getOrderByUserId(@Param('id') id: string){
        return this.orderService.getOrderById(id)
    }

    @Patch('admin/:id')
    @Roles("ADMIN")
    @RelaxedThrottle()
    @ApiOperation({summary: "Update order by ID"})
    @ApiResponse({
        status: 200,
        description: "Order updated successfully"
    })
    async updateOrder(@Param('id') id: string, @Body() updateData: UpdateOrderDto){
        return this.orderService.updateOrder(id, updateData)
    }

    @Patch(':id')
    @RelaxedThrottle()
    @ApiOperation({summary: "Update order by ID"})
    @ApiResponse({
        status: 200,
        description: "Order updated successfully"
    })
    async updateOrderByUser(@Param('id') id: string, @Body() updateData: UpdateOrderDto,@GetUser('id') userId: string){
        return this.orderService.updateOrder(id, updateData, userId)
    }

    @Delete('admin/:id')
    @Roles("ADMIN")
    @RelaxedThrottle()
    @ApiOperation({summary: "Delete order by ID"})
    @ApiResponse({
        status: 200,
        description: "Order deleted successfully"
    })
    async cancelAdmin(@Param('id') id: string){
        return this.orderService.cancelAdmin(id)
    }

    @Delete(':id')
    @RelaxedThrottle()
    @ApiOperation({summary: "Delete order by ID"})
    @ApiResponse({
        status: 200,
        description: "Order deleted successfully"
    })
    async cancelOrder(@Param('id') id: string,@GetUser('id') userId : string){
        return this.orderService.cancelAdmin(id, userId)
    }

}
