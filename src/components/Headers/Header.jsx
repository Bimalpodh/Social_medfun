import React, { useState, useEffect } from "react";
import { Home, Compass, User, Bell, PlusSquare, Menu, X, Search } from "lucide-react";

export default function EnhancedHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow on scroll for depth
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Feed", href: "/feed", icon: <Home size={20} /> },
    { name: "Explore", href: "/stories", icon: <Compass size={20} /> },
    { name: "Notifications", href: "/notifications", icon: <Bell size={20} /> },
    { name: "Profile", href: "/profile", icon: <User size={20} /> },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50" : "bg-white"
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Search */}
          <div className="flex items-center gap-8">
            <a href="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              SocialNest
            </a>
            
            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-3 py-1.5 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 ml-2 outline-none"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-4" aria-label="Primary">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium"
              >
                {link.icon}
                <span className="text-sm">{link.name}</span>
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
            >
              <PlusSquare size={18} />
              <span>Create</span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 hidden md:block mx-1"></div>

            <a href="/profile" className="relative group">
              <div className="w-9 h-9 rounded-full ring-2 ring-transparent group-hover:ring-indigo-500 transition-all p-0.5">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover bg-slate-100"
                />
              </div>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      <div className={`md:hidden absolute w-full bg-white border-b border-slate-200 transition-all duration-300 ease-in-out ${
        menuOpen ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden"
      }`}>
        <div className="px-4 space-y-2">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </a>
          ))}
          <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-xl font-bold">
            <PlusSquare size={20} />
            New Post
          </button>
        </div>
      </div>
    </header>
  );
}