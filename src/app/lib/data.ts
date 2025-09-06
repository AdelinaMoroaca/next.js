import { createClient } from "@vercel/postgres";
import { sql } from "@vercel/postgres";
import type { Post } from "./definitions";

export async function connectToDB() {
  const client = createClient();
  await client.connect();

  try {
    if (client) {
      console.log("Connected to DB");
      return client;
    }
  } catch (error) {
    console.error("Error connecting to database", error);
  }
}

// export async function getPosts() {
//   try {
//     const data = await sql`SELECT * FROM posts LIMIT 5`;

//     console.log(data.rows);

//     return data.rows;
//   } catch (error) {
//     console.error("Error getting posts", error);
//   }
// }

export async function getPosts(): Promise<Post[]> {
  try {
    const { rows } = await sql<Post>`
      SELECT id, title, content, date
      FROM posts
      ORDER BY date DESC
      LIMIT 5;
    `;
    return rows;
  } catch (error) {
    console.error("❌ Error getting posts", error);
    throw error;
  }
}
