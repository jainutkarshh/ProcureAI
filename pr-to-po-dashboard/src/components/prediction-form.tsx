"use client";

import { useState } from "react";
import { Calculator, AlertTriangle, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export function PredictionForm() {
  const [prData, setPrData] = useState({
    pr_number: 'PR-2025-001',
    amount: 25000,
    category: 'direct',
    approver: 'John Smith',
    day_of_week: 'Monday',
    vendor_type: 'approved',
    description: 'Compressor units for HVAC assembly'
  });
  
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pr_data: prData })
      });
      
      if (!response.ok) throw new Error('Prediction failed');
      
      const data = await response.json();
      setPrediction(data);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900">SLA Breach Predictor</h3>
          <p className="text-sm text-slate-500">ML model predicts delay risk for new PRs</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount ($)</label>
            <input 
              type="number"
              value={prData.amount}
              onChange={(e) => setPrData({...prData, amount: parseFloat(e.target.value) || 0})}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</label>
            <select 
              value={prData.category}
              onChange={(e) => setPrData({...prData, category: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            >
              <option value="direct">Direct</option>
              <option value="indirect">Indirect</option>
              <option value="capex">Capex</option>
              <option value="mro">MRO</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Approver</label>
            <input 
              type="text"
              value={prData.approver}
              onChange={(e) => setPrData({...prData, approver: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Vendor</label>
            <select 
              value={prData.vendor_type}
              onChange={(e) => setPrData({...prData, vendor_type: e.target.value})}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
            >
              <option value="new">New</option>
              <option value="approved">Approved</option>
              <option value="sole-source">Sole-Source</option>
            </select>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {prediction ? (
        <div className={`p-5 rounded-2xl border ${
          prediction.severity === 'HIGH' ? 'bg-rose-50 border-rose-200' :
          prediction.severity === 'MEDIUM' ? 'bg-orange-50 border-orange-200' :
          'bg-emerald-50 border-emerald-200'
        } mb-6`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {prediction.severity === 'HIGH' ? <AlertTriangle className="w-5 h-5 text-rose-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              <span className={`font-bold ${
                prediction.severity === 'HIGH' ? 'text-rose-700' :
                prediction.severity === 'MEDIUM' ? 'text-orange-700' :
                'text-emerald-700'
              }`}>{prediction.delay_probability_pct}% Delay Risk</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-white/50 rounded-md uppercase tracking-wide">
              {prediction.recommended_action.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">
            {prediction.explanation}
          </p>
          <button 
            onClick={() => setPrediction(null)}
            className="mt-4 text-sm font-semibold text-slate-600 hover:text-slate-900 underline underline-offset-2"
          >
            Predict Another
          </button>
        </div>
      ) : (
        <button 
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-brand-blue transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Calculator className="w-4 h-4" /> Run Prediction Model <ArrowRight className="w-4 h-4" /></>}
        </button>
      )}
    </div>
  );
}
