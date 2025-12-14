import { asyncQuery } from "../../../../config/database";
import { Request } from "express";
import { Response } from "express";
export async function signup(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

    } catch (error) {

    }
}