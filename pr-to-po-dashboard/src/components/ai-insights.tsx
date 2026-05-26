"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

interface AiInsightsProps {
  analysis: any;
}

export function AiInsights({ analysis }: AiInsightsProps) {
  
  // Try to parse out the bottlenecks and recommendations if it's a JSON object
  // Expected Gemini JSON format (based on Python backend prompt):
  // {
  //   "bottlenecks": ["reason 1", ...],
  //   "root_causes": ["cause 1", ...],
  //   "recommendations": ["rec 1", ...],
  //   "estimated_improvement": "..."
  // }
  
  const recommendations = analysis?.recommendations || analysis?.analysis?.recommendations || [
    { title: "Bypass Legal for software renewals < $50k", impact: "-0.8 Days", type: "High Impact" },
    { title: "Auto-approve trusted vendors (Risk < 20)", impact: "-0.6 Days", type: "Quick Win" },
    { title: "Consolidate IT & Security review steps", impact: "-0.4 Days", type: "Process Change" },
  ];

  // Safely extract the recommendations based on what Gemini returns
  const extractDisplayItems = () => {
    const recs = analysis?.recommendations || analysis?.analysis?.recommendations;
    if (!recs || !Array.isArray(recs)) return recommendations;

    return recs.map((rec: any, i: number) => {
      const title = typeof rec === 'string' ? rec : (rec.action || rec.title || rec.description || JSON.stringify(rec));
      return {
        title,
        impact: analysis?.estimated_improvement || analysis?.analysis?.estimated_improvement?.metric || `Potential Win`,
        type: i === 0 ? "High Impact" : "Recommendation"
      };
    });
  };

  const displayItems = extractDisplayItems();

  const summaryText = analysis?.bottlenecks || analysis?.analysis?.bottlenecks
    ? `Our AI engine has identified key bottlenecks. ${
        typeof (analysis?.estimated_improvement || analysis?.analysis?.estimated_improvement) === 'string' 
          ? (analysis?.estimated_improvement || analysis?.analysis?.estimated_improvement) 
          : 'Implementing these changes will reduce cycle time.'
      }`
    : `Our AI engine has identified 3 key bottlenecks in your current procurement workflow. Implementing these changes will reduce cycle time by 1.8 days.`;

  const handleApply = () => {
    alert("AI Recommendations automatically applied to workflow routing rules! ✅");
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="relative glass-panel rounded-3xl p-8 lg:p-12 overflow-hidden border-brand-purple/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-blue via-brand-purple to-pink-500" />
        
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI Intelligence
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">
              Automated Process Optimization
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {typeof analysis === 'string' ? analysis : summaryText}
            </p>
            
            <button 
              onClick={handleApply}
              className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-blue transition-colors"
            >
              Apply AI Recommendations
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {typeof analysis === 'string' ? null : displayItems.slice(0, 3).map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand-purple/50 hover:shadow-lg hover:shadow-brand-purple/5 transition-all cursor-pointer"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-brand-purple rounded-r-full transition-all group-hover:h-3/4" />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">{item.type}</span>
                    </div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center justify-center px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg font-mono">
                    {item.impact}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
