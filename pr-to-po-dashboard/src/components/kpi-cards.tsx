"use client";

import { motion, Variants } from "framer-motion";
import { Clock, ShieldAlert, FileText, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

interface KpiCardsProps {
  metrics: any;
}

export function KpiCards({ metrics }: KpiCardsProps) {
  
  const kpiData = [
    {
      title: "Avg Cycle Time",
      value: metrics ? `${metrics.avg_cycle_time_hours} hrs` : "4.2 Days",
      trend: metrics ? "Live Data" : "-12%",
      trendUp: false,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "SLA Breach Rate",
      value: metrics ? `${metrics.sla_breach_rate_pct}%` : "12.4%",
      trend: metrics ? "Live Data" : "-2.1%",
      trendUp: false,
      icon: ShieldAlert,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Total Analyzed PRs",
      value: metrics ? metrics.total_prs.toString() : "1,248",
      trend: metrics ? "Live Data" : "+5.4%",
      trendUp: true,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Slowest Approver",
      value: metrics ? metrics.slowest_approver : "Vendor Risk",
      trend: metrics ? `${metrics.slowest_approver_avg_hours} hrs avg` : "68/100",
      trendUp: true,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900">Process Intelligence</h2>
          <p className="text-slate-500 mt-1">Real-time overview of procurement health</p>
        </div>
      </div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {kpiData.map((kpi, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card rounded-2xl p-6 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bgColor} transition-transform group-hover:scale-110 duration-300`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-md ${
                kpi.trendUp ? "text-rose-700 bg-rose-50" : "text-emerald-700 bg-emerald-50"
              }`}>
                {kpi.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {kpi.trend}
              </div>
            </div>
            
            <div>
              <p className="text-3xl font-mono font-bold text-slate-900 mb-1">{kpi.value}</p>
              <p className="text-sm text-slate-500 font-medium">{kpi.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
