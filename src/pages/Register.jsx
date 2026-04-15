import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    password: "",
    otp: ""
  });

  const [step, setStep] = useState(1);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ VALIDATION
  const validateForm = () => {
    if (!form.name || !form.email || !form.phone || !form.state || !form.password) {
      setMsg("⚠️ Fill all fields");
      return false;
    }

    if (!form.email.includes("@")) {
      setMsg("❌ Invalid email");
      return false;
    }

    if (form.phone.length !== 10) {
      setMsg("❌ Invalid phone number");
      return false;
    }

    return true;
  };

  // ✅ SEND OTP
  const sendOtp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${BASE_URL}/auth/send-otp?email=${form.email}`, {
        method: "POST"
      });

      if (res.ok) {
        setMsg("✅ OTP sent to email");
        setStep(2);
      } else {
        const text = await res.text();
        setMsg(text || "❌ Failed to send OTP");
      }
    } catch {
      setMsg("❌ Server error");
    }

    setLoading(false);
  };

  // ✅ REGISTER
  const register = async () => {
    if (!form.otp) {
      setMsg("❌ Enter OTP");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            studentName: form.name,
            email: form.email,
            phone: form.phone,
            state: form.state,
            password: form.password
          },
          otp: form.otp
        })
      });

      const text = await res.text();

      if (res.ok) {
        setMsg("🎉 Registered Successfully!");

        setTimeout(() => {
          navigate("/");
        }, 1500);

      } else {
        setMsg(text || "❌ Registration failed");
      }

    } catch {
      setMsg("❌ Server error");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-5">
          📝 Register
        </h2>

        {/* MESSAGE */}
        {msg && (
          <p className="text-center text-sm mb-3 text-gray-700">
            {msg}
          </p>
        )}

        {/* INPUT GRID */}
        <div className="grid grid-cols-2 gap-3">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange}
            className="input" disabled={step === 2} />

          <input name="email" placeholder="Email" value={form.email} onChange={handleChange}
            className="input" disabled={step === 2} />

          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
            className="input" disabled={step === 2} />

          <input name="state" placeholder="State" value={form.state} onChange={handleChange}
            className="input" disabled={step === 2} />
        </div>

        {/* PASSWORD */}
        <div className="relative mt-3">
          <input
            name="password"
            type={show ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="input"
            disabled={step === 2}
          />
          <span
            onClick={() => setShow(!show)}
            className="absolute right-3 top-3 cursor-pointer"
          >
            {show ? "🙈" : "👁"}
          </span>
        </div>

        {/* STEP */}
        {step === 1 ? (
          <button onClick={sendOtp} disabled={loading} className="btn mt-3">
            {loading ? "⏳ Sending..." : "Send OTP"}
          </button>
        ) : (
          <>
            <input
              name="otp"
              placeholder="Enter OTP"
              value={form.otp}
              onChange={handleChange}
              className="input mt-3"
            />

            <button onClick={register} disabled={loading} className="btn mt-3">
              {loading ? "⏳ Registering..." : "Register"}
            </button>

            <p
              onClick={sendOtp}
              className="text-blue-600 text-sm text-center mt-2 cursor-pointer"
            >
              Resend OTP
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;