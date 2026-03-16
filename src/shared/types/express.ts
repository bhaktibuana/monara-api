import { NextFunction, Request, Response } from 'express';

import { I_User } from '@/shared/interfaces';

declare namespace e {
	type Next = NextFunction;
	type Req = Request;

	type Res = Response<
		any,
		{
			base_url: string;
			request_id: string;
			user: I_User;
		}
	>;
}

export = e;
