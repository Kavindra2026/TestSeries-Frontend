import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

function QuizList() {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/tests/active`, {
      headers: getAuthHeader()
    })
      .then(async (res) => {
        if (!res.ok) return [];
        const text = await res.text();
        return text ? JSON.parse(text) : [];
      })
      .then(setTests)
      .catch(() => setTests([]));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-2">
          📚 Select Quiz
        </h2>
        <p className="text-gray-600 text-sm">
          Choose a test and start your challenge
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

        {tests.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center">
            No tests available
          </p>
        ) : (
          tests.map(test => (
            <div
              key={test.id}
              className="group bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-gray-200 
                         transition-all duration-300 
                         hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.03] hover:border-blue-400"
            >

              {/* TITLE */}
              <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-600 transition">
                {test.testName}
              </h3>

              {/* SUBJECT */}
              <p className="text-sm text-gray-500 mb-4">
                📚 {test.subject}
              </p>

              {/* INFO */}
              <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                <span>❓ {test.totalQuestions}</span>
                <span>⏱ {test.timeLimit} min</span>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => navigate(`/quiz/${test.id}`)}
                className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 
             text-white py-2 rounded-lg font-medium 
             opacity-0 group-hover:opacity-100 
             transition duration-300 hover:scale-[1.02]"
              >
                Start Quiz →
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default QuizList;