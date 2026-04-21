import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Prisma } from '@prisma/client';
import { SearchOrderDto } from './dto/search-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto, id: string) {
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

    return order
  }

  async getAllOrders(query : SearchOrderDto){
    const { page = 1, limit = 10, status ,search } = query;
    let where : Prisma.OrderWhereInput = {};
    
    if(status){
        where.status = status
    }
    
    if(search){
        where.OR = [
            {
                id: {contains: search,mode : "insensitive"}
            },
            {
                orderNumber: {contains: search,mode : "insensitive"}
            }
        ]
    }

    const [orders,total] = await Promise.all([
        this.prisma.order.findMany({
            where,
            skip: (page-1) * limit,
            take: limit,
            orderBy: {createdAt: 'desc'},
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select:{
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
        }),

        this.prisma.order.count({where})
    ])

    return {
        orders,
        total,
        page,
        limit
    }
    }

    async getMyOrders(query : SearchOrderDto, id : string){
        const { page = 1, limit = 10, status ,search } = query;
        let where : Prisma.OrderWhereInput = {
            userId: id
        };
        if(status){
            where.status = status
        }
        if(search){
            where.OR =[
                {
                    id: {contains: search,mode : "insensitive"}
                },
                {
                    orderNumber: {contains: search,mode : "insensitive"}
                }
            ]
        }

        const [orders,total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip: (page-1) * limit,
                take: limit,
                orderBy: {createdAt: 'desc'},
                include: {
                    orderItems: {
                        include: {
                            product: true
                        }
                    },

                },
            }),
            
            this.prisma.order.count({where}),
        ])

        return {
            orders,
            total,
            page,
            limit
        };
    }

    async getOrderById(id : string){
      const order = await this.prisma.order.findUnique({
        where:{id},
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      if(!order){
        throw new Error("Order not found")
      }

      return order
    }

    async updateOrder(id: string, updateData: UpdateOrderDto,userId?: string){

      const where: Prisma.OrderWhereInput = {id}
      if(userId){
        where.userId = userId
      }
      const existing = await this.prisma.order.findFirst({
        where
      })
      if(!existing){
        throw new NotFoundException("Order not found")
      }

      const updated = await this.prisma.order.update({
        where: {id},
        data: updateData,
        include: {
          orderItems: {
            include: {
              product: true
            }
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return updated
    }

    async cancelAdmin(id: string,userId? : string){
      const where : Prisma.OrderWhereInput = {id}
      if(userId){
        where.userId = userId
      }
      
      const order = await this.prisma.order.findFirst({
        where,
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      })
      if(!order){
        throw new NotFoundException("Order not found")
      }

      if(order.status !== OrderStatus.PENDING){
        throw new BadRequestException("Only pending orders can be cancelled")
      }

      const cancelled = await this.prisma.$transaction(async(ctx)=>{
        for(const item of order.orderItems){
          await ctx.product.update({
            where:{id: item.productId},
            data: {stock : {increment: item.quantity}}
          })
        }

        return ctx.order.update({
          where:{id},
          data: {status: OrderStatus.CANCELLED},
          include: {
            orderItems: {
              include: {
                product: true
              }
            }
          }
        })
      })

      return cancelled
    }

    
}
