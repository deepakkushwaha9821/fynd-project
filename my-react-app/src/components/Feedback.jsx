import React, { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const labels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const activeRating = hoverRating ?? rating;

  const getLabelText = (value) =>
    value ? labels[Math.ceil(value)] : "";

  // Half-star logic (UNCHANGED)
  const calculateRating = (e, starIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return x < rect.width / 2 ? starIndex - 0.5 : starIndex;
  };

  const getFillWidth = (starIndex) => {
    if (activeRating >= starIndex) return "100%";
    if (activeRating >= starIndex - 0.5) return "50%";
    return "0%";
  };

  const handleSubmit = async () => {
    if (!rating) return;
    setLoading(true);
    try {
     await fetch("https://fynd-project-1.onrender.com/api/feedback", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, review: feedback }),
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setHoverRating(null);
        setFeedback("");
      }, 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">

        <div className="h-2 bg-gradient-to-r from-yellow-400 to-orange-500" />

        <div className="p-8">
          {submitted ? (
            <div className="flex flex-col items-center py-10 space-y-4">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold">Thank You!</h2>
              <p className="text-gray-500 text-center">
                Your feedback has been submitted successfully.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold mb-2">
                  Share Your Feedback
                </h1>
                <p className="text-gray-500 text-sm">
                  We’d love to hear about your experience
                </p>
              </div>

              {/* ⭐ STABLE RATING */}
              <div className="mb-8 text-center">
                <h2 className="text-lg font-medium mb-4">
                  How would you rate your experience?
                </h2>

                <div
                  className="flex justify-center gap-2 mb-2"
                  onMouseLeave={() => setHoverRating(null)}
                >
                  {[1, 2, 3, 4, 5].map((starIndex) => (
                    <div
                      key={starIndex}
                      className="relative cursor-pointer"
                      onMouseEnter={(e) =>
                        setHoverRating(calculateRating(e, starIndex))
                      }
                      onClick={(e) =>
                        setRating(calculateRating(e, starIndex))
                      }
                    >
                      <Star className="w-12 h-12 text-gray-300" />
                      <div
                        className="absolute top-0 left-0 overflow-hidden pointer-events-none"
                        style={{ width: getFillWidth(starIndex) }}
                      >
                        <Star className="w-12 h-12 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* RESERVED SPACE → NO SHAKE */}
                <div className="h-6">
                  {activeRating > 0 && (
                    <span className="text-yellow-500 font-semibold text-lg">
                      {getLabelText(activeRating)}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-yellow-400"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!rating || loading}
                className={`w-full py-3.5 rounded-xl text-white font-medium ${
                  !rating || loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {loading ? "Submitting..." : "Submit Feedback"}
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
