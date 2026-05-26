"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { UploadCloud, ArrowRight, Activity, ShieldAlert, Clock, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeroProps {
  onAnalyze: (data: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  onViewAnalytics?: () => void;
}

export function Hero({ onAnalyze, loading, setLoading, setError, onViewAnalytics }: HeroProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`http://localhost:8000/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Analysis failed. Please make sure the backend is running.');
      
      const data = await response.json();
      onAnalyze(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
      // Reset input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-purple/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs sm:text-sm font-medium mb-6 lg:mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-purple opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-purple"></span>
              </span>
              Enterprise AI Intelligence
            </motion.div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Turn Procurement Bottlenecks Into <br className="hidden lg:block" />
              <span className="text-gradient">AI-Driven Decisions</span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 mb-8 lg:mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Analyze PR approval delays, predict SLA breaches, and uncover vendor risks using AI-powered procurement intelligence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <button 
                onClick={handleUploadClick} 
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-blue text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium shadow-lg shadow-brand-blue/25 hover:shadow-xl hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <UploadCloud className="w-5 h-5" />
                {loading ? 'Analyzing Data...' : 'Upload CSV Data'}
              </button>
              <button 
                onClick={onViewAnalytics} 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 cursor-pointer"
              >
                View Analytics
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-10 lg:mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                <span>SOC2 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-blue" />
                <span>99.9% Accuracy</span>
              </div>
            </div>
          </motion.div>

          {/* Right Floating Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 15, rotateY: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="relative h-[350px] sm:h-[450px] lg:h-[600px] w-full perspective-1000 mt-8 lg:mt-0"
            style={{ perspective: "1000px" }}
          >
            {/* Main Center Card */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute inset-0 m-auto w-[95%] sm:w-[85%] lg:w-[90%] h-[80%] lg:h-[70%] glass-panel rounded-2xl p-4 lg:p-6 z-20 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4 lg:mb-8">
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm sm:text-base">SLA Breach Prediction</h3>
                  <p className="text-xs sm:text-sm text-slate-500">Real-time AI analysis</p>
                </div>
                <div className="p-1.5 sm:p-2 bg-rose-100 rounded-lg">
                  <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                </div>
              </div>
              
              <div className="flex-1 border-b border-slate-100 relative min-h-[80px]">
                {/* Mock Chart Area */}
                <svg className="w-full h-full text-brand-blue opacity-50" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path d="M0,50 L0,30 C20,40 30,10 50,20 C70,30 80,5 100,15 L100,50 Z" fill="currentColor" fillOpacity="0.1" />
                  <path d="M0,30 C20,40 30,10 50,20 C70,30 80,5 100,15" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              
              <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-mono font-bold text-slate-900">12.4%</p>
                  <p className="text-xs sm:text-sm text-emerald-600 font-medium">↓ 2.1% from last month</p>
                </div>
                <button onClick={handleUploadClick} className="text-xs sm:text-sm font-medium text-brand-blue bg-blue-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg cursor-pointer">Analyze</button>
              </div>
            </motion.div>

            {/* Floating Top Card */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute top-[0%] lg:top-[5%] right-[-2%] lg:right-[-5%] w-[65%] lg:w-[60%] glass-panel rounded-xl p-3 lg:p-4 z-30 shadow-2xl shadow-brand-purple/20"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-[10px] lg:text-xs text-slate-500 font-medium uppercase tracking-wider">Avg Cycle Time</p>
                  <p className="text-lg lg:text-xl font-mono font-bold text-slate-900">4.2 Days</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Bottom Card */}
            <motion.div
              animate={{ y: [-15, 15, -15], x: [5, -5, 5] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[0%] lg:bottom-[5%] left-[-5%] lg:left-[-10%] w-[65%] lg:w-[50%] glass-panel rounded-xl p-3 lg:p-4 z-30 shadow-2xl shadow-brand-blue/20 border-l-4 border-l-brand-purple"
            >
              <p className="text-[10px] lg:text-xs text-brand-purple font-medium uppercase tracking-wider mb-0.5 lg:mb-1">AI Recommendation</p>
              <p className="text-xs lg:text-sm text-slate-700 font-medium leading-snug">
                Bypass Level 3 approval for POs under $5k to save 1.2 days.
              </p>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
