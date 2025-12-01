"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, type Form } from "../lib/formSchema";
import { z } from "zod";
import useClientStore from "../lib/clientStore";

const clientSchema = formSchema.omit({ id: true, updatedAt: true });
type ClientForm = z.infer<typeof clientSchema>;

type Props = { initial?: Form | null; mode: "new" | "edit" };

export default function FormEditor({ initial, mode }: Props) {
  const router = useRouter();
  const addToast = useClientStore((s) => s.addToast);

  const { register, handleSubmit, formState, setError } = useForm<ClientForm>({
    resolver: zodResolver(clientSchema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description ?? "",
          fieldsCount: initial.fieldsCount,
          status: initial.status,
        }
      : { title: "", description: "", fieldsCount: 0, status: "draft" },
  });

  async function onSubmit(values: ClientForm) {
    try {
      const url = mode === "new" ? "/api/forms" : `/api/forms/${initial?.id}`;
      const method = mode === "new" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        addToast(data?.error || "Failed to save");
        return;
      }
      addToast("Saved");
      router.push("/forms");
    } catch (err: any) {
      addToast(err?.message || "Error");
    }
  }

  async function onDelete() {
    if (!initial?.id) return;
    if (!confirm("Delete this form?")) return;
    try {
      const res = await fetch(`/api/forms/${initial.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        addToast(data?.error || "Failed to delete");
        return;
      }
      addToast("Deleted");
      router.push("/forms");
    } catch (err: any) {
      addToast(err?.message || "Error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          {...register("title")}
          aria-required="true"
          className="mt-1 w-full rounded border px-3 py-2 focus:outline-none"
        />
        {formState.errors.title && (
          <p className="text-sm text-red-600">
            {formState.errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          className="mt-1 w-full rounded border px-3 py-2 focus:outline-none"
        />
        {formState.errors.description && (
          <p className="text-sm text-red-600">
            {formState.errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="fieldsCount" className="block text-sm font-medium">
          Fields Count
        </label>
        <input
          id="fieldsCount"
          type="number"
          {...register("fieldsCount", { valueAsNumber: true })}
          className="mt-1 w-32 rounded border px-3 py-2 focus:outline-none"
        />
        {formState.errors.fieldsCount && (
          <p className="text-sm text-red-600">
            {formState.errors.fieldsCount.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="mt-1 rounded border px-3 py-2 focus:outline-none"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        {formState.errors.status && (
          <p className="text-sm text-red-600">
            {formState.errors.status.message}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          aria-label={mode === "new" ? "Create form" : "Save form"}
          className="rounded bg-blue-600 px-4 py-2 text-white focus:outline-none"
        >
          {mode === "new" ? "Create" : "Save"}
        </button>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onDelete}
            aria-label="Delete form"
            className="rounded border px-4 py-2 text-red-600 focus:outline-none"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
