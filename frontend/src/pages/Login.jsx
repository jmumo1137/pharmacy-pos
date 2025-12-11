import { useState, useContext } from "react";
import { loginUser, registerUser } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "Cashier" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const res = await loginUser(form);
        login(res.user, res.token);
        navigate("/dashboard");
      } else {
        const res = await registerUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        alert(`User created: ${res.user.email}`);
        setMode("login"); // switch to login after registration
      }
    } catch (err) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 shadow-lg rounded-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">{mode === "login" ? "Login" : "Register"}</h2>

        {error && <p className="text-red-600 text-center mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 border rounded-lg"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <select
                value={form.role}
                className="w-full p-3 border rounded-lg"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option>Admin</option>
                <option>Pharmacist</option>
                <option>Cashier</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition">
            {mode === "login" ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-4">
          {mode === "login" ? (
            <p>
              Don't have an account?{" "}
              <button className="text-blue-600 font-semibold" onClick={() => setMode("register")}>
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button className="text-blue-600 font-semibold" onClick={() => setMode("login")}>
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
