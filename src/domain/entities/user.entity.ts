import { CustomError } from '../errors/custom.error';
export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        public emailValidate: boolean,
        public password: string,
        public role: string[],
        public img?: string
    ) {}

    static fromObject(object: { [key: string]: any }) {
        const { id, _id, name, email, emailValidate, password, role, img } = object;

        if (!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!name) {
            throw CustomError.badRequest('Missing name');
        }

        if (!email) {
            throw CustomError.badRequest('Missing email');
        }
        if (emailValidate === undefined) {
            throw CustomError.badRequest('Missing emailValidate');
        }
        if (!password) {
            throw CustomError.badRequest('Missing password');
        }
        if (!role) {
            throw CustomError.badRequest('Missing role');
        }

        return new UserEntity(_id || id, name, email, emailValidate, password, role, img);
    }
}
