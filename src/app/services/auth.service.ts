import { Service } from '@/shared/libs/service.lib';
import { Res } from '@/shared/types/express';
import {
	LoginReqBody,
	RegisterReqBody,
} from '@/transport/requests/auth.request';
import { UserRepository } from '@/app/repositories';
import { Constant } from '@/shared/constants';
import { User } from '@/app/models';
import { I_User } from '@/shared/interfaces';
import { Helper } from '@/shared/helpers';

export class AuthService extends Service {
	private userRepo: UserRepository;

	constructor() {
		super();

		this.userRepo = new UserRepository();
	}

	/**
	 * Auth Service - Register a new user
	 *
	 * @param res
	 * @param reqBody
	 * @returns
	 */
	public async register(res: Res, reqBody: RegisterReqBody) {
		try {
			const { name, email, password } = reqBody;

			const existingUser = await this.userRepo.findOne(res, { email });
			if (existingUser)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Email already exists',
				);

			await this.userRepo.create(res, {
				name,
				email,
				password,
				role: Constant.user.ROLE_OWNER_KEY,
				is_active: true,
			});

			const createdUser = await this.userRepo.findOne(res, { email });
			return createdUser;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.register.name);
		}
		return null;
	}

	/**
	 * Auth Service - Login
	 *
	 * @param res
	 * @param reqBody
	 * @returns
	 */
	public async login(res: Res, reqBody: LoginReqBody) {
		try {
			const { email, password } = reqBody;

			const existingUser = (await this.userRepo.findOne(res, {
				email,
				password,
			})) as User;

			if (!existingUser)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Invalid email or password',
				);

			if (!existingUser.is_active as boolean)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'User is no longer active',
				);

			const accessTokenPayload: I_User = {
				id: existingUser.id as number,
				email: existingUser.email,
				is_active: existingUser.is_active,
			};

			const accessToken = Helper.generateJWT(
				accessTokenPayload,
				Constant.user.ACCESS_TOKEN_EXPIRATION_TIME,
			);

			return accessToken;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.login.name);
		}
		return null;
	}
}
