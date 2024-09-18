import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image: string;
            provider: string;
        };
    }
    interface User {
        id: string;
        name: string;
        email: string;
        password: string;
        provider: string;
        image: string;
        verificationCode: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        provider: string;
    }
}
