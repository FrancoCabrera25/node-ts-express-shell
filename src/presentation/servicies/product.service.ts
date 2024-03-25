import { CustomError } from '../../domain';
import { CreateProductDto } from '../../domain/dtos/product/create-product.dto';
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';
import { ProductModel } from '../../data/mongo/models/product.model';

export class ProductService {
    constructor() {}

    async createProduct(createProductDto: CreateProductDto) {
        const productExists = await ProductModel.findOne({ name: createProductDto.name });

        if (productExists) throw CustomError.badRequest('Product already exists');

        try {
            const product = new ProductModel({
                ...createProductDto,
            });

            await product.save();
            return product;
        } catch (error) {
            throw CustomError.internalServer('Internal server');
        }
    }

    async getProducts({ page, limit }: PaginationDto): Promise<any> {
        try {
            /*  const total = await CategoryModel.countDocuments();
            const categories = await CategoryModel.find()
                .skip((page - 1) * limit)
                .limit(limit);
 */
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user','name, email')
                    .populate('category', 'name')
            ]);

            return {
                limit,
                page,
                total,
                products,
            };
        } catch (error) {
            throw CustomError.internalServer('Internal Server error');
        }
    }
}
