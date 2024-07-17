import { db } from "~/server/db";

export async function GET(req: Request, res: Response) {
  const posts = await db.query.posts.findMany();

  return new Response(JSON.stringify({ posts: posts }));
}
