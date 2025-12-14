import { Request, Response } from "express";
import { getUserByEmail } from "../../../../services/auth/getUser";
import { insertUser } from "../../../../services/auth/insertUser";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import bcrypt from "bcrypt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function googleAuth(req: Request, res: Response) {
    try {
        const { token: googleToken } = req.body;

        if (!googleToken) {
            res.status(400).json({ message: "Google token is required" });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }

        const { email, sub: googleId } = payload;
        const name = payload.name || email.split('@')[0];

        let user = await getUserByEmail(email);

        if (!user) {
            // Create new user if not exists
            // Using a placeholder password for Google users. 
            // Ideally, the DB should allow null passwords or have a provider column.
            const placeholderPassword = `google_${googleId || Date.now()}`;
            const hashedPassword = await bcrypt.hash(placeholderPassword, 10);
            // Provide a name if missing
            const userName = name || email.split('@')[0];

            const result = await insertUser(userName, email, hashedPassword);

            // If insertUser uses ON CONFLICT DO NOTHING and returns nothing (if race condition), fetch again.
            // But insertUser returns result.
            if (result && result.length > 0) {
                user = result[0];
            } else {
                user = await getUserByEmail(email);
            }
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'company-admin' },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Google auth successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
