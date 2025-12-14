import { asyncQuery } from "../../../config/database";

export interface Project {
    id: string;
    name: string;
    description?: string;
    company_admin_id: string;
    created_at: Date;
    updated_at: Date;
}

export async function createProject(name: string, companyAdminId: string, description?: string): Promise<Project> {
    const query = `
        INSERT INTO projects (name, company_admin_id, description)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const result = await asyncQuery(query, [name, companyAdminId, description]);
    if (!result || result.length === 0) {
        throw new Error("Failed to create project");
    }
    return result[0];
}

export async function getProjectsByAdminId(companyAdminId: string): Promise<Project[]> {
    const query = `
        SELECT * FROM projects
        WHERE company_admin_id = $1
        ORDER BY created_at DESC
    `;
    const result = await asyncQuery(query, [companyAdminId]);
    return result || [];
}
