import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";
import { getRoleFromToken } from "../utils/jwt";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("⚠️ Fill all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setError("❌ Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.token) {
        // 🔥 STORE
        localStorage.setItem("token", data.token);

        const role = getRoleFromToken(data.token);
        localStorage.setItem("role", role);
        // localStorage.setItem("studentName", email);
      localStorage.setItem("studentName", data.studentName);
        

        // ⚡ INSTANT NAVIGATION (NO DELAY)
        if (role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/student", { replace: true });
        }
      } else {
        setError("❌ Login failed");
      }

    } catch (err) {
      setError("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">

        <h2 className="text-2xl font-bold text-center mb-6">
          🔐 Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* PASSWORD */}
        <div className="relative mb-5">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />

          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {show ? "🙈" : "👁"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* REGISTER */}
        <p className="text-center text-sm mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 cursor-pointer font-semibold"
          >
            Register
          </span>
        </p>

        <p className="text-center text-xs text-gray-500 mt-2">
          ⚡ Instant Login Enabled
        </p>
      </div>
    </div>
  );
}

export default Login;