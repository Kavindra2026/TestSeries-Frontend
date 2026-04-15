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
      ? Math.round((result.correctAnswers / total) * 100)
      : 0;

  // 🔥 Dynamic color
  const color =
    percentage >= 80
      ? "text-green-500"
      : percentage >= 50
        ? "text-yellow-500"
        : "text-red-500";

  // 🔥 Message
  const message =
    percentage >= 80
      ? "🔥 Excellent Work!"
      : percentage >= 50
        ? "👍 Good Job!"
        : "😅 Keep Practicing!";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200 p-4">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">

        <h2 className="text-2xl font-bold mb-6">
          🎯 Your Result
        </h2>

        {/* SCORE */}
        <div className={`text-5xl font-bold mb-2 ${color}`}>
          {result.score}
        </div>

        <p className="text-gray-500 mb-4">
          Total Score
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
          <div
            className={`h-4 rounded-full transition-all duration-500 ${percentage >= 80
              ? "bg-green-500"
              : percentage >= 50
                ? "bg-yellow-400"
                : "bg-red-400"
              }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        {/* ACCURACY */}
        <p className="font-medium mb-4">
          📊 Accuracy: <span className="font-bold">{percentage}%</span>
        </p>

        {/* STATS */}
        <div className="flex justify-between gap-3 mb-5">
          <div className="flex-1 bg-green-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Correct</p>
            <p className="font-bold text-green-600">{result.correctAnswers}</p>
          </div>

          <div className="flex-1 bg-red-100 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Wrong</p>
            <p className="font-bold text-red-600">{result.wrongAnswers}</p>
          </div>
        </div>

        {/* MESSAGE */}
        <h3 className="text-lg font-semibold mb-6">
          {message}
        </h3>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">

          <Link to="/analysis">
            <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
              📊 View Analysis
            </button>
          </Link>

          <Link to="/leaderboard">
            <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
              🏆 Leaderboard
            </button>
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Result;