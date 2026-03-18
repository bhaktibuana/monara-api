import { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export interface I_Pagination {
	total_items?: number;
	total_pages?: number;
	per_page?: number;
	current_page?: number;
	next_page?: number | null;
	previous_page?: number | null;
}

export interface I_HTTPResponse<T> {
	request_id: string;
	message: string;
	status: boolean;
	status_code: number;
	data: T | null;
	error: T | null;
	pagination: I_Pagination | null;
}

export interface I_VerifiedJWT<T> {
	error: VerifyErrors | null;
	decoded: (JwtPayload & T) | Object;
}

export interface I_ModelWithAssociate {
	associate?: () => void;
}

export interface I_User {
	id: number;
	email: string;
	is_active: boolean;
}

export interface I_PingSvcResult {
	app_version: string | undefined;
	api_version: string | undefined;
}

export interface I_MysqlRelationCheck {
	total_records: number;
	records: {
		table_name: string;
		count: number;
	}[];
}
