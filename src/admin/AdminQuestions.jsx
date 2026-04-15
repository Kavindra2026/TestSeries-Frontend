import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

// 🔥 SAFE FETCH
const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) return [];
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState([]);

  const [form, setForm] = useState({
    id: null,
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    testId: ""
  });

  const [isEdit, setIsEdit] = useState(false);


  useEffect(() => {
    safeFetch(`${BASE_URL}/tests`, {
      headers: getAuthHeader()
    }).then(setTests);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "testId" ? Number(value) : value   // 🔥 FIX
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.testId) {
      alert("Select Test first!");
      return;
    }
    const loadQuestions = () => {
      safeFetch(`${BASE_URL}/questions`, {
        headers: getAuthHeader()
      }).then(setQuestions);
    };

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${BASE_URL}/questions/${form.id}`
      : `${BASE_URL}/questions`;

    console.log("FORM:", form);
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify(form)
    }).then(() => {
      alert("Saved ✅");
      resetForm();
      loadQuestions();
    });

  };

  const handleEdit = (q) => {
    setForm(q);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleDelete = (id) => {
    if (!window.confirm("Delete this question?")) return;

    fetch(`${BASE_URL}/questions/${id}`, {
      method: "DELETE",
      headers: getAuthHeader()
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
      testId: ""
    });
    setIsEdit(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-6">

      <h1 className="text-3xl font-bold text-center mb-8">
        📝 Manage Questions
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg max-w-xl mx-auto space-y-4"
      >

        <input
          name="question"
          placeholder="Enter Question"
          value={form.question}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
          required
        />

        {["A", "B", "C", "D"].map(opt => (
          <input
            key={opt}
            name={`option${opt}`}
            placeholder={`Option ${opt}`}
            value={form[`option${opt}`]}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          />
        ))}

        {/* ✅ CORRECT ANSWER FIX */}
        <select
          name="correctAnswer"
          value={form.correctAnswer}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Correct Answer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        {/* ✅ TEST DROPDOWN */}
        <select
          name="testId"
          value={form.testId}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Test</option>
          {tests.map(t => (
            <option key={t.id} value={t.id}>
              {t.testName}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg">
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
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>#</th>
              <th>Question</th>
              <th>Options</th>
              <th>Correct</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q, i) => (
              <tr key={q.id} className="border-t">
                <td>{i + 1}</td>
                <td>{q.question}</td>

                <td>
                  A: {q.optionA} <br />
                  B: {q.optionB} <br />
                  C: {q.optionC} <br />
                  D: {q.optionD}
                </td>

                <td>{q.correctAnswer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}