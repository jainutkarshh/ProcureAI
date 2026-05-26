"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Code, Activity, BrainCircuit, Users, Target, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const navItems = [
  { id: "upload", name: "Upload", icon: UploadCloud },
  { id: "insights", name: "Insights", icon: Activity },
  { id: "predict", name: "Predictions", icon: Target },
  { id: "vendor", name: "Vendor Intelligence", icon: Users },
  { id: "chat", name: "AI Assistant", icon: BrainCircuit },
];

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    if (setActiveTab) setActiveTab(id);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 flex items-center justify-center pt-6 px-4 transition-all duration-500",
        scrolled ? "pt-4" : "pt-6"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between w-full max-w-7xl px-4 lg:px-6 py-3 rounded-2xl transition-all duration-500",
          scrolled ? "glass-panel" : "bg-transparent"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center shadow-lg shrink-0">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight hidden sm:block text-slate-900">ProcureAI</span>
        </div>

        {/* Center Nav */}
        <nav className="hidden xl:flex items-center gap-1 bg-white/50 rounded-full p-1 border border-slate-200 backdrop-blur-md shadow-sm">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                activeTab === item.id 
                  ? "bg-brand-blue text-white shadow-md"
                  : "text-slate-600 hover:text-brand-blue hover:bg-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="hidden md:block text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            Demo Data
          </button>
          <button 
            onClick={() => handleNavClick('upload')}
            className="flex items-center gap-2 bg-brand-dark text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-sm font-medium hover:bg-brand-blue hover:shadow-lg hover:shadow-brand-blue/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <UploadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Upload CSV</span>
            <span className="sm:hidden">Upload</span>
          </button>
          <button className="hidden md:block p-2 text-slate-400 hover:text-slate-900 transition-colors">
            <Code className="w-5 h-5" />
          </button>
          <button className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
