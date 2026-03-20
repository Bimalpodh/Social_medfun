import Header from "../Headers/Header";
import Sidebar from "../sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Header stays z-50 to stay on top */}
      <Header />

      {/* Main Container - added pt-16 to push everything below fixed header */}
      <div className=" mx-auto flex pt-16">
        
        {/* Sidebar now starts exactly at the bottom of the header */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 min-w-0 bg-slate-950 min-h-[calc(100vh-64px)] overflow-x-hidden">
          <div className="p-6 lg:p-10 relative z-10">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}