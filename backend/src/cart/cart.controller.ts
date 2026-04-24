import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { GetUser } from 'src/common/decorator/GetUser.decorator';
import { AddToCartDto } from './dto/add-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { MergeCartDto } from './dto/merge-cart.dto';

/**
 * Cart Controller
 * Handles shopping cart endpoints
 * All endpoints require authentication
 */
@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Get current user's cart
   * GET /cart
   */
  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  @ApiResponse({
    status: 200,
    description: 'User cart with items',
  })
  async getCart(@GetUser('id') userId: string) {
    return this.cartService.getOrCreateCart(userId);
  }

  /**
   * Add item to cart
   * POST /cart/items
   */
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiBody({ type: AddToCartDto })
  @ApiResponse({
    status: 201,
    description: 'Item added to cart',
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({
    status: 400,
    description: 'Product unavailable or insufficient stock',
  })
  async addToCart(
    @GetUser('id') userId: string,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(userId, addToCartDto);
  }

  /**
   * Update cart item quantity
   * PATCH /cart/items/:id
   */
  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiResponse({
    status: 200,
    description: 'Cart item updated',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock' })
  async updateCartItem(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(userId, id, updateCartItemDto);
  }

  /**
   * Remove item from cart
   * DELETE /cart/items/:id
   */
  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from cart',
  })
  @ApiResponse({ status: 404, description: 'Cart item not found' })
  async removeFromCart(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.cartService.removeFromCart(userId, id);
  }

  /**
   * Clear all items from cart
   * DELETE /cart
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiResponse({
    status: 200,
    description: 'Cart cleared',
  })
  async clearCart(@GetUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }

  /**
   * Merge guest cart with user cart
   * POST /cart/merge
   */
  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart into user cart' })
  @ApiBody({ type: MergeCartDto })
  @ApiResponse({
    status: 200,
    description: 'Merged cart',
  })
  async mergeCart(
    @GetUser('id') userId: string,
    @Body() mergeCartDto: MergeCartDto,
  ) {
    return this.cartService.mergeCart(userId, mergeCartDto.items);
  }
}
