import type { Metadata } from "next";
import { store } from "../../lib/fileStore";
import { generateMetadata as genMeta } from "../../lib/seo";
import { auth } from "../../auth";

export const metadata: Metadata = genMeta({
  title: "Dashboard",
  description:
    "Admin dashboard to view form statistics, manage forms, and access quick actions.",
  path: "/dashboard",
  noIndex: true, // Admin-only page, no need to index
});

type Form = {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
};

async function fetchForms(): Promise<Form[]> {
  const res = await fetch(`/api/forms`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email;

  const forms = store.list();

  const total = forms.length;
  const active = forms.filter((f) => f.status === "active").length;
  const draft = forms.filter((f) => f.status === "draft").length;
  const archived = forms.filter((f) => f.status === "archived").length;

  const recent = forms
    .slice()
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 3);

  return (
    <section>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Welcome back{email ? `, ${email}` : ""}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-blue-100 px-2 py-1 text-sm font-medium text-blue-800">
              Admin
            </span>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-3">
          <a
            href="/forms/new"
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Create New Form
          </a>
          <a
            href="/forms"
            className="rounded border px-4 py-2 hover:bg-gray-50"
          >
            View Forms
          </a>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="rounded border p-4">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-semibold">{total}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-semibold text-green-600">{active}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-500">Draft</div>
          <div className="text-2xl font-semibold text-yellow-600">{draft}</div>
        </div>
        <div className="rounded border p-4">
          <div className="text-sm text-gray-500">Archived</div>
          <div className="text-2xl font-semibold text-gray-600">{archived}</div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">Recent forms</h2>
        <div className="overflow-x-auto rounded border">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Updated</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((f) => (
                <tr key={f.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <a
                      href={`/forms/${f.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {f.title}
                    </a>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {f.status}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(f.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
