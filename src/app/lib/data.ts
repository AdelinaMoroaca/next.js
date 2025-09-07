import { createClient } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
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

export async function getPosts(): Promise<Post[]> {
  try {
    noStore();
    const data = await sql<Post>`SELECT * FROM posts`;
    console.log("data.rows", data.rows);
    return data.rows;
  } catch (error) {
    console.error("Error getting posts", error);
    throw error;
  }
}
