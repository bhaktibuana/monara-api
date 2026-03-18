import { RefreshToken } from '@/app/models/refresh-token.model';

export const userMetadata = [
	{
		table: 'refresh_tokens',
		model: RefreshToken,
		column: 'user_id',
	},
];
