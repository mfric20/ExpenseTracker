import { db } from "~/server/db";

export async function GET(req: Request, res: Response) {
  const posts = await db.query.users.findMany();

  return new Response(JSON.stringify({ posts: posts }));
}
