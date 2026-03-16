import { BaseMiddleware } from '@/transport/middlewares/base.middleware';
import { Next, Req, Res } from '@/shared/types/express';
import { Helper } from '@/shared/helpers';
import { I_User } from '@/shared/interfaces';

export class Middleware extends BaseMiddleware {
	constructor() {
		super();
	}

	/**
	 * Auth Middleware
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public async auth(req: Req, res: Res, next: Next): Promise<void> {
		try {
			if (!req.headers.authorization)
				this.errorHandler(
					this.STATUS_CODE.UNAUTHORIZED,
					'Unauthorized',
				);

			const splitToken = (req.headers.authorization as string).split(' ');
			if (splitToken.length !== 2 || splitToken[0] !== 'Bearer')
				this.errorHandler(
					this.STATUS_CODE.BAD_REQUEST,
					'Wrong authorization format',
				);

			const { error, decoded } = Helper.verifyJWT<I_User>(splitToken[1]);
			if (error)
				this.errorHandler(
					this.STATUS_CODE.UNAUTHORIZED,
					error.message,
					error,
				);

			res.locals.user = decoded as I_User;

			next();
		} catch (error) {
			await this.catchErrorHandler(res, error, this.auth.name);
		}
	}

	/**
	 * Roles Middleware Generator
	 *
	 * @param requiredRoles
	 * @returns
	 */
	public roles(requiredRoles: string) {
		return async (_req: Req, res: Res, next: Next): Promise<void> => {
			try {
				const user: I_User = res.locals.user;
				const userRole = user.role;
				const roleParams = requiredRoles.split('|');

				if (userRole === 'owner') {
					next();
					return;
				}

				if (!roleParams.includes(userRole)) {
					this.errorHandler(
						this.STATUS_CODE.FORBIDDEN,
						`Access denied: ${requiredRoles} role required`,
					);
				}

				next();
			} catch (error) {
				await this.catchErrorHandler(res, error, this.roles.name);
			}
		};
	}
}
