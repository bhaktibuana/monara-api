import { I_PingSvcResult } from '@/shared/interfaces';

export class AppStatusResponse {
	/**
	 * Ping - App Status Response
	 *
	 * @param payload
	 * @returns
	 */
	public ping(payload: I_PingSvcResult | null) {
		if (!payload) return null;
		return payload;
	}
}
