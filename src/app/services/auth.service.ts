import { Service } from '@/shared/libs/service.lib';
import { Res } from '@/shared/types/express';
import { RegisterReqBody } from '@/transport/requests/auth.request';
import { UserRepository } from '@/app/repositories';
import { Constant } from '@/shared/constants';

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
			const { name, email, password, password_conf } = reqBody;

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
}
