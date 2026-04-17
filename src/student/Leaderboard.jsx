import { useEffect, useState } from "react";
import BASE_URL from "../api/api";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${BASE_URL}/result/leaderboard`)
      .then(res => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(resData => {
        const sorted = [...resData].sort((a, b) => b.score - a.score);
        setData(sorted);
      })
      .catch(() => setError("❌ Unable to load leaderboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <h2 className="text-center mt-10">⏳ Loading...</h2>;

  if (error)
    return <h2 className="text-center mt-10">{error}</h2>;

  if (data.length === 0)
    return <h2 className="text-center mt-10">🚫 No leaderboard data</h2>;

  const top3 = data.slice(0, 3);
  const next5 = data.slice(3, 8); // 🔥 only next 5

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-6">

      <div className="max-w-5xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          🏆 Leaderboard
        </h2>

        {/* 🔥 TOP 3 HERO SECTION */}
        {/* 🔥 TOP 3 (IMPROVED UI) */}
        <div className="flex justify-center items-end gap-8 mb-14">

          {/* 🥇 FIRST */}
          {top3[0] && (
            <div className="relative bg-yellow-300 p-7 rounded-2xl text-center shadow-xl w-60">

              {/* glow effect */}
              <div className="absolute inset-0 bg-yellow-400 opacity-20 blur-xl rounded-2xl"></div>

              <div className="relative z-10">
                <div className="text-3xl mb-2">👑🥇</div>
                <p className="font-bold text-lg">#1 {top3[0].studentName}</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  {top3[0].score}
                </p>
              </div>
            </div>
          )}

          {/* 🥈 SECOND */}
          {top3[1] && (
            <div className="bg-gray-200 p-5 rounded-2xl text-center shadow-md w-48 mt-6">
              <div className="text-2xl mb-2">🥈</div>
              <p className="font-semibold text-md">#2 {top3[1].studentName}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {top3[1].score}
              </p>
            </div>
          )}

          {/* 🥉 THIRD */}
          {top3[2] && (
            <div className="bg-orange-200 p-5 rounded-2xl text-center shadow-md w-48 mt-10">
              <div className="text-2xl mb-2">🥉</div>
              <p className="font-semibold text-md">#3 {top3[2].studentName}</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {top3[2].score}
              </p>
            </div>
          )}

        </div>


        {/* 🔥 NEXT 5 LIST */}
        <div className="bg-white rounded-2xl shadow-xl p-6">

          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            🔥 Other Top Performers
          </h3>

          {next5.length === 0 ? (
            <p className="text-center text-gray-500">
              🎉 No more users
            </p>
          ) : (
            <div className="space-y-3">

              {next5.map((user, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-lg shadow-sm hover:bg-blue-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-500">
                      #{i + 4}
                    </span>
                    <span className="font-medium">
                      {user.studentName}
                    </span>
                  </div>

                  <span className="font-bold text-green-600">
                    {user.score}
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}