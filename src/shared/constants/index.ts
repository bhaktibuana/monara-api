import { AppConstant } from '@/shared/constants/app.constant';
import { DbConstant } from '@/shared/constants/db.constant';
import { UserConstant } from '@/shared/constants/user.constant';
import { AppConfigConstant } from '@/shared/constants/app-config.constant';

export class Constant {
	public static app = new AppConstant();
	public static db = new DbConstant();
	public static user = new UserConstant();
	public static appConfig = new AppConfigConstant();
}
