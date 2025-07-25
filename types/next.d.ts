import "next-auth";
import { JWT } from "next-auth/jwt";
import {Role} from "@/types/api-types";

declare module "next-auth" {
    interface User {
        role?: string;
    }

    interface Session {
        user: {
            role?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: Role[];
    }
}