"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Form } from "../lib/formSchema";
import useClientStore from "../lib/clientStore";
import ConfirmModal from "./ConfirmModal";
import { exportToCSV } from "../lib/csvExport";

type Props = { initial: Form[]; canEdit?: boolean };

export default function FormsTable({ initial, canEdit = false }: Props) {
  const [forms, setForms] = useState<Form[] | null>(initial);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const addToast = useClientStore((s) => s.addToast);
  const stateRole = useClientStore((s) => s.role);

  function getRoleFromCookie() {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(/(?:^|; )role=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  }

  const role = stateRole ?? getRoleFromCookie();
  const isAdmin = canEdit || role === "Admin";

  async function fetchList() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms");
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setForms(data);
    } catch (err: any) {
      setForms([]);
      setError(err?.message || "Failed to load forms");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!forms) return null;
    let out = forms.slice();
    if (statusFilter !== "all")
      out = out.filter((f) => f.status === statusFilter);
    out.sort((a, b) =>
      sortDesc
        ? Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
        : Date.parse(a.updatedAt) - Date.parse(b.updatedAt)
    );
    return out;
  }, [forms, statusFilter, sortDesc]);

  if (loading || filtered === null) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    );
  }

  if (filtered.length === 0)
    return <div className="text-gray-500">No forms found.</div>;

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2" htmlFor="statusFilter">
          <span className="text-sm">Filter</span>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 border px-2 py-1 focus:outline-none"
          >
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <button
          onClick={() => setSortDesc((s) => !s)}
          aria-pressed={!sortDesc}
          className="rounded border px-3 py-1 focus:outline-none"
        >
          Sort: {sortDesc ? "Newest" : "Oldest"}
        </button>

        <button
          onClick={() => {
            try {
              exportToCSV(
                filtered,
                `forms-${new Date().toISOString().split("T")[0]}.csv`
              );
              addToast("CSV exported successfully");
            } catch (err: any) {
              addToast(err?.message || "Failed to export CSV");
            }
          }}
          className="ml-auto rounded border border-green-600 bg-green-50 px-3 py-1 text-sm text-green-700 hover:bg-green-100 focus:outline-none focus:ring"
          title="Export filtered forms to CSV"
        >
          📥 Export CSV
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">
          <div className="flex items-center justify-between">
            <div>{error}</div>
            <div className="ml-4">
              <button
                onClick={() => fetchList()}
                className="rounded bg-white border px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-offset-1"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-sm text-gray-500">
            <th className="py-2">Title</th>
            <th>Status</th>
            <th>Updated</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f.id} className="border-t hover:bg-gray-50">
              <td className="py-3">
                <a
                  href={`/forms/${f.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {f.title}
                </a>
              </td>
              <td className="py-3 text-sm">
                {f.status === "active" && (
                  <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
                    Active
                  </span>
                )}
                {f.status === "draft" && (
                  <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800">
                    Draft
                  </span>
                )}
                {f.status === "archived" && (
                  <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
                    Archived
                  </span>
                )}
              </td>
              <td className="py-3 text-sm text-gray-600">
                {new Date(f.updatedAt).toLocaleString()}
              </td>
              {isAdmin && (
                <td className="py-3 text-sm text-gray-600">
                  <Link
                    href={`/forms/${f.id}`}
                    className="mr-2 inline-flex items-center rounded border px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring"
                    aria-label={`Edit ${f.title}`}
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      setDeleteModal({ id: f.id || "", title: f.title })
                    }
                    className="ml-2 inline-flex items-center rounded border border-red-200 bg-red-50 px-2 py-1 text-sm text-red-700 hover:bg-red-100 focus:outline-none focus:ring"
                    aria-label={`Quick delete ${f.title}`}
                    title="Quick delete"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteModal}
        title="Delete Form"
        message={`Are you sure you want to delete "${deleteModal?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onCancel={() => setDeleteModal(null)}
        onConfirm={async () => {
          if (!deleteModal) return;
          try {
            const res = await fetch(`/api/forms/${deleteModal.id}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
              addToast(data?.error || "Failed to delete");
              return;
            }
            setForms((s) => (s ? s.filter((x) => x.id !== deleteModal.id) : s));
            addToast("Form deleted successfully");
            setDeleteModal(null);
          } catch (err: any) {
            addToast(err?.message || "Error deleting");
          }
        }}
      />
    </div>
  );
}
