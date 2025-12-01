import FormEditor from "../../../components/FormEditor";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function NewFormPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session) {
    redirect(`/login?from=/forms/new`);
  }
  if (role !== "Admin") {
    redirect(`/forms`);
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">New Form</h1>
      <FormEditor mode="new" />
    </section>
  );
}
