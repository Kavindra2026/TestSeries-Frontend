import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/result/history`, {
      headers: getAuthHeader(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
        setHistory(sorted);
      })
      .catch(() => setError("❌ Unable to load history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <h2 className="text-center mt-10">⏳ Loading...</h2>;

  if (error)
    return <h2 className="text-center mt-10">{error}</h2>;

  if (history.length === 0)
    return <h2 className="text-center mt-10">📭 No history found</h2>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      <div className="max-w-3xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-8">
          📜 Quiz History
        </h2>

        <div className="space-y-5">

          {history.map((item, index) => {
            const total = item.correctAnswers + item.wrongAnswers;

            const percentage =
              total > 0
                ? Math.round((item.correctAnswers / total) * 100)
                : 0;

            const label =
              percentage >= 80
                ? "🔥 Excellent"
                : percentage >= 50
                  ? "👍 Good"
                  : "😅 Weak";

            return (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 
             hover:shadow-xl transition duration-300"
              >

                {/* HEADER */}
                <div className="flex justify-between items-start mb-3">

                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      🕒 {formatDate(item.submittedAt)}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Attempt #{history.length - index}
                    </p>
                  </div>

                  {/* SCORE BADGE */}
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold
      ${item.score >= 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
    `}>
                    {item.score}
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-200 h-2 rounded-full mb-4 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${percentage >= 80
                        ? "bg-green-500"
                        : percentage >= 50
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-4 gap-2 text-center text-sm">

                  <div className="bg-green-50 rounded-lg py-2">
                    <p className="text-green-600 font-semibold">
                      ✅ {item.correctAnswers}
                    </p>
                  </div>

                  <div className="bg-red-50 rounded-lg py-2">
                    <p className="text-red-500 font-semibold">
                      ❌ {item.wrongAnswers}
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-lg py-2">
                    <p className="font-medium">
                      📊 {percentage}%
                    </p>
                  </div>

                  <div className="bg-purple-50 rounded-lg py-2">
                    <p className="text-blue-600 font-semibold">
                      {label}
                    </p>
                  </div>

                </div>
              </div>
              
            );
          })}

        </div>
      </div>
    </div>
  );
}

// 📅 Date + Time Format
function formatDate(dateStr) {
  const d = new Date(dateStr);

  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}