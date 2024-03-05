import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { AuthServices } from '../servicies/auth.services';
import { CustomError } from '../../domain';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';

export class AuthController {
    constructor(public readonly authService: AuthServices) {}

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`${error}`);
        return res.status(500).json({ error: 'Interval server error' });
    };
    register = (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);

        if (error) return res.status(400).json(error);

        this.authService
            .registerUser(registerDto!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) return res.status(400).json(error);

        this.authService
            .loginUser(loginUserDto!)
            .then((user) => res.json(user))
            .catch((error) => this.handleError(error, res));
    };

    validateEmail = (req: Request, res: Response) => {
        res.json('validate');
    };
}