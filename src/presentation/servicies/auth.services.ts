import { UserModel } from '../../data';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { UserEntity } from '../../domain/entities/user.entity';
import { bcryptAdapter } from '../../config/bcrypt.adpater';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { JwtAdapter } from '../../config/jwt.adapter';
import { EmailService } from './email.service';
import { envs } from '../../config/envs';

export class AuthServices {
    constructor(private readonly emailService: EmailService) {}

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });

        console.log('existUser', existUser);
        if (existUser) throw CustomError.badRequest('Email already exist');

        try {
            const user = new UserModel(registerUserDto);
            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();
            const { password, ...userRest } = UserEntity.fromObject(user);

            await this.sendEmailValidationLink(user.email);

            const token = await this.getToken({ id: userRest.id, email: userRest.email });
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
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });

        if (!user) throw CustomError.badRequest('Email/passord invalid');

        const isMatching = bcryptAdapter.compare(loginUserDto.password, user.password);

        if (!isMatching) throw CustomError.badRequest('Email/passord invalid');

        const { password, ...userProp } = UserEntity.fromObject(user);


        const token = await this.getToken({ id: user.id, email: user.email });
        if (!token) {
            throw CustomError.internalServer('Error while creating JWT');
        }
        return {
            user: userProp,
            token,
        };
    }

    public async validateEmail(token: string) {

      
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email: string };
        if(!email) throw CustomError.internalServer('Email not in token');

        const user = await UserModel.findOne({ email });
        if(!user) throw CustomError.internalServer('user not exist');

        user.emailValidate = true;

        await user.save();
        return true;



    }

    private async getToken(payload: any) {
        return await JwtAdapter.generateToken(payload);
    }

    private async sendEmailValidationLink(userEmail: string) {
        const token = await this.getToken({ email: userEmail });
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const html = `<h1>Validate your email</h1> <p>Click on the following link to validate your email</p><a href=${link}> Validate your email: ${userEmail} </a>`;

        const options = {
            to: userEmail,
            subject: 'Validate your email',
            htmlBody: html,
        };

        const isSent = await this.emailService.sendEmail(options);

        if(!isSent) throw CustomError.internalServer('Error sending email validation')

        return true;
    }
}
