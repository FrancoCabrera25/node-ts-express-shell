import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export class ImageController {
    getImage = (req: Request, res: Response) => {
        const { tpye = '', img = '' } = req.params;

        const imagePath = path.resolve(__dirname, `../../../uploads/${tpye}/${img}`);

        if (!fs.existsSync(imagePath)) {
            return res.status(404).send('Image not found');
        }

        res.sendFile(imagePath);
    };
}
