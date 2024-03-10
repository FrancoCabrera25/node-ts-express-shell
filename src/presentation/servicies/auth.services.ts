import { UserModel } from '../../data';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { UserEntity } from '../../domain/entities/user.entity';
import { bcryptAdapter } from '../../config/bcrypt.adpater';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { JwtAdapter } from '../../config/jwt.adapter';

export class AuthServices {
    constructor() {}

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.find({ email: registerUserDto.email });

        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();
            const { password, ...userRest } = UserEntity.fromObject(user);

            const token = this.getToken({ id: userRest.id, email: userRest.email });
            if (!token) {
                throw CustomError.internalServer('Error while creating JWT');
            }
            return {
                user: userRest,
                token,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }

        return 'todo ok';
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });

        if (!user) throw CustomError.badRequest('Email/passord invalid');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!isMatching) throw CustomError.badRequest('Email/passord invalid');

        const { password, ...userProp } = UserEntity.fromObject(user);

        const token = this.getToken({ id: user.id, email: user.email });
        if (!token) {
            throw CustomError.internalServer('Error while creating JWT');
        }
        return {
            user: userProp,
            token,
        };
    }

    public async getToken(payload: any) {
        return await JwtAdapter.generateToken(payload);
    }
}
