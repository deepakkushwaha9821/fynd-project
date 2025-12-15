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
                  : rating >= i - 0.5
                  ? "text-yellow-400"
                  : "text-slate-700"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500">
          {review.date || "—"}
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

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
  async function loadData() {
    try {
      const summaryRes = await fetch("/api/admin/summary");
      const reviewsRes = await fetch("/api/admin/reviews");

      if (!summaryRes.ok || !reviewsRes.ok) {
        throw new Error("API error");
      }

      const summaryData = await summaryRes.json();
      const reviewsData = await reviewsRes.json();

      setSummary(summaryData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      setError(null);
    } catch (err) {
      console.error("ADMIN FETCH ERROR:", err);
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

  /* ---------------- FIX 1: RATING DISTRIBUTION ---------------- */
  /* EXACTLY ONE BAR PER STAR */

  const ratingBuckets = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((r) => {
    const rating = Number(r.rating);
    if (!rating) return;

    const bucket = Math.ceil(rating); // 1.5 → 2★
    if (bucket >= 1 && bucket <= 5) {
      ratingBuckets[bucket] += 1;
    }
  });

  const ratingDistData = Object.entries(ratingBuckets).map(
    ([star, count]) => ({
      stars: `${star}★`,
      count,
      color: "#10b981",
    })
  );

  /* ---------------- FIX 2: REVIEWS OVER TIME ---------------- */

 /* ---------------- REVIEWS OVER TIME (FIXED FOR TIMESTAMP) ---------------- */

const trendMap = {};

reviews.forEach((r) => {
  if (!r.timestamp) return;

  let day = null;

  // Case 1: ISO format (2025-12-15T01:37:19)
  if (r.timestamp.includes("T")) {
    day = r.timestamp.split("T")[0];
  }

  // Case 2: Space format (2025-12-14 21:53:21.424411)
  else if (r.timestamp.includes(" ")) {
    day = r.timestamp.split(" ")[0];
  }

  if (!day) return;

  trendMap[day] = (trendMap[day] || 0) + 1;
});

const trendData = Object.entries(trendMap)
  .map(([date, reviews]) => ({ date, reviews }))
  .sort((a, b) => new Date(a.date) - new Date(b.date));


  /* ---------------- RENDER ---------------- */

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-600 rounded-xl">
            <BarChart2 className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              AI-powered feedback analytics
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <KPICard
          title="Total Reviews"
          value={summary.total_reviews ?? reviews.length}
          subtext="All time feedback"
          Icon={FileText}
        />
        <KPICard
          title="Average Rating"
          value={
            summary.avg_rating
              ? Number(summary.avg_rating).toFixed(2)
              : "0.00"
          }
          subtext="Out of 5 stars"
          Icon={Star}
        />
        <KPICard
          title="Positive Sentiment"
          value={`${summary.positive_percent ?? 0}%`}
          subtext="Positive reviews"
          Icon={TrendingUp}
        />
        <KPICard
          title="Actionable Items"
          value={summary.action_items ?? 0}
          subtext="Needs attention"
          Icon={AlertCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
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

          {trendData.length === 0 ? (
            <p className="text-slate-500 text-sm">
              No review activity yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
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
          )}
        </div>
      </div>

      {/* Reviews */}
      <h2 className="text-xl font-bold mb-4">All Feedback</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((r, i) => (
          <ReviewCard key={i} review={r} />
        ))}
      </div>
    </div>
  );
}
