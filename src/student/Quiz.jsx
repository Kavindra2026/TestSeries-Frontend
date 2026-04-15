import { useEffect, useState, useRef } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";
import { useParams, useNavigate } from "react-router-dom";

function Quiz() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [submitted, setSubmitted] = useState(false);

  const timerRef = useRef(null);

  // ✅ LOAD QUESTIONS
  useEffect(() => {
    fetch(`${BASE_URL}/questions/test/${testId}`, {
      headers: getAuthHeader(),
    })
      .then(res => res.text())   // 🔥 FIX
      .then(text => {
        const data = text ? JSON.parse(text) : [];
        setQuestions(data);

        const initial = {};
        data.forEach(q => {
          initial[q.id] = null;
        });
        setAnswers(initial);
      });
  }, [testId]);

  // ✅ TIMER
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // ✅ SAVE START TIME
  useEffect(() => {
    localStorage.setItem("startTime", new Date().toISOString());
  }, []);

  const handleAnswer = (id, option) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  // ✅ SUBMIT
  const submitQuiz = async () => {
    if (submitted) return;
    setSubmitted(true);

    try {
      localStorage.setItem("answers", JSON.stringify(answers));

      const res = await fetch(`${BASE_URL}/result`, {
        method: "POST",
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
          startTime: localStorage.getItem("startTime"),
          testId,
        }),
      });

      const data = await res.json();

      localStorage.setItem("result", JSON.stringify(data));
      localStorage.setItem("testId", testId);
      localStorage.removeItem("startTime");

      navigate("/result");

    } catch {
      alert("❌ Submission failed");
      setSubmitted(false);
    }
  };

  const q = questions[current];

  const answeredCount = Object.values(answers).filter(v => v !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      {/* TOP BAR */}
      <div className="max-w-4xl mx-auto flex justify-between mb-6">
        <h2 className="text-xl font-bold">📝 Quiz</h2>

        <div className="flex gap-4">
          <span>⏱ {timeLeft}s</span>
          <span>Answered: {answeredCount}/{questions.length}</span>
        </div>
      </div>

      {/* QUESTION */}
      <div className="max-w-4xl mx-auto bg-white p-5 rounded-xl shadow">

        {q && (
          <>
            <h3 className="font-semibold mb-3">
              Q{current + 1}. {q.question}
            </h3>

            <div className="space-y-2">
              {["A", "B", "C", "D"].map(opt => (
                <label
                  key={opt}
                  className={`block p-2 border rounded cursor-pointer
                    ${answers[q.id] === opt ? "bg-blue-100 border-blue-500" : ""}
                  `}
                >
                  <input
                    type="radio"
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswer(q.id, opt)}
                  />
                  <span className="ml-2">
                    {opt}. {q[`option${opt}`]}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between mt-4">

          <button
            disabled={current === 0}
            onClick={() => setCurrent(c => c - 1)}
            className="bg-gray-300 px-4 py-1 rounded"
          >
            Prev
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={submitQuiz}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Next
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

export default Quiz;