import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import InactivityLogout from "../components/admin/InactivityLogout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InactivityLogout>
      <div className="flex h-screen bg-[#121212] overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AdminHeader />

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </InactivityLogout>
  );
}
