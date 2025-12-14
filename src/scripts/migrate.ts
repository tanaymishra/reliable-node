import { asyncQuery } from "../../config/database";
import fs from "fs";
import path from "path";

async function runMigrations() {
    console.log("Running migrations...");
    const migrationsDir = path.join(__dirname, "../../migrations");

    try {
        const files = fs.readdirSync(migrationsDir).sort();

        for (const file of files) {
            if (file.endsWith(".sql")) {
                console.log(`Executing migration: ${file}`);
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, "utf-8");

                await asyncQuery(sql, []);
                console.log(`Executed: ${file}`);
            }
        }
        console.log("All migrations executed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    }
}

runMigrations();
