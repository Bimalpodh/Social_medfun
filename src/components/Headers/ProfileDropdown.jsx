
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Settings,
  LogOut,
  ChevronDown,
  UserCircle,
  CreditCard,
  Moon,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

export default function ProfileDropdown() {
  const { currentUser, logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!currentUser) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-2 py-1.5 rounded-2xl bg-white hover:bg-slate-800/70 border border-slate-700/50 hover:border-cyan-500/40 transition-all duration-300 group"
      >
        <div className="relative">
          {currentUser.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-slate-700"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {getInitials(
                currentUser.name || currentUser.username
              )}
            </div>
          )}

          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
        </div>

        <div className="hidden xl:flex flex-col items-start min-w-[120px]">
          <span className="text-sm font-semibold text-cyan-900 leading-none">
            {currentUser.name}
          </span>

          <span className="text-xs text-slate-400 mt-1">
            @{currentUser.username}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`hidden sm:block text-slate-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl z-50"
          >
            {/* Top */}
            <div className="p-5 border-b border-slate-800">
              <div className="flex items-center gap-4">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(currentUser.name)}
                  </div>
                )}

                <div className="overflow-hidden">
                  <p className="text-white font-bold truncate">
                    {currentUser.name}
                  </p>

                  <p className="text-sm text-slate-400 truncate">
                    @{currentUser.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="p-2">
              <MenuLink
                to="/profile"
                icon={<UserCircle size={18} />}
                label="My Profile"
                onClick={() => setIsOpen(false)}
              />

              <MenuLink
                to="/settings"
                icon={<Settings size={18} />}
                label="Settings"
                onClick={() => setIsOpen(false)}
              />

              <MenuLink
                to="/wallet"
                icon={<CreditCard size={18} />}
                label="Wallet"
                onClick={() => setIsOpen(false)}
              />

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-800 transition-all">
                <Moon size={18} />
                <span className="text-sm">Dark Mode</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuLink({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
          isActive
            ? "bg-cyan-500/10 text-cyan-400"
            : "text-slate-300 hover:bg-slate-800"
        }`
      }
    >
      {icon}

      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}