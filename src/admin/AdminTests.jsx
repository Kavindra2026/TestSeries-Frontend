import { useEffect, useState } from "react";
import BASE_URL from "../api/api";
import { getAuthHeader } from "../utils/auth";

// 🔥 SAFE FETCH (NO CRASH)
const safeFetch = async (url, options = {}) => {
  const res = await fetch(url, options);
  if (!res.ok) return [];
  const text = await res.text();
  return text ? JSON.parse(text) : [];
};

export default function AdminTests() {
  const [tests, setTests] = useState([]);

  const [form, setForm] = useState({
    id: null,
    testName: "",
    subject: "",
    totalQuestions: "",
    timeLimit: "",
    active: true
  });

  const [isEdit, setIsEdit] = useState(false);

  // 🔥 LOAD TESTS
  const loadTests = () => {
    safeFetch(`${BASE_URL}/tests`, {
      headers: getAuthHeader()
    }).then(setTests);
  };

  useEffect(() => {
    loadTests();
  }, []);

  // 🔄 INPUT CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // ✅ ADD / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `${BASE_URL}/tests/${form.id}`
      : `${BASE_URL}/tests`;

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader()
      },
      body: JSON.stringify(form)
    }).then(() => {
      loadTests();   // 🔥 reload data
      resetForm();
    });
  };

  // ✏️ EDIT
  const handleEdit = (t) => {
    setForm(t);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ❌ DELETE
  const handleDelete = (id) => {
    if (!window.confirm("Delete this test?")) return;

    fetch(`${BASE_URL}/tests/${id}`, {
      method: "DELETE",
      headers: getAuthHeader()
    }).then(loadTests);
  };

  // 🔄 RESET FORM
  const resetForm = () => {
    setForm({
      id: null,
      testName: "",
      subject: "",
      totalQuestions: "",
      timeLimit: "",
      active: true
    });
    setIsEdit(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen">

      <h1 className="text-3xl font-bold text-center mb-6">
        🧪 Manage Tests
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-xl mx-auto space-y-4"
      >

        <input
          name="testName"
          placeholder="Test Name"
          value={form.testName}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          name="subject"
          placeholder="Subject (Java / DBMS)"
          value={form.subject}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="number"
          name="totalQuestions"
          placeholder="Total Questions"
          value={form.totalQuestions}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          name="timeLimit"
          placeholder="Time Limit (minutes)"
          value={form.timeLimit}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="active"
            checked={form.active}
            onChange={handleChange}
          />
          Active Test
        </label>

        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-5 py-2 rounded">
            {isEdit ? "Update Test" : "Create Test"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

      </form>

      {/* TABLE */}
      <div className="mt-10 max-w-5xl mx-auto bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full text-center">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Subject</th>
              <th>Questions</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tests.map((t, i) => (
              <tr key={t.id} className="border-t">

                <td>{i + 1}</td>
                <td>{t.testName}</td>
                <td>{t.subject}</td>
                <td>{t.totalQuestions}</td>
                <td>{t.timeLimit} min</td>

                <td>
                  {t.active ? "🟢 Active" : "🔴 Disabled"}
                </td>

                <td className="flex gap-2 justify-center p-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
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