import { env } from 'process';
import { envs } from './config/envs';
import { MongoDataBase } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async () => {
    main();
})();

async function main() {
    await MongoDataBase.connect({
        mongoUrl: envs.MOGNOURL,
        dbName: '',
    });

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    server.start();
}
