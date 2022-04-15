import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/api-paginated-response.decorator';
import { PageOptionsDto } from 'src/common/dtos/page-options.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductDto } from '../dtos/product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductsService } from '../services/products.service';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('id') providerId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    console.log('providerId: ', providerId);
    console.log('createProductDto: ', createProductDto);
    return this.productsService.create(+providerId, createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ProductDto)
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    if (Object.keys(pageOptionsDto).length === 0) {
      pageOptionsDto = new PageOptionsDto();
    }

    return this.productsService.getProducts(pageOptionsDto);
  }

  @Get('providers/:id')
  @HttpCode(HttpStatus.OK)
  findAllByProvider(
    @Param('id') id: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return this.productsService.getProductsByProviderId(+id, pageOptionsDto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productsService.getProductById(+id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.delete(+id);
  }
}
