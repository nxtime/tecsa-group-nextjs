import clientPromise from "@/utils/mongo-client";
import { createClient } from "@/utils/supabase-server";
import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const client = await clientPromise;
  const db = client.db("tecsa-group");

  const logsFromDb = await db.collection("logs").find({}).sort({ createdAt: -1 }).toArray();

  const logs = await Promise.all(logsFromDb.map(async (log) => {

    const { data: user } = await supabase.from("profiles").select("name, avatar_url, created_at").eq("id", log.userId);

    return {
      createdAt: log.createdAt,
      user: user?.[0] ?? {},
      type: log.type
    }

  }));

  return NextResponse.json(logs);

}

export const POST = async (request: Request) => {
  const supabase = createClient();
  console.log("This is the body", request.body);
  const jsonRequest = await request.json();

  const { type, userId } = jsonRequest;

  const client = await clientPromise;
  const db = client.db("tecsa-group");

  const addedLog = await db.collection("logs").insertOne({
    createdAt: new Date(),
    userId,
    type: type ?? "Não definido"
  });

  return NextResponse.json(addedLog);
}
