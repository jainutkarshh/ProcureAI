"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { KpiCards } from "@/components/kpi-cards";
import { Charts } from "@/components/charts";
import { AiInsights } from "@/components/ai-insights";
import { PredictionForm } from "@/components/prediction-form";
import { AiChat } from "@/components/ai-chat";
import { VendorHistory } from "@/components/vendor-history";
import { UploadCloud, Activity, Target, BrainCircuit, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activeTab, setActiveTab] = useState("upload");
  const [metrics, setMetrics] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDataAnalyzed = (data: any) => {
    setMetrics(data.metrics);
    setAnalysis(data.gemini_analysis);
    setActiveTab("insights"); // Automatically switch to insights
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Header spacing */}
      <div className="pt-28 lg:pt-36 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-8" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === "upload" && (
              <Hero 
                onAnalyze={handleDataAnalyzed} 
                loading={loading} 
                setLoading={setLoading} 
                setError={setError}
                onViewAnalytics={() => setActiveTab("insights")} 
              />
            )}

            {activeTab === "insights" && metrics && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <KpiCards metrics={metrics} />
                <Charts metrics={metrics} />
                <AiInsights analysis={analysis} />
              </div>
            )}

            {activeTab === "predict" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                <PredictionForm />
              </div>
            )}

            {activeTab === "chat" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                <AiChat metrics={metrics} />
              </div>
            )}

            {activeTab === "vendor" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <VendorHistory />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto max-w-7xl w-full mx-auto px-6 py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center">
              <span className="text-slate-500 text-xs font-bold">AI</span>
            </div>
            <span className="font-display font-medium text-slate-600">ProcureAI Intelligence</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-brand-blue transition-colors">API Docs</a>
            <a href="#" className="hover:text-brand-blue transition-colors">Security</a>
            <a href="#" className="hover:text-brand-blue transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
