import { Request, Response } from "express";
import { getUserByEmail } from "../../../../services/auth/getUser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export default async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }

        const user = await getUserByEmail(email);

        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'company-admin' },
            process.env.JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
