import { Request, Response } from 'express';

import { Controller } from '@/shared/libs/controller.lib';
import { AppStatusService } from '@/app/services';
import { AppStatusResponse } from '@/transport/responses';

export class AppStatusController extends Controller {
	private appStatusSvc: AppStatusService;
	private appStatusRes: AppStatusResponse;

	constructor() {
		super();

		this.appStatusSvc = new AppStatusService();
		this.appStatusRes = new AppStatusResponse();
	}

	/**
	 * Ping - App Status Controller
	 *
	 * @param _req
	 * @param res
	 */
	public async ping(_req: Request, res: Response): Promise<void> {
		try {
			const result = await this.appStatusSvc.ping(res);

			this.response(
				res,
				'App Status',
				this.STATUS_CODE.OK,
				this.appStatusRes.ping(result),
			);
		} catch (error) {
			await this.catchErrorHandler(res, error, this.ping.name);
		}
	}
}
