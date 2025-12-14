import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface UserPayload {
    id: string;
    email: string;
    role: "company-admin" | "super-admin" | "company-employee";
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

//Middleware for authentication JWT
export const authMiddleware = (roles: UserPayload["role"][]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const decoded = verify(token, process.env.JWT_SECRET as string) as UserPayload;

            // Attach user info to request object
            req.user = decoded;

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }

            next();
        } catch (error) {
            console.error("JWT Verification Error:", error);
            return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }
    }
}