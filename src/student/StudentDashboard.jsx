import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function StudentDashboard() {

  // 🔥 CACHE NAME (INSTANT LOAD)
  const [name, setName] = useState(() => {
    return localStorage.getItem("studentName") || "Student";
  });

  useEffect(() => {
    // 🔥 ensure latest name (no delay UI)
    const storedName = localStorage.getItem("studentName");
    if (storedName && storedName !== name) {
      setName(storedName);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6">

      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-6">
        <h2 className="text-2xl font-bold">
          🎓 Welcome, {name}
        </h2>
        <p className="text-gray-600">
          Ready to test your knowledge?
        </p>
      </div>

      {/* CARDS */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        <Link
          to="/quiz"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
        >
          <h3 className="text-xl font-semibold mb-2">📝 Start Quiz</h3>
          <p className="text-gray-500 text-sm">
            Attempt new quiz
          </p>
        </Link>

        <Link
          to="/leaderboard"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
        >
          <h3 className="text-xl font-semibold mb-2">🏆 Leaderboard</h3>
          <p className="text-gray-500 text-sm">
            Check top performers
          </p>
        </Link>

        <Link
          to="/history"
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition text-center"
        >
          <h3 className="text-xl font-semibold mb-2">📜 History</h3>
          <p className="text-gray-500 text-sm">
            View your past attempts
          </p>
        </Link>

      </div>
    </div>
  );
}

export default StudentDashboard;