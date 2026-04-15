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
  const others = data.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 p-6">

      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-8">
          🏆 Leaderboard
        </h2>

        {/* 🔥 TOP 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

          {top3.map((user, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl text-center shadow-lg transform transition hover:scale-105
                ${i === 0 ? "bg-yellow-200 scale-110" :
                  i === 1 ? "bg-gray-200" :
                    "bg-orange-200"}
              `}
            >
              <div className="text-3xl mb-2">
                {i === 0 ? "👑🥇" : i === 1 ? "🥈" : "🥉"}
              </div>

              {/* 🔥 Rank added */}
              <h3 className="font-bold text-lg">
                #{i + 1} {user.studentName}
              </h3>

              {/* 🔥 Score color fix */}
              <p className={`text-xl font-bold ${user.score >= 0 ? "text-green-600" : "text-red-500"
                }`}>
                {user.score}
              </p>
            </div>
          ))}

        </div>

        {/* 📊 TABLE */}
        <div className="bg-white rounded-2xl shadow-xl p-6">

          {others.length === 0 ? (
            <p className="text-center text-gray-500">
              🎉 Only top users available
            </p>
          ) : (
            <table className="w-full text-center">

              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3">Rank</th>
                  <th>Name</th>
                  <th>Score</th>
                </tr>
              </thead>

              <tbody>
                {others.map((user, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-blue-50 transition duration-200"
                  >
                    <td className="p-3 font-semibold">#{i + 4}</td>

                    <td>{user.studentName}</td>

                    <td className={`font-bold ${user.score >= 0 ? "text-green-600" : "text-red-500"
                      }`}>
                      {user.score}
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>

      </div>
    </div>
  );
}