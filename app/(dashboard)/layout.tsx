import Sidebar from "@/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-[#F5F4EF] px-8 py-8">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
