import { envs } from '../../config/envs';
import { CategoryModel } from '../mongo/models/category.model';
import { ProductModel } from '../mongo/models/product.model';
import { UserModel } from '../mongo/models/user.model';
import { MongoDataBase } from '../mongo/mongo-database';
import { seedData } from './data';

(async () => {
    console.log('SEEEED');
    await MongoDataBase.connect({
        mongoUrl: envs.MOGNOURL,
        dbName: '',
    });

    await main();

    await MongoDataBase.disconnect();
})();

async function main() {
    console.log('seed');
    await Promise.all([UserModel.deleteMany(), CategoryModel.deleteMany(), ProductModel.deleteMany()]);

    const users = await UserModel.insertMany(seedData.users);

    const categories = await CategoryModel.insertMany(
        seedData.categories.map((category) => {
            return {
                ...category,
                user: users[0]._id,
            };
        })
    );

    const products = await ProductModel.insertMany(
        seedData.products.map((product) => {
            return {
                ...product,
                user: users[randomBetween(seedData.users.length - 1)],
                category: categories[randomBetween(seedData.categories.length - 1)],
            };
        })
    );
}

const randomBetween = (value: number) => {
    return Math.floor(Math.random() * value);
};
