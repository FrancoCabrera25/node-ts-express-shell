import { envs } from '../../config/envs';
import { MongoDataBase } from '../mongo/mongo-database';

async () => {
    await MongoDataBase.connect({
        mongoUrl: envs.MOGNOURL,
        dbName: '',
    });

    await main();

    await MongoDataBase.disconnect();

};

async function main() {}
