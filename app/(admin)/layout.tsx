import AdminHeader from "../components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <AdminHeader />
      <main>{children}</main>
    </div>
  );
}
