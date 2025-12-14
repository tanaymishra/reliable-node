import { Request, Response } from "express";
import { createProject } from "../../../services/project/projectService";

export default async function create(req: Request, res: Response) {
    try {
        const { name, description } = req.body;
        // Assuming auth middleware attaches user to req.user
        // We will need to define a type for req.user later
        const companyAdminId = (req as any).user?.id;

        if (!companyAdminId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        if (!name) {
            res.status(400).json({ message: "Project name is required" });
            return;
        }

        const project = await createProject(name, companyAdminId, description);

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
