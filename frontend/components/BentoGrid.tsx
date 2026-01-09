"use client";

import React from "react";
import {
  Mail,
  Users,
  FileSpreadsheet,
  BarChart3,
  ShieldAlert,
  Bot,
  BrainCircuit,
  Zap,
  Search,
} from "lucide-react";

type BentoCardProps = {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  className?: string;
  bgContent?: React.ReactNode;
};

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  description,
  icon,
  className = "",
  bgContent,
}) => (
  <div
    className={`relative overflow-hidden rounded-3xl border border-gray-200 p-8 hover:shadow-lg transition-shadow duration-300 group ${className}`}
  >
    <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
      <div className="mb-8">
        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 text-gray-900 shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <div className="text-gray-500 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
    {bgContent}
  </div>
);

const BentoGrid: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">
            Everything you need to <br />
            <span className="text-gray-500">
              automate corporate outreach.
            </span>
          </h2>
          <p className="text-lg text-gray-600">
            CorpoMailer provides the agentic infrastructure for safe,
            personalized, and high-volume email campaigns. Combine AI autonomy
            with human oversight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Human-in-the-loop */}
          <BentoCard
            title="Human-in-the-Loop"
            description={
              <span className="block md:max-w-[50%]">
                Strict governance. Agents draft campaigns, Humans review them.
                Edit, reject, or approve AI-generated emails before they send.
              </span>
            }
            icon={<ShieldAlert size={20} />}
            className="md:col-span-2 bg-[#e3f4fc]"
            bgContent={
              <div className="absolute right-0 bottom-0 w-[260px] md:w-[320px] h-[180px] md:h-[220px] translate-x-8 translate-y-8 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform duration-500">
                <div className="bg-white rounded-tl-2xl border-t border-l border-gray-200 shadow-xl p-5 h-full flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded">
                      WAITING FOR HUMAN
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Agent: Sales-Bot-01
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-1.5 w-full bg-gray-100 rounded" />
                    <div className="h-1.5 w-5/6 bg-gray-100 rounded" />
                    <div className="h-1.5 w-4/6 bg-gray-100 rounded" />
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className="bg-black text-white text-[10px] px-3 py-1.5 rounded hover:bg-gray-800 transition-colors">
                      Approve
                    </button>
                    <button className="bg-white border border-gray-200 text-[10px] px-3 py-1.5 rounded hover:bg-gray-50 transition-colors">
                      Rewrite
                    </button>
                  </div>
                </div>
              </div>
            }
          />

          <BentoCard
            title="Bulk CSV Import"
            description="Upload a CSV with up to 500 contacts. Auto-map columns for Agents to use as context."
            icon={<FileSpreadsheet size={20} />}
            className="bg-[#c5ed4c]/40 text-white"
          />

          {/* Autonomous agents */}
          <div className="relative overflow-hidden rounded-3xl bg-[#C0BDF2]/50 border border-blue-100 p-8 hover:shadow-lg transition-shadow duration-300 group md:row-span-2">
            <div className="relative z-10 flex flex-col h-full justify-between pointer-events-none">
              <div className="mb-8">
                <div className="w-10 h-10 rounded-full bg-[#5B2A86] border border-gray-700 flex items-center justify-center mb-4 text-white shadow-sm">
                  <Bot size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Autonomous Research
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Deploy agents to scout LinkedIn, News, and Company pages to
                  find the perfect leads automatically.
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4 font-mono text-xs">
                {[
                  "Scanning YC W24 batch...",
                  "Found 12 matches for 'SaaS'",
                  "Analyzing LinkedIn profiles...",
                  "Drafting personalized intros...",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-gray-100/50 rounded-lg border border-blue-300/50"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <div className="text-gray-700">{text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <BentoCard
            title="Hyper-Personalization"
            description="Agents read the prospect's latest posts and company news to write 1-of-1 emails."
            icon={<BrainCircuit size={20} />}
          />

          <BentoCard
            title="Agent Teams"
            description="Organize agents into squads: Researchers, Copywriters, and Closers."
            icon={<Users size={20} />}
            className="bg-gray-300/50"
          />

          <BentoCard
            title="Performance Learning"
            description={
              <span className="block md:max-w-[50%] text-white">
                Agents learn from reply rates in real-time and iterate
                automatically.
              </span>
            }
            icon={<BarChart3 size={20} />}
            className="md:col-span-2 bg-[#5baccf]/70"
          />
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
