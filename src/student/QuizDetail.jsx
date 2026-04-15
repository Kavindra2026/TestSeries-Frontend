import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

function QuizDetail() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [allowed, setAllowed] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testRes, allowedRes] = await Promise.all([
          fetch(`${BASE_URL}/tests/${testId}`, {
            headers: getAuthHeader()
          }),
          fetch(`${BASE_URL}/result/can-attempt/${testId}`, {
            headers: getAuthHeader()
          })
        ]);

        const testData = await testRes.json();
        const allowedData = await allowedRes.json();

        setTest(testData);
        setAllowed(allowedData);

      } catch (err) {
        console.error("Error:", err);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [testId]);

  // 🔥 LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-400 text-lg">
          Loading test details...
        </p>
      </div>
    );
  }

  // 🔥 ERROR
  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Failed to load test
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[380px] 
                      hover:shadow-2xl hover:-translate-y-1 transition duration-300">

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-1">
          📝 {test.testName}
        </h2>

        {/* SUBJECT */}
        <p className="text-gray-500 mb-5">
          📚 {test.subject}
        </p>

        {/* INFO */}
        <div className="flex justify-between text-sm text-gray-600 mb-4 px-2">
          <span>❓ {test.totalQuestions} Questions</span>
          <span>⏱ {test.timeLimit} min</span>
        </div>

        {/* DIVIDER */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4"></div>

        {/* STATUS */}
        <div className="mb-5">
          <span className={`text-sm font-medium px-4 py-1 rounded-full inline-flex items-center gap-2
            ${allowed
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
            }`}
          >
            {allowed ? "✅" : "❌"}
            {allowed
              ? "You can attempt this test"
              : "Attempt limit reached"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          disabled={!allowed}
          onClick={() => navigate(`/quiz/${testId}/start`)}
          className={`w-full py-2 rounded-lg font-medium relative overflow-hidden
            transition-all duration-300
            ${allowed
              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:scale-[1.05] hover:shadow-lg active:scale-95"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          <span className="relative z-10">Start Quiz →</span>

          {allowed && (
            <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition"></span>
          )}
        </button>

        {/* WARNING */}
        <p className="text-xs text-gray-400 mt-3">
          ⚠️ Once started, timer cannot be paused
        </p>

        {/* EXTRA UX */}
        {!allowed && (
          <p className="text-xs text-red-400 mt-2">
            You already attempted this test
          </p>
        )}

      </div>
    </div>
  );
}

export default QuizDetail;