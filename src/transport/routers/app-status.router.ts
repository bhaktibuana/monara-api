import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { AppStatusController } from '@/app/controllers';

export class AppStatusRouter extends Router<AppStatusController> {
	constructor(router: ExpressRouter) {
		super(router, '/app-status', new AppStatusController());

		this.get('/ping', this.controller.ping);
	}
}
