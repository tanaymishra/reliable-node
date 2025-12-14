import { asyncQuery } from "../../../config/database";

export async function getUserByEmail(email: string) {
    const query = `
        SELECT * FROM users WHERE email = $1
    `;
    const result = await asyncQuery(query, [email]);
    if (!result || result.length === 0) {
        return null;
    }
    return result[0];
}
