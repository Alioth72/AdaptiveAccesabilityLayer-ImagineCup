import React from "react";
import { Bell, Zap, Search } from "lucide-react";

export function Header() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display">
          Welcome back, <span className="text-[#247BA0]">Student</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your studies today
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 w-56 transition-all"
          />
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#247BA0]/20 to-[#247BA0]/20 border border-white/10">
          <Zap className="h-5 w-5 text-accent" />
          <span className="font-bold font-display">420 XP</span>
        </div>

        {/* Notification Bell */}
        <button className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
          <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full animate-pulse" />
        </button>
      </div>
    </div>
  );
}
