import { Link } from "react-router-dom";

function Result() {
  const result = JSON.parse(localStorage.getItem("result") || "{}");

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">No result found</p>
      </div>
    );
  }

  const total = result.correctAnswers + result.wrongAnswers;

  const percentage =
    total > 0
      ? Math.max(0, Math.round((result.correctAnswers / total) * 100)) // 🔥 fix
      : 0;

  // 🎨 Colors
  const isBad = result.score < 0;

  const color =
    percentage >= 80
      ? "text-green-500"
      : percentage >= 50
        ? "text-yellow-500"
        : "text-red-500";

  const barColor =
    percentage >= 80
      ? "bg-green-500"
      : percentage >= 50
        ? "bg-yellow-400"
        : "bg-red-500";

  const message =
    percentage >= 80
      ? "🔥 Excellent Work!"
      : percentage >= 50
        ? "👍 Good Job!"
        : "😅 Keep Practicing!";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-gray-200 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl  w-full max-w-md text-center border border-gray-100 backdrop-blur-sm">
        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6">
          🎯 Your Result
        </h2>

        {/* 🔥 SCORE + ICON */}
        <div className="flex flex-col items-center mb-4">

          {/* ICON */}
          <div className="text-3xl -mb-4 z-10 bg-white px-2 rounded-full shadow-sm">
            {percentage >= 80
              ? "🏆"
              : percentage >= 50
                ? "🙂"
                : "😅"}
          </div>

          <div
            className={`px-10 py-6 rounded-3xl text-5xl font-bold shadow-xl border transition-all duration-300
  ${isBad
                ? "bg-gradient-to-br from-red-100 to-red-50 text-red-600 border-red-100"
                : percentage >= 80
                  ? "bg-gradient-to-br from-green-100 to-green-50 text-green-600 border-green-100"
                  : percentage >= 50
                    ? "bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 border-yellow-100"
                    : "bg-gray-100 text-gray-700 border-gray-200"
              }`}
          >
            {result.score}
          </div>
        </div>

        <p className="text-gray-500 mb-4 text-sm">
          Total Score
        </p>

        {/* 🔥 PROGRESS */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Accuracy</span>
            <span>{percentage}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className={`h-3 rounded-full transition-all duration-700 shadow-sm ${barColor}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div className="flex justify-between gap-3 mb-5">

          <div className="flex-1 bg-green-50 p-3 rounded-xl shadow-sm hover:scale-105 transition">
            <p className="text-xs text-gray-500">Correct</p>
            <p className="font-bold text-green-600 text-lg">
              {result.correctAnswers}
            </p>
          </div>

          <div className="flex-1 bg-red-50 p-3 rounded-xl shadow-sm">
            <p className="text-xs text-gray-500">Wrong</p>
            <p className="font-bold text-red-500 text-lg">
              {result.wrongAnswers}
            </p>
          </div>

        </div>

        {/* 🔥 MESSAGE BADGE */}
        <div className="mb-6">
          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold
            ${percentage >= 80
                ? "bg-green-100 text-green-700"
                : percentage >= 50
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-600"
              }`}
          >
            {message}
          </span>
        </div>

        {/* 🔥 BUTTONS */}
        <div className="flex flex-col gap-3">

          <Link to="/analysis">
            <button className="w-full bg-blue-500 text-white py-2.5 rounded-xl font-medium shadow-md hover:bg-blue-600 hover:scale-[1.03] active:scale-95 transition">
              📊 View Analysis
            </button>
          </Link>

          <Link to="/leaderboard">
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-xl font-medium shadow-md hover:scale-[1.03] active:scale-95 transition">
              🏆 Leaderboard
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Result;