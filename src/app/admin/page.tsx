// app/admin/page.tsx
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="container mx-auto max-w-5xl p-6">
      <AdminClient />
    </div>
  );
}
