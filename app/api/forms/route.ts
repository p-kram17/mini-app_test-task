import { NextResponse } from "next/server";
import { store } from "../../../lib/fileStore";
import { formListSchema, formSchema } from "../../../lib/formSchema";
import { auth } from "../../../auth";

export async function GET() {
  try {
    const list = store.list();
    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to read forms" },
      { status: 500 }
    );
  }
}

async function isAdmin() {
  const session = await auth();
  return (session?.user as any)?.role === "Admin";
}

export async function POST(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  try {
    // Let the store create id and updatedAt; validate the client fields via formSchema
    const input = {
      title: body.title,
      description: body.description,
      fieldsCount: body.fieldsCount,
      status: body.status,
    };
    // parsing here ensures the correct shape before creating
    formSchema.parse({
      ...input,
      id: undefined,
      updatedAt: new Date().toISOString(),
    });
    const created = store.create(input);
    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid data" },
      { status: 422 }
    );
  }
}
