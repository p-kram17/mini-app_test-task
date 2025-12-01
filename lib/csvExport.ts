import type { Form } from "./formSchema";

/**
 * Export forms data to CSV file
 * @param forms - Array of forms to export
 * @param filename - Name of the CSV file (default: forms-export.csv)
 */
export function exportToCSV(forms: Form[], filename = "forms-export.csv") {
  if (!forms || forms.length === 0) {
    throw new Error("No forms to export");
  }

  // Define CSV headers
  const headers = [
    "ID",
    "Title",
    "Description",
    "Fields Count",
    "Status",
    "Updated At",
  ];

  // Convert forms to CSV rows
  const rows = forms.map((form) => [
    form.id,
    `"${(form.title || "").replace(/"/g, '""')}"`, // Escape quotes
    `"${(form.description || "").replace(/"/g, '""')}"`,
    form.fieldsCount.toString(),
    form.status,
    new Date(form.updatedAt).toISOString(),
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
