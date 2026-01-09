"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { LucideIcon, Home, User, Briefcase, FileText, Lock } from "lucide-react";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
}

export function NavBar({ items, className = "" }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={
        `fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6 ` +
        className
      }
    >
      <div className="flex items-center justify-center gap-3 h-[7vh] w-[40vw] max-w-[700px] bg-background/5 border border-gray-200 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;
          const isLogin = item.name === "Login";

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={
                isLogin
                  ? `relative cursor-pointer text-md font-semibold px-6 py-2 rounded-full transition-colors 
                     bg-[#74b899] text-white hover:bg-[#9AB893]`
                  : `relative cursor-pointer text-md font-semibold px-6 py-2 rounded-full transition-colors
                     text-foreground/80 hover:text-[#aad99c] ` +
                    (isActive ? "bg-muted text-[#D9D9D9] " : "")
              }
            >
              <span className="hidden md:inline">{item.name}</span>

              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>

              {/* Lamp animation — only for NON-LOGIN tabs */}
              {!isLogin && isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-[#A8C3A0]/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#A8C3A0] rounded-t-full">
                    <div className="absolute w-12 h-6 bg-bg-[#A8C3A0]/30 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-bg-[#A8C3A0]/25 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-bg-[#A8C3A0]/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* -----------------------------
   ADD THIS BELOW
------------------------------ */

export function NavBarDemo() {
  const navItems = [
    { name: "Home", url: "#home", icon: Home },
    { name: "Features", url: "#features", icon: User },
    { name: "Admin", url: "#details", icon: Briefcase },
    { name: "Contact", url: "#contact", icon: FileText },
    { name: "Login", url: "/login", icon: Lock }
  ];

  return <NavBar items={navItems} />;
}
