import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGet } from "../utils/apiHelper";

export default function AdminDashboard() {
  const [stats, setStats] = useState(() => {
    const cached = localStorage.getItem("adminStats");
    return cached
      ? JSON.parse(cached)
      : {
        totalAttempts: 0,
        totalQuestions: 0,
        avg: 0,
        topper: null,
      };
  });

  const [recent, setRecent] = useState(() => {
    const cached = localStorage.getItem("adminRecent");
    return cached ? JSON.parse(cached) : [];
  });


  const loadData = async () => {
    try {
      const [attempts, questions, avg, topper, recentData] = await Promise.all([
        apiGet("/result/admin/analytics"),
        apiGet("/questions"),
        apiGet("/result/admin/avg-score"),
        apiGet("/result/admin/topper"),
        apiGet("/result/admin/recent"),
      ]);

      const newStats = {
        totalAttempts: attempts || 0,
        totalQuestions: (questions || []).length,
        avg: avg || 0,
        topper: topper || null,
      };

      setStats(newStats);
      setRecent(recentData || []);

      localStorage.setItem("adminStats", JSON.stringify(newStats));
      localStorage.setItem("adminRecent", JSON.stringify(recentData || []));

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  useEffect(() => {
    loadData(); // background refresh

    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-6">
        📊 Admin Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card title="Total Attempts" value={stats.totalAttempts} color="text-blue-600" icon="📈" />
        <Card title="Total Questions" value={stats.totalQuestions} color="text-purple-600" icon="📚" />

        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-gray-600">📊 Avg Score</h3>
          <p className={`text-3xl font-bold mt-2 ${stats.avg >= 0 ? "text-green-600" : "text-red-500"}`}>
            {stats.avg?.toFixed(2)}
          </p>
          <p className="text-sm text-gray-400">
            {stats.avg >= 0 ? "Good Performance" : "Needs Improvement"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 text-center">
          <h3 className="text-gray-600">🏆 Topper</h3>
          <p className="text-xl font-bold text-yellow-600 mt-2">
            {stats.topper?.studentName || "N/A"}
          </p>
          <p className="text-gray-500">
            Score: {stats.topper?.score ?? "-"}
          </p>
        </div>

      </div>

      {/* 🔥 RECENT ACTIVITY */}
      <div className="mt-10 bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📜 Recent Activity</h2>

        {recent.length === 0 ? (
          <p className="text-gray-400">No recent attempts</p>
        ) : (
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th>#</th>
                <th>Name</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Wrong</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recent.map((r, i) => (
                <tr key={i} className="border-b hover:bg-blue-50 transition">

                  <td>{i + 1}</td>

                  <td>{r.studentName}</td>

                  <td className={`font-bold ${r.score >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {r.score}
                  </td>

                  <td>{r.correctAnswers}</td>
                  <td>{r.wrongAnswers}</td>

                  <td>{formatDate(r.submittedAt)}</td>

                  <td>
                    {r.correctAnswers >= 5 ? "🔥 Good" : "⚠️ Weak"}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BUTTON */}
      <div className="text-center mt-6 flex gap-4 justify-center">

        <Link
          to="/admin/tests"
          className="bg-green-600 text-white px-6 py-3 rounded-xl shadow hover:bg-green-700"
        >
          🧪 Manage Tests
        </Link>

        <Link
          to="/admin/questions"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow hover:bg-blue-700"
        >
          ➡ Manage Questions
        </Link>

      </div>
    </div>
  );
}

/* CARD */
function Card({ title, value, color, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition">
      <h3 className="text-gray-600">{icon} {title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

/* DATE FORMAT */
function formatDate(dateStr) {
  if (!dateStr) return "-"; // 🔥 add this
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN");
}