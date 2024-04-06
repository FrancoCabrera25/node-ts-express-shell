import e, { Request, Response } from 'express';
import { CustomError } from '../../domain';
import { FileUploadService } from '../servicies/file-upload.service';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Interval server error' });
    };

    uploadFile = async (req: Request, res: Response) => {
        const type = req.url.split('/').at(2) ?? '';
        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService
            .uploadSingle(file, `uploads/${type}`)
            .then((uploads) => res.json(uploads))
            .catch((error) => this.handleError(error, res));
    };

    uploadMultipleFiles = async (req: Request, res: Response) => {
        const type = req.params.type;
        const files = req.body.files as UploadedFile[];

        this.fileUploadService
            .uploadMultiple(files, `uploads/${type}`)
            .then((uploads) => res.json(uploads))
            .catch((error) => this.handleError(error, res));
    };
}
