import dayjs from 'dayjs';

import { Service } from '@/shared/libs/service.lib';
import { Res } from '@/shared/types/express';
import {
	LoginReqBody,
	RefreshReqBody,
	RegisterReqBody,
} from '@/transport/requests/auth.request';
import { RefreshTokenRepository, UserRepository } from '@/app/repositories';
import { Constant } from '@/shared/constants';
import { RefreshToken, User } from '@/app/models';
import { I_User } from '@/shared/interfaces';
import { Helper } from '@/shared/helpers';

export class AuthService extends Service {
	private userRepo: UserRepository;
	private refreshTokenRepo: RefreshTokenRepository;

	constructor() {
		super();

		this.userRepo = new UserRepository();
		this.refreshTokenRepo = new RefreshTokenRepository();
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
				name: existingUser.name,
				email: existingUser.email,
				role: existingUser.role,
				is_active: existingUser.is_active,
			};

			const refreshTokenPayload = {
				id: existingUser.id as number,
			};

			const accessToken = Helper.generateJWT(
				accessTokenPayload,
				Constant.user.ACCESS_TOKEN_EXPIRATION_TIME,
			);

			const refreshToken = Helper.generateJWT(
				refreshTokenPayload,
				Constant.user.REFRESH_TOKEN_EXPIRATION_TIME,
			);

			const verifyRefreshToken = Helper.verifyJWT(refreshToken);
			const decoded = verifyRefreshToken.decoded as never as {
				id: number;
				iat: number;
				exp: number;
			};

			console.log('Decoded Refresh Token:', decoded);

			await this.refreshTokenRepo.create(res, {
				user_id: decoded.id,
				token: refreshToken,
				iat_at: dayjs.unix(decoded.iat).toDate(),
				exp_at: dayjs.unix(decoded.exp).toDate(),
				is_active: true,
			});

			return {
				access_token: accessToken,
				refresh_token: refreshToken,
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.login.name);
		}
		return null;
	}

	/**
	 * Auth Service - Refresh access token
	 *
	 * @param res
	 * @param reqBody
	 * @returns
	 */
	public async refresh(res: Res, reqBody: RefreshReqBody) {
		try {
			const { refresh_token } = reqBody;

			const refreshToken = (await this.refreshTokenRepo.findOne(res, {
				token: refresh_token,
			})) as RefreshToken;

			if (!refreshToken)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Invalid refresh token',
				);

			if (!refreshToken.is_active)
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Refresh token is not active',
				);

			const verifyRefreshToken = Helper.verifyJWT(refresh_token);
			if (verifyRefreshToken.error)
				this.errorHandler(
					this.STATUS_CODE.UNAUTHORIZED,
					verifyRefreshToken.error.message,
					verifyRefreshToken.error,
				);

			const userId = refreshToken.user_id;

			const user = (await this.userRepo.findOneById(res, userId)) as User;

			const accessTokenPayload: I_User = {
				id: user.id as number,
				name: user.name,
				email: user.email,
				role: user.role,
				is_active: user.is_active,
			};

			const accessToken = Helper.generateJWT(
				accessTokenPayload,
				Constant.user.ACCESS_TOKEN_EXPIRATION_TIME,
			);

			return accessToken;
		} catch (error) {
			await this.catchErrorHandler(res, error, this.refresh.name);
		}
		return null;
	}
}
