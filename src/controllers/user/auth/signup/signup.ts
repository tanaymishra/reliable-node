import { Request, Response } from "express";
import { insertUser } from "../../../../services/auth/insertUser";
import bcrypt from "bcrypt";

export default async function signup(req: Request, res: Response) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await insertUser(name, email, hashedPassword);

        if (!newUser || newUser.length === 0) {
            res.status(409).json({ message: "User already exists" });
            return;
        }

        // Remove password from response
        const userResponse = { ...newUser[0] };
        delete userResponse.password;

        res.status(201).json({
            message: "User created successfully",
            user: userResponse
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}