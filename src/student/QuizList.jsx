import { useNavigate } from "react-router-dom";

function QuizList() {
  const navigate = useNavigate();

  const quizzes = ["java", "dbms", "aptitude"];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">📚 Select Quiz</h2>

      <div className="grid gap-4">
        {quizzes.map(q => (
          <div
            key={q}
            className="bg-white p-5 rounded-xl shadow cursor-pointer hover:scale-105"
            onClick={() => navigate(`/quiz/${q}`)}
          >
            <h3 className="text-lg font-semibold uppercase">{q}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;