import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

function Analysis() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const answers = JSON.parse(localStorage.getItem("answers"));
    const testId = localStorage.getItem("testId");

    fetch(`${BASE_URL}/result/analysis`, {
      method: "POST",
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers, testId }),
    })
      .then((res) => res.json())
      .then(setData);
  }, []);

  const result = JSON.parse(localStorage.getItem("result")) || {};

  const correctCount = result.correctAnswers || 0;
  const wrongCount = result.wrongAnswers || 0;
  const totalQuestions = correctCount + wrongCount;

  const accuracy =
    totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-6 px-4">

      <div className="max-w-3xl mx-auto bg-white p-5 rounded-xl shadow-lg">

        <h2 className="text-xl font-bold text-center mb-5">
          📊 Detailed Analysis
        </h2>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-center text-sm">
          <div className="bg-green-100 py-2 rounded-md">✅ {correctCount}</div>
          <div className="bg-red-100 py-2 rounded-md">❌ {wrongCount}</div>
          <div className="bg-blue-100 py-2 rounded-md">📊 {accuracy}%</div>
          <div className="bg-gray-100 py-2 rounded-md">📋 {totalQuestions}</div>
        </div>

        {wrongCount === 0 ? (
          <p className="text-center text-green-600 font-medium">
            🎉 All answers are correct!
          </p>
        ) : (
          <div className="space-y-4">

            {data.map((item, i) => {

              const userAns = (item.userAnswer || "").toUpperCase();
              const correctAns = item.correctAnswer;

              const isSkipped = !userAns || userAns === "NOT ANSWERED";
              const isCorrect = userAns === correctAns;
              const isWrong = !isSkipped && !isCorrect;

              return (
                <div
                  key={i}
                  className={`bg-gray-50 p-4 rounded-xl border-l-4 shadow-sm transition
                  ${isSkipped
                      ? "border-yellow-400"
                      : isCorrect
                        ? "border-green-500"
                        : "border-red-500"
                    }`}
                >

                  {/* QUESTION */}
                  <p className="font-semibold text-base mb-2">
                    ❓ {item.question}
                  </p>

                  {/* STATUS */}
                  <div className="mb-2 text-xs font-semibold">
                    {/* {isSkipped && <span className="text-yellow-600">⏭ Skipped</span>} */}
                    {isWrong && <span className="text-red-500">❌ Wrong</span>}
                    {isCorrect && <span className="text-green-600">✅ Correct</span>}
                  </div>

                  {/* OPTIONS */}
                  <div className="space-y-2 text-sm mb-2">

                    {["A", "B", "C", "D"].map((opt) => {
                      const value = item[`option${opt}`];

                      let style = "bg-white";

                      if (opt === correctAns) {
                        style = "bg-green-100 text-green-700 font-medium";
                      } else if (opt === userAns) {
                        style = "bg-red-100 text-red-600";
                      }

                      return (
                        <div
                          key={opt}
                          className={`px-3 py-2 rounded-md flex gap-2 ${style}`}
                        >
                          <span className="font-semibold">{opt}:</span>
                          <span>{value}</span>
                        </div>
                      );
                    })}

                  </div>

                  {/* ANSWER TEXT */}
                  <div className="text-xs mt-2 space-y-1">

                    <p className="text-green-600 font-medium">
                      ✅ Correct: {correctAns}
                    </p>

                    {isSkipped ? (
                      <p className="text-yellow-600 font-medium">
                        ⏭ Not Attempted
                      </p>
                    ) : (
                      <p className="text-red-500 font-medium">
                        ❌ Your Answer: {userAns}
                      </p>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Analysis;