import { asyncQuery } from "../../../config/database";

export async function insertUser(name: string, email: string, password: string) {
    const query = `
        INSERT INTO company_admins (name, email, password) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (email) DO NOTHING 
        RETURNING *
    `;
    const values = [name, email, password];
    const result = await asyncQuery(query, values);
    return result;
}