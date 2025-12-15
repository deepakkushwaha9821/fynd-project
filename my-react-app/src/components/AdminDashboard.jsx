import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  FileText,
  Star,
  TrendingUp,
  AlertCircle,
  Brain,
  Zap,
  Filter,
  ArrowRight,
  BarChart2,
} from "lucide-react";

/* ---------------- KPI CARD ---------------- */
const KPICard = ({ data }) => (
  <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 relative overflow-hidden group">
    <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div>
        <h3 className="text-slate-400 text-sm mb-1">{data.title}</h3>
        <div className="text-3xl font-bold text-white">{data.value}</div>
      </div>
      <div className={`p-3 rounded-xl ${data.bgColor} border border-white/5`}>
        <data.icon className={`w-6 h-6 ${data.color}`} />
      </div>
    </div>
    <p className="text-slate-500 text-sm relative z-10">{data.subtext}</p>
  </div>
);

/* ---------------- REVIEW CARD ---------------- */
const ReviewCard = ({ review }) => {
  const getStarColor = (i) => {
    if (i < review.rating) {
      if (review.rating >= 4) return "text-emerald-400 fill-emerald-400";
      if (review.rating === 3) return "text-amber-400 fill-amber-400";
      return "text-rose-400 fill-rose-400";
    }
    return "text-slate-700";
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 hover:border-emerald-500/30 transition-all flex flex-col">
      <div className="flex justify-between mb-4">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${getStarColor(i)}`} />
          ))}
        </div>
        <span className="text-xs text-slate-500">{review.date}</span>
      </div>

      <p className="text-slate-300 text-sm mb-6 flex-grow">
        "{review.text}"
      </p>

      <div className="space-y-3">
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-bold mb-2">
            <Brain className="w-3 h-3" /> AI Summary
          </div>
          <p className="text-xs text-slate-400">{review.aiSummary}</p>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-800 hover:border-emerald-500/20 transition">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-2">
            <Zap className="w-3 h-3" /> Recommended Action
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-400">{review.action}</p>
            <ArrowRight className="w-3 h-3 text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN DASHBOARD ---------------- */
export default function AdminDashboard() {
  const BASE_URL = "https://fynd-project-1.onrender.com";

  const [kpiData, setKpiData] = useState([]);
  const [ratingDistData, setRatingDistData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const summaryRes = await fetch(`${BASE_URL}/api/admin/summary`);
        const reviewsRes = await fetch(`${BASE_URL}/api/admin/reviews`);

        const summary = await summaryRes.json();
        const reviewList = await reviewsRes.json();

        /* KPI */
        setKpiData([
          {
            title: "Total Reviews",
            value: String(summary.total_reviews),
            subtext: "All time feedback",
            icon: FileText,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
          },
          {
            title: "Average Rating",
            value: summary.avg_rating.toFixed(1),
            subtext: "Out of 5 stars",
            icon: Star,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
          },
        ]);

        /* Reviews */
        const mappedReviews = reviewList.map((r, i) => ({
          id: i,
          rating: Number(r.rating),
          date: new Date(r.timestamp).toLocaleString(),
          text: r.review,
          aiSummary: r.ai_summary,
          action: r.action,
        }));
        setReviews(mappedReviews.reverse());

        /* Rating Distribution */
        const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        mappedReviews.forEach((r) => buckets[Math.ceil(r.rating)]++);

        setRatingDistData([
          { stars: "1 Star", count: buckets[1], color: "#ef4444" },
          { stars: "2 Stars", count: buckets[2], color: "#f97316" },
          { stars: "3 Stars", count: buckets[3], color: "#eab308" },
          { stars: "4 Stars", count: buckets[4], color: "#22c55e" },
          { stars: "5 Stars", count: buckets[5], color: "#15803d" },
        ]);

        /* Trend */
        const trendMap = {};
        mappedReviews.forEach((r) => {
          const day = r.date.split(",")[0];
          trendMap[day] = (trendMap[day] || 0) + 1;
        });

        setTrendData(
          Object.entries(trendMap).map(([date, reviews]) => ({
            date,
            reviews,
          }))
        );

        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-xl">
              <BarChart2 className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">
                AI-powered feedback analytics
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi, i) => (
            <KPICard key={i} data={kpi} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold mb-4">Rating Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart layout="vertical" data={ratingDistData}>
                <XAxis type="number" hide />
                <YAxis dataKey="stars" type="category" />
                <Tooltip />
                <Bar dataKey="count">
                  {ratingDistData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="font-bold mb-4">Reviews Over Time</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="reviews"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-xl font-bold mb-4">All Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
