import { useEffect, useState, useRef } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const { category } = useParams();
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!category) return; // ✅ IMPORTANT

    fetch(`${BASE_URL}/questions/category/${category}`, {
      headers: getAuthHeader()
    })
      .then(res => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then(data => {
        setQuestions(data);

        const initialAnswers = {};
        data.forEach(q => {
          initialAnswers[q.id] = null;
        });
        setAnswers(initialAnswers);
      })
      .catch(err => console.error(err));

  }, [category]); // ✅ ADD THIS

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          submit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    localStorage.setItem("startTime", new Date().toISOString());
  }, []);

  const handleAnswer = (id, option) => {
    setAnswers(prev => ({ ...prev, [id]: option }));
  };

  const submit = async () => {
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
          category   // ✅ ADD THIS
        }),
      });

      const data = await res.json();


      localStorage.removeItem("startTime");
      localStorage.setItem("result", JSON.stringify(data));

      navigate("/result");
    } catch (err) {
      alert("❌ Submission failed");
      setSubmitted(false);
    }
  };

  const q = questions[current];

  const answeredCount = Object.values(answers).filter(v => v !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      {/* TOP BAR */}
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">📝 Quiz</h2>
        <div className="flex gap-4 items-center">
          <span className="font-medium">
            ⏱ {timeLeft}s
          </span>
          <span className="text-sm bg-blue-100 px-3 py-1 rounded-full">
            Answered: {answeredCount}/{questions.length}
          </span>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">

        {q && (
          <>
            <h3 className="text-lg font-semibold mb-4">
              Q{current + 1}. {q.question}
            </h3>

            <div className="space-y-3">
              {["A", "B", "C", "D"].map(opt => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition 
                    ${answers[q.id] === opt
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-100"
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswer(q.id, opt)}
                  />
                  <span>
                    <b>{opt}.</b> {q[`option${opt}`]}
                  </span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* NAVIGATION */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrent(prev => prev - 1)}
            disabled={current === 0}
            className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
          >
            ⬅ Prev
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={submit}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
            >
              Submit ✅
            </button>
          ) : (
            <button
              onClick={() => setCurrent(prev => prev + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Next ➡
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
