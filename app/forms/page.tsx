import FormsTable from "../../components/FormsTable";
import { store } from "../../lib/fileStore";
import { Metadata } from "next";
import { generateMetadata as genMeta } from "../../lib/seo";
import { auth } from "../../auth";

export const metadata: Metadata = genMeta({
  title: "Forms",
  description:
    "Browse and manage your forms. View all forms with filtering, sorting, and quick actions.",
  path: "/forms",
});

export default async function FormsPage() {
  const forms = store.list();
  const session = await auth();
  const role = (session?.user as any)?.role;

  const canEdit = role === "Admin";

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Forms</h1>
      <div className="mb-6 flex items-center gap-4">
        <p className="text-gray-600">List of Forms</p>
        {canEdit && (
          <a
            href="/forms/new"
            className="ml-auto rounded bg-green-600 px-3 py-2 text-white"
          >
            New Form
          </a>
        )}
      </div>
      <FormsTable initial={forms} canEdit={canEdit} />
    </section>
  );
}
