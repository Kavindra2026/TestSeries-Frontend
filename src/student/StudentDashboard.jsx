import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function StudentDashboard() {

  const [name, setName] = useState(() => {
    return localStorage.getItem("studentName") || "Student";
  });

  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    if (storedName && storedName !== name) {
      setName(storedName);
    }
  }, []);

  // 🔥 reusable card style
  const cardStyle =
    "bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-gray-200 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.04] hover:border-blue-300";

  const statCard =
    "bg-white/80 backdrop-blur p-6 rounded-xl shadow-md text-center border border-gray-200 transition hover:shadow-xl hover:-translate-y-1";
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2 tracking-tight">
          🎓 Welcome,
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {name}
          </span>
        </h2>

        <p className="text-gray-600 mt-1">
          Ready to test your knowledge?
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <Link to="/quiz" className={cardStyle}>
          <div className="text-4xl mb-2 drop-shadow-sm">📝</div>
          <h3 className="text-lg font-semibold">Start Quiz</h3>
          <p className="text-gray-500 text-sm">Attempt new quiz</p>
        </Link>

        <Link to="/leaderboard" className={cardStyle}>
          <div className="text-4xl mb-2 drop-shadow-sm">🏆</div>
          <h3 className="text-lg font-semibold">Leaderboard</h3>
          <p className="text-gray-500 text-sm">Check top performers</p>
        </Link>

        <Link to="/history" className={cardStyle}>
          <div className="text-4xl mb-2 drop-shadow-sm">📜</div>
          <h3 className="text-lg font-semibold">History</h3>
          <p className="text-gray-500 text-sm">View your past attempts</p>
        </Link>

      </div>

      {/* STATS */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className={statCard}>
          <p className="text-gray-500 text-sm">Total Attempts</p>
          <h3 className="text-3xl font-bold text-blue-600 drop-shadow-sm">--</h3>
        </div>

        <div className={statCard}>
          <p className="text-gray-500 text-sm">Best Score</p>
          <h3 className="text-3xl font-bold text-green-600">--</h3>
        </div>

        <div className={statCard}>
          <p className="text-gray-500 text-sm">Accuracy</p>
          <h3 className="text-3xl font-bold text-purple-600">--</h3>
        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;