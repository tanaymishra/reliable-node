import { Pool } from "pg"
const connectionString = "postgresql://neondb_owner:npg_XaClnwxKD6i2@ep-wild-hall-a1qu0cop-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
const pool = new Pool({
    connectionString: connectionString
})

export async function connect() {
    try {
        await pool.connect()
        console.log("Database is connected")
    }
    catch (e) {
        console.log("Error Connecting to Database", e)
    }
}

export async function asyncQuery(text: string, params: any[]) {
    try {
        const res = await pool.query(text, params)
        return res.rows
    }
    catch (e) {
        console.log("Error Querying Database", e)
    }
}