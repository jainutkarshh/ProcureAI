"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartsProps {
  metrics: any;
}

export function Charts({ metrics }: ChartsProps) {
  
  // Use raw data to generate chart, or use fallback
  let chartData = [
    { name: "Mon", time: 4.8 },
    { name: "Tue", time: 4.5 },
    { name: "Wed", time: 4.2 },
    { name: "Thu", time: 3.9 },
    { name: "Fri", time: 4.0 },
    { name: "Sat", time: 3.5 },
    { name: "Sun", time: 3.2 },
  ];

  if (metrics?.raw_df && metrics.raw_df.length > 0) {
    // Generate simple sequence from raw data
    chartData = metrics.raw_df.slice(0, 10).map((row: any, i: number) => ({
      name: `PR-${i}`,
      time: parseFloat(row.cycle_time_hours || "0")
    }));
  }

  // Use category breakdown for bottlenecks
  let bottlenecks = [
    { name: "Legal Review", delay: 42, color: "bg-rose-500", textClass: "text-rose-600" },
    { name: "Finance L2", delay: 28, color: "bg-orange-500", textClass: "text-orange-500" },
    { name: "IT Security", delay: 15, color: "bg-amber-500", textClass: "text-amber-500" },
  ];

  if (metrics?.category_breakdown) {
    const sortedCats = Object.entries(metrics.category_breakdown)
      .map(([name, data]: [string, any]) => ({
        name,
        delay: parseFloat(data.cycle_time_hours) || 0
      }))
      .sort((a, b) => b.delay - a.delay)
      .slice(0, 3);
      
    if (sortedCats.length > 0) {
      bottlenecks = sortedCats.map((cat, i) => {
        const colors = [
          { bg: "bg-rose-500", text: "text-rose-600" },
          { bg: "bg-orange-500", text: "text-orange-500" },
          { bg: "bg-amber-500", text: "text-amber-500" }
        ];
        return {
          name: cat.name.toUpperCase(),
          delay: Math.round(cat.delay),
          color: colors[i % colors.length].bg,
          textClass: colors[i % colors.length].text
        };
      });
    }
  }

  // Find max delay to calculate percentage widths correctly
  const maxDelay = Math.max(...bottlenecks.map(b => b.delay), 100);

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 glass-panel rounded-3xl p-8"
        >
          <div className="mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900">SLA Trend Prediction</h3>
            <p className="text-slate-500 mt-1">Expected cycle time based on current pipeline</p>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  itemStyle={{ color: "#0f172a", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="time" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorTime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bottleneck Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-panel rounded-3xl p-8 flex flex-col"
        >
          <h3 className="text-xl font-display font-bold text-slate-900 mb-6">Approval Bottlenecks</h3>
          
          <div className="flex-1 flex flex-col justify-center gap-6">
            {bottlenecks.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-700">{item.name}</span>
                  <span className={item.textClass}>{item.delay} hrs Avg</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} 
                    whileInView={{ width: `${(item.delay / maxDelay) * 100}%` }} 
                    transition={{ duration: 1 }} 
                    className={`${item.color} h-full rounded-full`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
