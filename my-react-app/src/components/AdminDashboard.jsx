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
  BarChart2,
} from "lucide-react";

/* ---------------- KPI CARD ---------------- */
function KPICard({ title, value, subtext, Icon }) {
  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
      <div className="flex justify-between mb-3">
        <div>
          <h3 className="text-slate-400 text-sm">{title}</h3>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="p-3 bg-emerald-400/10 rounded-lg">
          <Icon className="text-emerald-400 w-6 h-6" />
        </div>
      </div>
      <p className="text-slate-500 text-sm">{subtext}</p>
    </div>
  );
}

/* ---------------- REVIEW CARD ---------------- */
function ReviewCard({ review }) {
  const rating = Number(review.rating || 0);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex justify-between mb-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                rating >= i
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-slate-700"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500">
          {review.timestamp || "—"}
        </span>
      </div>

      <p className="text-slate-300 text-sm mb-4">
        “{review.review || "No written feedback"}”
      </p>

      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 mb-3">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
          <Brain className="w-3 h-3" /> AI Summary
        </div>
        <p className="text-xs text-slate-400">
          {review.ai_summary || "—"}
        </p>
      </div>

      <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
          <Zap className="w-3 h-3" /> Action
        </div>
        <p className="text-xs text-slate-400">
          {review.action || "—"}
        </p>
      </div>
    </div>
  );
}

/* ---------------- MAIN DASHBOARD ---------------- */
export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  // ✅ PUT YOUR REAL RENDER URL HERE
 const BASE_URL = "https://fynd-project-1.onrender.com";


  useEffect(() => {
    async function loadData() {
      try {
        const summaryRes = await fetch(`${BASE_URL}/api/admin/summary`);
        const reviewsRes = await fetch(`${BASE_URL}/api/admin/reviews`);

        if (!summaryRes.ok || !reviewsRes.ok) {
          throw new Error("API error");
        }

        const summaryData = await summaryRes.json();
        const reviewsData = await reviewsRes.json();

        setSummary(summaryData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      } catch (err) {
        console.error(err);
        setError("Backend not reachable");
      }
    }

    loadData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-red-500 p-10">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        Loading dashboard…
      </div>
    );
  }

  /* ---------- RATING DISTRIBUTION ---------- */
  const ratingBuckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  reviews.forEach((r) => {
    const rating = Math.ceil(Number(r.rating || 0));
    if (rating >= 1 && rating <= 5) ratingBuckets[rating]++;
  });

  const ratingDistData = Object.entries(ratingBuckets).map(
    ([star, count]) => ({
      stars: `${star}★`,
      count,
      color: "#10b981",
    })
  );

  /* ---------- REVIEWS OVER TIME ---------- */
  const trendMap = {};
  reviews.forEach((r) => {
    if (!r.timestamp) return;
    const day = r.timestamp.split("T")[0];
    trendMap[day] = (trendMap[day] || 0) + 1;
  });

  const trendData = Object.entries(trendMap).map(([date, reviews]) => ({
    date,
    reviews,
  }));

  /* ---------- RENDER ---------- */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <KPICard
          title="Total Reviews"
          value={summary.total_reviews}
          subtext="All time"
          Icon={FileText}
        />
        <KPICard
          title="Average Rating"
          value={summary.avg_rating.toFixed(2)}
          subtext="Out of 5"
          Icon={Star}
        />
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={ratingDistData}>
          <XAxis dataKey="stars" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count">
            {ratingDistData.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
