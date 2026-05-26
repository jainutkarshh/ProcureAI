"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, TrendingDown, TrendingUp, Search, AlertCircle, ArrowLeft, Database, Activity, Target } from "lucide-react";

export function VendorHistory() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [vendorDetails, setVendorDetails] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/vendors`);
      if (!response.ok) throw new Error("Failed to load vendors");
      const data = await response.json();
      setVendors(data.vendors || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/retrain`, { method: "POST" });
      if (!response.ok) throw new Error("Retrain failed");
      alert("Model retrained successfully!");
    } catch (err: any) {
      alert("Error retraining model: " + err.message);
    }
  };

  const loadVendorDetails = async (vendorName: string) => {
    setDetailsLoading(true);
    setSelectedVendor(vendorName);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/vendors/${encodeURIComponent(vendorName)}`);
      if (!response.ok) throw new Error("Failed to load vendor details");
      const data = await response.json();
      setVendorDetails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !selectedVendor) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500">
        <Activity className="w-8 h-8 animate-pulse mb-4 text-brand-purple" />
        <p>Loading Vendor Intelligence...</p>
      </div>
    );
  }

  // --- VENDOR DETAILS VIEW ---
  if (selectedVendor) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => { setSelectedVendor(null); setVendorDetails(null); }}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-blue transition-colors px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all vendors
        </button>

        {detailsLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Activity className="w-8 h-8 animate-pulse mb-4 text-brand-blue" />
            <p>Loading {selectedVendor} history...</p>
          </div>
        ) : vendorDetails ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold font-display text-slate-900">{selectedVendor} — Full History</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 rounded-2xl p-6 border-l-4 border-l-brand-blue">
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Current Score</p>
                <p className="text-5xl font-mono font-bold text-slate-900">{vendorDetails.latest_score?.score || "N/A"}</p>
              </div>
              <div className={`glass-card rounded-2xl p-6 border-l-4 ${
                vendorDetails.latest_score?.risk_level === 'HIGH' ? 'bg-rose-50 border-l-rose-500' :
                vendorDetails.latest_score?.risk_level === 'MEDIUM' ? 'bg-orange-50 border-l-orange-500' :
                'bg-emerald-50 border-l-emerald-500'
              }`}>
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Risk Level</p>
                <p className={`text-5xl font-mono font-bold ${
                  vendorDetails.latest_score?.risk_level === 'HIGH' ? 'text-rose-600' :
                  vendorDetails.latest_score?.risk_level === 'MEDIUM' ? 'text-orange-600' :
                  'text-emerald-600'
                }`}>{vendorDetails.latest_score?.risk_level || "UNKNOWN"}</p>
              </div>
              <div className="glass-card rounded-2xl p-6 border-l-4 border-l-brand-purple">
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Avg Cycle Time</p>
                <p className="text-5xl font-mono font-bold text-slate-900">{vendorDetails.latest_score?.avg_cycle_hours || 0}h</p>
              </div>
              <div className="glass-card rounded-2xl p-6 md:col-span-1">
                <p className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Total PRs Recorded</p>
                <p className="text-5xl font-mono font-bold text-slate-900">{vendorDetails.total_prs_recorded}</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden mt-8">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-semibold text-slate-800">All PRs from {selectedVendor}</h3>
              </div>
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-6 py-4 font-semibold">PR Number</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Submitted</th>
                      <th className="px-6 py-4 font-semibold">Approved</th>
                      <th className="px-6 py-4 font-semibold">Cycle Time</th>
                      <th className="px-6 py-4 font-semibold text-center">SLA Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {vendorDetails.pr_history?.map((pr: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-slate-900">{pr.pr_number}</td>
                        <td className="px-6 py-4 text-slate-600">${pr.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 text-slate-600">{pr.category}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{pr.submitted_date}</td>
                        <td className="px-6 py-4 text-slate-500 text-xs">{pr.approved_date}</td>
                        <td className="px-6 py-4 font-mono text-slate-700">{pr.cycle_time_hours}h</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            pr.sla_breached ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {pr.sla_breached ? "BREACHED" : "ON TIME"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-red-500">Failed to load details.</div>
        )}
      </div>
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="space-y-8">
      {/* Retrain Model Widget (matching screenshot) */}
      <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border-brand-blue/20">
        <div className="flex items-center gap-6 text-sm text-slate-600 flex-wrap">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total PRs in DB</span>
            <span className="text-xl font-mono font-bold text-slate-800">{vendors.reduce((acc, v) => acc + v.total_prs, 0) || 50}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Model Version</span>
            <span className="text-xl font-mono font-bold text-slate-800">v2</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Model Accuracy</span>
            <span className="text-xl font-mono font-bold text-slate-800 text-brand-blue">90.0%</span>
          </div>
        </div>
        <button 
          onClick={handleRetrain}
          className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-brand-blue/20 shrink-0"
        >
          <Database className="w-4 h-4" />
          Retrain Model Now
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search vendors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all shadow-sm"
        />
      </div>

      {/* Vendors Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Trust Score</th>
                <th className="px-6 py-4 text-center">Risk Level</th>
                <th className="px-6 py-4">Avg Cycle Time</th>
                <th className="px-6 py-4">SLA Breach Rate</th>
                <th className="px-6 py-4">Total PRs</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredVendors.map((vendor, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={vendor.vendor_name} 
                  className="hover:bg-slate-50 transition-colors group cursor-pointer"
                  onClick={() => loadVendorDetails(vendor.vendor_name)}
                >
                  <td className="px-6 py-5 font-semibold text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                      <Building2 className="w-4 h-4" />
                    </div>
                    {vendor.vendor_name}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${vendor.score > 70 ? 'bg-emerald-500' : vendor.score > 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${vendor.score}%` }}
                        />
                      </div>
                      <span className="font-mono font-medium text-slate-700">{vendor.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      vendor.risk_level === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                      vendor.risk_level === 'MEDIUM' ? 'bg-orange-100 text-orange-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {vendor.risk_level === 'HIGH' && <AlertCircle className="w-3 h-3" />}
                      {vendor.risk_level}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono text-slate-600">{vendor.avg_cycle_hours}h</td>
                  <td className="px-6 py-5">
                    <span className={`font-mono ${vendor.sla_breach_rate_pct > 20 ? 'text-rose-600 font-medium' : 'text-slate-600'}`}>
                      {vendor.sla_breach_rate_pct}%
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-600">{vendor.total_prs}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-brand-blue font-medium text-sm group-hover:underline">View Details</button>
                  </td>
                </motion.tr>
              ))}
              {filteredVendors.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No vendors found. Try uploading some CSV data first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
