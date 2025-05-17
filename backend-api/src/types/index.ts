declare namespace Express {
    export interface Request {
        user?: {
            id: string;
            email: string;
            name?: string;
        }
    }
}
export type User = {
    id: string;
    username: string;
    email: string;
    password: string;
};

export type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
};

export type Order = {
    id: string;
    userId: string;
    productIds: string[];
    totalAmount: number;
    createdAt: Date;
};