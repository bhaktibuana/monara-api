import { Response } from 'express';

import { Service } from '@/shared/libs/service.lib';
import { Constant } from '@/shared/constants';

export class AppStatusService extends Service {
	constructor() {
		super();
	}

	/**
	 * Ping - App Status Service
	 *
	 * @param res
	 * @returns
	 */
	public async ping(res: Response) {
		try {
			return {
				app_version: Constant.appConfig.APP_VERSION.find(
					(item) => item.name === 'app_version',
				)?.value,
				api_version: Constant.appConfig.APP_VERSION.find(
					(item) => item.name === 'api_version',
				)?.value,
			};
		} catch (error) {
			await this.catchErrorHandler(res, error, this.ping.name);
		}
		return null;
	}
}
