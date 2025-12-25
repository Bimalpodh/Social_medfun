
 import Header from "../Headers/Header"
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header */}
      <Header/>

      {/* Page Content */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
