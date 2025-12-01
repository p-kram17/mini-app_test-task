"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Form } from "../lib/formSchema";

type Props = { id: string };

export default function FormView({ id }: Props) {
  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchForm() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/forms/${id}`);
      if (!res.ok) throw new Error(`Failed to load (${res.status})`);
      const data = await res.json();
      setForm(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load form");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite">
        <div className="mb-4 h-8 w-2/3 animate-pulse rounded bg-gray-200" />
        <div className="mb-6 h-4 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="grid grid-cols-2 gap-4 max-w-xl">
          <div className="space-y-2">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-12 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="col-span-2">
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
            <div className="h-12 mt-2 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  if (error)
    return (
      <div
        role="alert"
        className="rounded border-l-4 border-red-500 bg-red-50 p-4"
      >
        <p className="text-sm text-red-700">{error}</p>
        <div className="mt-3">
          <button
            onClick={() => fetchForm()}
            className="rounded bg-white border px-3 py-1 text-sm focus:outline-none focus:ring"
          >
            Retry
          </button>
        </div>
      </div>
    );

  if (!form) return <div className="text-gray-600">Form not found.</div>;

  const statusBadge = () => {
    if (form.status === "active")
      return (
        <span className="inline-flex items-center rounded bg-green-100 px-2 py-1 text-sm font-medium text-green-800">
          Active
        </span>
      );
    if (form.status === "draft")
      return (
        <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-sm font-medium text-gray-800">
          Draft
        </span>
      );
    return (
      <span className="inline-flex items-center rounded bg-yellow-100 px-2 py-1 text-sm font-medium text-yellow-800">
        Archived
      </span>
    );
  };

  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/forms"
          className="rounded border px-3 py-1 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          ← Back
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-2">{form.title}</h1>
      <div className="flex items-center gap-3 mb-4">
        {statusBadge()}
        <div className="text-sm text-gray-500">
          Last updated: {new Date(form.updatedAt).toLocaleString()}
        </div>
      </div>

      <p className="text-gray-700 mb-6 whitespace-pre-wrap">
        {form.description}
      </p>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
        <div>
          <dt className="text-sm text-gray-500">Fields</dt>
          <dd className="mt-1 text-sm text-gray-900">{form.fieldsCount}</dd>
        </div>

        <div>
          <dt className="text-sm text-gray-500">Status</dt>
          <dd className="mt-1 text-sm text-gray-900">{form.status}</dd>
        </div>
      </dl>
    </section>
  );
}
