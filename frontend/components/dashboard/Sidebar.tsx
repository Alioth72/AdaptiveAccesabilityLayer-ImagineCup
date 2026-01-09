import React from "react";
import {
    Home,
    Trophy,
    Target,
    Crown,
    User,
    Settings,
    LogOut,
    Menu,
} from "lucide-react";

const topItems = [
    { name: "Home", icon: Home },
    { name: "Achievements", icon: Trophy },
    { name: "Goals", icon: Target },
    { name: "Leaderboard", icon: Crown },
    { name: "Profile", icon: User },
];

const bottomItems = [
    { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
];

interface SidebarProps {
    active: string;
    setActive: (name: string) => void;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
}

export function Sidebar({ active, setActive, expanded, setExpanded }: SidebarProps) {
    return (
        <div
            className={`glass rounded-2xl p-4 flex flex-col transition-all duration-300 ${expanded ? "w-64" : "w-20"
                }`}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-12 h-12 flex items-center justify-center mb-6 rounded-xl hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
                title="Toggle Sidebar"
            >
                <Menu size={24} />
            </button>

            {/* Top Items */}
            <div className="flex flex-col items-center gap-2">
                {topItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = active === item.name;

                    return (
                        <button
                            key={item.name}
                            onClick={() => setActive(item.name)}
                            className={`
                flex items-center gap-4 rounded-xl transition-all duration-200
                ${isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                                    : "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                                }
                ${expanded ? "px-4 py-3 w-full justify-start" : "w-12 h-12 justify-center"}
              `}
                        >
                            <Icon size={22} />
                            {expanded && <span className="font-medium">{item.name}</span>}
                        </button>
                    );
                })}
            </div>

            {/* Spacer */}
            <div className="flex-grow" />

            {/* Bottom Items */}
            <div className="flex flex-col items-center gap-2">
                {bottomItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.name}
                            onClick={() => setActive(item.name)}
                            className={`
                flex items-center gap-4 rounded-xl transition-all duration-200
                hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground
                ${expanded ? "px-4 py-3 w-full justify-start" : "w-12 h-12 justify-center"}
              `}
                        >
                            <Icon size={22} />
                            {expanded && <span className="font-medium">{item.name}</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
