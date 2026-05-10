
import React, { useState, useEffect } from "react";
import {
  Bell,
  PlusSquare,
  Menu,
  X,
  Search,
  Heart,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import CreatePostModal from "../post/CreatePostModal";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useSearch } from "../../hooks/useSearch";
import { useNotifications } from "../../hooks/useNotifications";
import ProfileDropdown from "./ProfileDropdown";
import { getAvatarFallback } from "../../services/userService";

export default function Header() {
  const { logout } = useAuth();
  const { searchTerm, setSearchTerm, results, loading, clearSearch } =
    useSearch(300);

  const { notifications } = useNotifications();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Feed", to: "/feed" },
    { name: "Explore", to: "/explore" },
    { name: "Messages", to: "/messages" },
    { name: "Saved", to: "/saved" },
    { name: "Profile", to: "/profile" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800 shadow-lg"
            : "bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-4">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <NavLink
                to="/"
                className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent tracking-tight"
              >
                SocialNest
              </NavLink>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-xl relative z-50">
              <div className="flex items-center bg-slate-800/70 rounded-2xl px-4 py-3 border border-slate-700 w-full focus-within:border-cyan-500 transition-all">
                <Search
                  size={18}
                  className="text-slate-400 flex-shrink-0"
                />

                <input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent ml-3 text-sm outline-none w-full text-slate-100 placeholder-slate-500"
                />

                {loading && (
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {searchTerm && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-16 w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <div className="max-h-[350px] overflow-y-auto">
                      {results.length > 0 ? (
                        results.map((user) => (
                          <div
                            key={user.uid || user.id}
                            onClick={() => {
                              clearSearch();
                              navigate("/profile");
                            }}
                            className="flex items-center gap-3 p-4 hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <img
                              src={
                                user.profileImage ||
                                user.avatar ||
                                getAvatarFallback(
                                  user.username || user.uid
                                )
                              }
                              alt={user.username}
                              className="w-11 h-11 rounded-full object-cover border border-slate-700"
                            />

                            <div>
                              <p className="text-white font-semibold">
                                {user.username}
                              </p>

                              <p className="text-xs text-slate-400">
                                {user.name}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-5 text-center text-slate-500 text-sm">
                          No users found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Create */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-semibold hover:scale-105 transition-all"
              >
                <PlusSquare size={18} />
                Create
              </button>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() =>
                    setIsNotificationsOpen(!isNotificationsOpen)
                  }
                  className="relative p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-all"
                >
                  <Bell size={20} className="text-slate-300" />

                  {notifications.some((n) => !n.read) && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-400 rounded-full"></span>
                  )}
                </button>

                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-[360px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-800">
                        <h3 className="text-white font-bold">
                          Notifications
                        </h3>
                      </div>

                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className="flex gap-3 p-4 hover:bg-slate-800/50 transition"
                            >
                              <img
                                src={
                                  notif.avatar ||
                                  "https://i.pravatar.cc/150"
                                }
                                alt={notif.user}
                                className="w-10 h-10 rounded-full object-cover"
                              />

                              <div className="flex-1">
                                <p className="text-sm text-slate-300">
                                  <span className="font-semibold text-white">
                                    {notif.user}
                                  </span>{" "}
                                  {notif.action}
                                </p>

                                <p className="text-xs text-slate-500 mt-1">
                                  Just now
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-slate-500 text-sm">
                            No notifications
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile */}
              <ProfileDropdown />

              {/* Mobile */}
              <button
                className="md:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-800 p-4 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800"
              >
                {link.name}
              </NavLink>
            ))}

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}