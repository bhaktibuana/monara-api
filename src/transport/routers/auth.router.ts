import { Router as ExpressRouter } from 'express';

import { Router } from '@/shared/libs/router.lib';
import { AuthController } from '@/app/controllers';

export class AuthRouter extends Router<AuthController> {
	constructor(router: ExpressRouter) {
		super(router, '/auth', new AuthController());

		this.post('/register', this.controller.register);
		this.post('/login', this.controller.login);
	}
}
