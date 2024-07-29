import { db } from "~/server/db";

export async function POST(req: Request, res: Response) {
  const users = await db.query.users.findMany();

  return new Response(JSON.stringify({ users: users }));
}
