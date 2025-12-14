import { Request, Response } from "express";
import { getProjectsByAdminId } from "../../../services/project/projectService";

export default async function getAll(req: Request, res: Response) {
    try {
        const companyAdminId = (req as any).user?.id;

        if (!companyAdminId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const projects = await getProjectsByAdminId(companyAdminId);

        res.status(200).json({
            message: "Projects fetched successfully",
            projects
        });

    } catch (error) {
        console.error("Get projects error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
