import { Request, Response } from "express";
import { insertUser } from "../../../../services/auth/insertUser";

export default async function signup(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const newUser = await insertUser(name, email, password);

        res.status(201).json({
            message: "User created successfully",
            user: newUser
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}