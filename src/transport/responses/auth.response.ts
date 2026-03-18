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
	public login(
		payload: { access_token: string; refresh_token: string } | null,
	) {
		if (!payload) return null;
		return {
			access_token: payload.access_token,
			refresh_token: payload.refresh_token,
		};
	}

	/**
	 * Auth Response - Refresh access token
	 *
	 * @param payload
	 * @returns
	 */
	public refresh(payload: string | null) {
		if (!payload) return null;
		return {
			access_token: payload,
		};
	}
}
