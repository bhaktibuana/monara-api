import { User } from '@/app/models';

export class AuthResponse {
	/**
	 * Auth Response - Register a new user
	 *
	 * @param payload
	 * @returns
	 */
	public register(payload: User | null) {
		if (!payload) return null;
		return {
			name: payload.name,
			email: payload.email,
		};
	}

	/**
	 * Auth Response - Login
	 *
	 * @param payload
	 * @returns
	 */
	public login(payload: string | null) {
		if (!payload) return null;
		return {
			access_token: payload,
		};
	}
}
