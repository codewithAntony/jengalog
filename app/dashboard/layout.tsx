import InactivityLogout from "../components/admin/InactivityLogout";
import ClientHeader from "../components/client/ClientHeader";
import ClientSidebar from "../components/client/ClientSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InactivityLogout>
      <div className="flex h-screen bg-[#121212] overflow-hidden">
        <ClientSidebar />
        <div className="flex flex-col flex-1">
          <ClientHeader />

          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </InactivityLogout>
  );
}
