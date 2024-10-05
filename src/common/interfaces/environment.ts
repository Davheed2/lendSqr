export interface IEnvironment {
	APP: {
		NAME?: string;
		PORT: number;
		ENV?: string;
		CLIENT: string;
	};
	DB: {
		HOST: string;
		USER: string;
		PASSWORD: string;
		DATABASE: string;
		PORT: string;
	};
	JWT: {
		ACCESS_KEY: string;
		REFRESH_KEY: string;
	};
	JWT_EXPIRES_IN: {
		ACCESS: string;
		REFRESH: string;
	};
	EMAIL: {
		GMAIL_USER: string;
		GMAIL_PASSWORD: string;
	};
}
