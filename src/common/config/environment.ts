import type { IEnvironment } from '@/common/interfaces';

export const ENVIRONMENT: IEnvironment = {
	APP: {
		NAME: process.env.APP_NAME,
		PORT: parseInt(process.env.PORT || process.env.APP_PORT || '3000'),
		ENV: process.env.NODE_ENV,
		CLIENT: process.env.FRONTEND_URL!,
	},
	DB: {
		HOST: process.env.DB_HOST!,
		USER: process.env.DB_USER!,
		PASSWORD: process.env.DB_PASSWORD!,
		DATABASE: process.env.DB_DATABASE!,
		PORT: process.env.DB_PORT!,
	},
	JWT: {
		ACCESS_KEY: process.env.ACCESS_TOKEN!,
		REFRESH_KEY: process.env.REFRESH_TOKEN!,
	},
	JWT_EXPIRES_IN: {
		ACCESS: process.env.ACCESS_TOKEN_EXPIRES_IN!,
		REFRESH: process.env.REFRESH_TOKEN_EXPIRES_IN!,
	},
	EMAIL: {
		GMAIL_USER: process.env.GMAIL_USER!,
		GMAIL_PASSWORD: process.env.GMAIL_PASSWORD!,
	},
};
