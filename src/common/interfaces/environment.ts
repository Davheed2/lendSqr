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
		AUTH_SECRET: string;
	};
	JWT_EXPIRES_IN: {
		AUTH: string;
	};
	EMAIL: {
		GMAIL_USER: string;
		GMAIL_PASSWORD: string;
	};
}
