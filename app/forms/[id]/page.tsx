import FormEditor from "../../../components/FormEditor";
import FormView from "../../../components/FormView";
import { store } from "../../../lib/fileStore";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { generateMetadata as genMeta } from "../../../lib/seo";
import { auth } from "../../../auth";

type Params = { params: { id: string } };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p: any = params as any;
  const resolved = typeof p?.then === "function" ? await p : p;
  const id = resolved?.id as string | undefined;

  if (!id) return genMeta({ title: "Form", path: `/forms/${id}` });

  const item = store.get(id);
  if (!item) return genMeta({ title: "Form Not Found", path: `/forms/${id}` });

  return genMeta({
    title: item.title,
    description: item.description || `View and manage form: ${item.title}`,
    path: `/forms/${id}`,
  });
}

export default async function EditFormPage({ params }: Params) {
  // params may be a promise in some Next builds; handle both cases
  const p: any = params as any;
  const resolved = typeof p?.then === "function" ? await p : p;
  const id = resolved?.id as string | undefined;

  // Get session from NextAuth
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session) {
    redirect(`/login?from=/forms/${id}`);
  }

  if (!id) return <div className="text-red-600">Missing id</div>;
  const item = store.get(id);
  if (!item) return <div className="text-red-600">Form not found</div>;

  // If not admin, render a read-only client component view so we get
  // loading skeletons and client-side refresh behavior.
  if (role !== "Admin") {
    return (
      <section>
        {/* FormView does its own client fetch and shows skeletons/errors */}
        {/* Pass id so it can fetch the latest version */}
        {/* eslint-disable-next-line @next/next/no-typos */}
        {/* @ts-ignore */}
        <FormView id={id} />
      </section>
    );
  }

  // Admin -> show editor
  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Edit Form</h1>
      <FormEditor initial={item} mode="edit" />
    </section>
  );
}
