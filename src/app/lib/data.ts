import { createClient } from "@vercel/postgres";

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
