import mongoose from "mongoose";


interface ConnectionOptions {

    mongoUrl: string;
    dbName: string;

}

export class MongoDataBase {

    static async connect(options: ConnectionOptions){
        const { mongoUrl, dbName } = options;

        try {
            await mongoose.connect(mongoUrl, {});
            console.log('moongo connect');

            return true;
            
        } catch (error) {
            console.log('Mongo connection errror');
            throw error;
        }
    }

    static async disconnect() {
        await mongoose.disconnect();
    }
}