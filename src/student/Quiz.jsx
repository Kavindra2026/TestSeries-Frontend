import { useEffect, useState, useRef } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function Quiz() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
  }, [testId]);


  useEffect(() => {
    const init = async () => {

      localStorage.removeItem(`endTime_${testId}`);
      localStorage.removeItem(`timeLimit_${testId}`);

      const startRes = await fetch(`${BASE_URL}/tests/start/${testId}`, {
        method: "POST",
        headers: getAuthHeader()
      });

      if (!startRes.ok) {
        alert("❌ Failed to start test");
        navigate("/quiz");
        return;
      }

      // 🔥 GET TEST (IMPORTANT)
      const testRes = await fetch(`${BASE_URL}/tests/${testId}`, {
        headers: getAuthHeader()
      });

      const testData = await testRes.json();
      const realTimeLimit = testData.timeLimit * 60;

      setTimeLeft(realTimeLimit);

      localStorage.setItem(`timeLimit_${testId}`, realTimeLimit);

      const res = await fetch(`${BASE_URL}/questions/test/${testId}`, {
        headers: getAuthHeader(),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : [];

      setQuestions(data);

      const initial = {};
      data.forEach(q => (initial[q.id] = null));
      setAnswers(initial);

      setReady(true);
    }; init();
  }, [testId]);

  useEffect(() => {
    if (!ready) return; // 🔥 IMPORTANT

    const key = `endTime_${testId}`;
    const storedLimit = localStorage.getItem(`timeLimit_${testId}`);

    if (!storedLimit) return;

    const finalLimit = Number(storedLimit);
    let end;

    const savedEnd = localStorage.getItem(key);

    if (savedEnd) {
      end = Number(savedEnd);
    } else {
      end = Date.now() + finalLimit * 1000;
      localStorage.setItem(key, end);
    }

    const updateTimer = () => {
      const remaining = Math.floor((end - Date.now()) / 1000);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        setTimeLeft(0);

        if (!submitted) submitQuiz();
      } else {
        setTimeLeft(remaining);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(timerRef.current);

  }, [testId, ready]);

  const handleAnswer = (id, option) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

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
          testId: Number(testId),
        }),
      });

      const data = await res.json();

      localStorage.setItem("result", JSON.stringify(data));
      localStorage.setItem("testId", testId);

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

      {/* 🔥 TOP BAR */}
      <div className="sticky top-0 bg-white shadow rounded-xl p-4 mb-4 max-w-6xl mx-auto flex justify-between z-10">
        <h2 className="font-bold text-lg">📝 Quiz</h2>

        <div className="flex gap-6 font-medium">
          <span>⏱ {formatTime(timeLeft)}</span>
          <span>{answeredCount}/{questions.length}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-4 gap-5">

        {/* 🔥 QUESTION AREA */}
        <div className="col-span-3 bg-white p-6 rounded-2xl shadow">

          {q && (
            <>
              <h3 className="font-semibold mb-5 text-lg">
                Q{current + 1}. {q.question}
              </h3>

              <div className="space-y-3">
                {["A", "B", "C", "D"].map(opt => (
                  <div
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all
                      ${answers[q.id] === opt
                        ? "bg-blue-100 border-blue-500 scale-[1.02]"
                        : "hover:bg-gray-50"}
                    `}
                  >
                    <span className="font-medium">{opt}.</span>{" "}
                    {q[`option${opt}`]}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 🔥 BUTTONS */}
          <div className="flex justify-between mt-6">
            <button
              disabled={current === 0}
              onClick={() => setCurrent(c => c - 1)}
              className="bg-gray-300 px-4 py-2 rounded-lg"
            >
              Prev
            </button>

            {current === questions.length - 1 ? (
              <button disabled={!ready}
                onClick={submitQuiz}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:scale-105"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={() => setCurrent(c => c + 1)}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:scale-105"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* 🔥 PALETTE */}
        <div className="bg-white p-4 rounded-2xl shadow h-fit">

          <h4 className="font-semibold mb-3">Questions</h4>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <div
                key={q.id}
                onClick={() => setCurrent(i)}
                className={`text-center py-2 rounded cursor-pointer text-sm font-medium transition
                  ${current === i
                    ? "bg-blue-500 text-white"
                    : answers[q.id]
                      ? "bg-green-300"
                      : "bg-gray-200"}
                `}
              >
                {i + 1}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Quiz;