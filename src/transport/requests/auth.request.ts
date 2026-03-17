import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { Helper } from '@/shared/helpers';
import { Match } from '@/transport/requests/decorator';

export class RegisterReqBody {
	@IsString()
	@IsNotEmpty()
	name!: string;

	@IsString()
	@IsNotEmpty()
	email!: string;

	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => {
		return Helper.hash(value);
	})
	password!: string;

	@IsString()
	@IsNotEmpty()
	@Transform(({ value }) => {
		return Helper.hash(value);
	})
	@Match('password', {
		message: 'Password confirmation does not match password',
	})
	password_conf!: string;
}
