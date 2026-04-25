import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  Order,
  OrderItem,
  OrderStatus,
  Prisma,
  Product,
  User,
} from '@prisma/client';
import { SearchOrderDto } from './dto/search-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  OrderApiResponseDto,
  OrderResponseDto,
} from './dto/response-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const { items, shippingAddress } = createOrderDto;
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
    }
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const latestCart = await this.prisma.cart.findFirst({
      where: { userId: id, checkedOut: false },
      orderBy: { createdAt: 'desc' },
    });

    const order = await this.prisma.$transaction(async (ctx) => {
      const newOrder = await ctx.order.create({
        data: {
          userId: id,
          status: OrderStatus.PENDING,
          totalAmount: totalPrice,
          shippingAddress,
          cartId: latestCart ? latestCart.id : undefined,
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });

      for (const item of items) {
        await ctx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return newOrder;
    });

    return this.wrap(order);
  }

  async getAllOrders(query: SearchOrderDto): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = query;
    let where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        {
          id: { contains: search, mode: 'insensitive' },
        },
        {
          orderNumber: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      }),

      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.map(order)),
      total,
      page,
      limit,
    };
  }

  async getMyOrders(
    query: SearchOrderDto,
    id: string,
  ): Promise<{
    data: OrderResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, status, search } = query;
    let where: Prisma.OrderWhereInput = {
      userId: id,
    };
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        {
          id: { contains: search, mode: 'insensitive' },
        },
        {
          orderNumber: { contains: search, mode: 'insensitive' },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      }),

      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders.map((order) => this.map(order)),
      total,
      page,
      limit,
    };
  }

  async getOrderById(
    id: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return this.wrap(order);
  }

  async updateOrder(
    id: string,
    updateData: UpdateOrderDto,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: Prisma.OrderWhereInput = { id };
    if (userId) {
      where.userId = userId;
    }
    const existing = await this.prisma.order.findFirst({
      where,
    });
    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    return this.wrap(updated);
  }

  async cancelAdmin(
    id: string,
    userId?: string,
  ): Promise<OrderApiResponseDto<OrderResponseDto>> {
    const where: Prisma.OrderWhereInput = { id };
    if (userId) {
      where.userId = userId;
    }

    const order = await this.prisma.order.findFirst({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    const cancelled = await this.prisma.$transaction(async (ctx) => {
      for (const item of order.orderItems) {
        await ctx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return ctx.order.update({
        where: { id },
        data: { status: OrderStatus.CANCELLED },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
    });

    return this.wrap(cancelled);
  }

  private wrap(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderApiResponseDto<OrderResponseDto> {
    return {
      success: true,
      message: 'Order retreived successfully',
      data: this.map(order),
    };
  }

  private map(
    order: Order & {
      orderItems: (OrderItem & { product: Product })[];
      user: User;
    },
  ): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      total: Number(order.totalAmount),
      shippingAddress: order.shippingAddress ?? '',
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        price: Number(item.price),
        subtotal: Number(item.price) * item.quantity,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      ...(order.user && {
        userEmail: order.user.email,
        userName:
          `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim(),
      }),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
