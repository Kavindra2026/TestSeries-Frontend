import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    id: null,
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    category: "java",
  });

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/questions`, {
      headers: getAuthHeader(),
    })
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${BASE_URL}/questions/${form.id}`
      : `${BASE_URL}/questions`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(form),
    })
      .then(res => res.json())
      .then(saved => {
        if (isEdit) {
          setQuestions(prev =>
            prev.map(q => (q.id === saved.id ? saved : q))
          );
        } else {
          setQuestions(prev => [...prev, saved]);
        }
        resetForm();
      });
  };

  const handleEdit = (q) => {
    setForm(q);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" }); // 🔥 smooth UX
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this question?")) return;

    fetch(`${BASE_URL}/questions/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    }).then(() => {
      setQuestions(prev => prev.filter(q => q.id !== id));
    });
  };

  const resetForm = () => {
    setForm({
      id: null,
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      category: "java",
    });
    setIsEdit(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      {/* TITLE */}
      <h1 className="text-3xl font-bold text-center mb-8">
        📝 Manage Questions
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4 border"
      >
        <input
          name="question"
          placeholder="Enter Question"
          value={form.question}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {["A", "B", "C", "D"].map(opt => (
          <input
            key={opt}
            name={`option${opt}`}
            placeholder={`Option ${opt}`}
            value={form[`option${opt}`]}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        ))}

        <select
          name="correctAnswer"
          value={form.correctAnswer}
          onChange={handleChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Correct Answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <div className="flex gap-3">
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition">
            {isEdit ? "Update Question" : "Add Question"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="mt-10 max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="p-4">#</th>
              <th className="p-4">Question</th>
              <th className="p-4">Options</th>
              <th className="p-4">Correct</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q, i) => (
              <tr key={q.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">{i + 1}</td>

                <td className="p-4 font-medium">{q.question}</td>

                <td className="p-4 text-sm space-y-1">
                  <p><span className="font-semibold text-blue-600">A:</span> {q.optionA}</p>
                  <p><span className="font-semibold text-blue-600">B:</span> {q.optionB}</p>
                  <p><span className="font-semibold text-blue-600">C:</span> {q.optionC}</p>
                  <p><span className="font-semibold text-blue-600">D:</span> {q.optionD}</p>
                </td>

                <td className="p-4">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                    {q.correctAnswer}
                  </span>
                </td>

                <td className="p-4 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(q)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded-lg shadow"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(q.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}