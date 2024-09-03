import "next-auth";
import { DefaultSession } from "next-auth";

declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAcceptingTestimonials?: boolean;
        username?: string;
    }
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingTestimonials?: boolean;
            username?: string;
            oauthProvider?: string | null;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        isAcceptingTestimonials?: boolean;
        username?: string;
        oauthProvider?: string | null;
    }
}