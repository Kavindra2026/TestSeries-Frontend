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
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition"
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-2">

                  <div>
                    <span className="text-sm text-gray-500 block">
                      🕒 {formatDate(item.submittedAt)}
                    </span>

                    {/* 🔥 Attempt number */}
                    <span className="text-xs text-gray-400">
                      Attempt #{history.length - index}
                    </span>
                  </div>

                  <span className={`font-bold text-lg ${item.score >= 0 ? "text-green-600" : "text-red-500"
                    }`}>
                    {item.score}
                  </span>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-gray-200 h-3 rounded-full mb-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${percentage >= 80
                        ? "bg-green-500"
                        : percentage >= 50
                          ? "bg-yellow-400"
                          : "bg-red-500"
                      }`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* STATS */}
                <div className="flex justify-between text-sm items-center">

                  <span className="text-green-600">
                    ✅ {item.correctAnswers}
                  </span>

                  <span className="text-red-500">
                    ❌ {item.wrongAnswers}
                  </span>

                  <span className="font-medium">
                    📊 {percentage}%
                  </span>

                  <span className="text-sm font-semibold text-blue-600">
                    {label}
                  </span>
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