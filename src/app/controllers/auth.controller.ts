import { Request, Response } from 'express';

import { Res } from '@/shared/types/express';
import { Controller } from '@/shared/libs/controller.lib';
import {
	LoginReqBody,
	RefreshReqBody,
	RegisterReqBody,
} from '@/transport/requests';
import { AuthService } from '@/app/services';
import { AuthResponse } from '@/transport/responses';

export class AuthController extends Controller {
	private authSvc: AuthService;
	private authRes: AuthResponse;

	constructor() {
		super();

		this.authSvc = new AuthService();
		this.authRes = new AuthResponse();
	}

	/**
	 * Auth Controller - Register a new user
	 *
	 * @param req
	 * @param res
	 */
	public async register(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(RegisterReqBody, req);

			const result = await this.authSvc.register(res as Res, reqBody);

			this.response(
				res,
				'Register a new user successfully',
				this.STATUS_CODE.OK,
				this.authRes.register(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.register.name);
		}
	}

	/**
	 * Auth Controller - Login
	 *
	 * @param req
	 * @param res
	 */
	public async login(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(LoginReqBody, req);

			const result = await this.authSvc.login(res as Res, reqBody);

			this.response(
				res,
				'Login successfully',
				this.STATUS_CODE.OK,
				this.authRes.login(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.login.name);
		}
	}

	/**
	 * Auth Controller - Refresh access token
	 *
	 * @param req
	 * @param res
	 */
	public async refresh(req: Request, res: Response): Promise<void> {
		try {
			const reqBody = await this.getRequestBody(RefreshReqBody, req);

			const result = await this.authSvc.refresh(res as Res, reqBody);

			this.response(
				res,
				'Refresh access token successfully',
				this.STATUS_CODE.OK,
				this.authRes.refresh(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.refresh.name);
		}
	}
}
