import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                name?: string;
            } & JwtPayload
        }
    }
}

export {};