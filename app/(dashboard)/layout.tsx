import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#F5F4EF] px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
