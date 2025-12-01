import { NextResponse } from "next/server";
import { store } from "../../../../lib/fileStore";
import { formSchema } from "../../../../lib/formSchema";
import { auth } from "../../../../auth";

async function isAdmin() {
  const session = await auth();
  return (session?.user as any)?.role === "Admin";
}

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  const id = parts[parts.length - 1];
  const item = store.get(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PUT(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  const id = parts[parts.length - 1];
  const body = await req.json();
  try {
    const input = {
      title: body.title,
      description: body.description,
      fieldsCount: body.fieldsCount,
      status: body.status,
    };
    // Validate shape with a server-provided updatedAt
    formSchema.parse({ ...input, id, updatedAt: new Date().toISOString() });
    const updated = store.update(id, input as any);
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Invalid data" },
      { status: 422 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/");
  const id = parts[parts.length - 1];
  const ok = store.delete(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
