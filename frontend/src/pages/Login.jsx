import React, { useState, useContext } from "react";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(form);
      const { token, user } = res.data;

      // Save token and user
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // ALSO SAVE ROLE + USER ID (REQUIRED)
      localStorage.setItem("role", user.role);
      localStorage.setItem("user_id", user.id);

      login(user,token); // update context

      // redirect based on role
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "owner") navigate("/owner");
      else navigate("/user");

    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };
 
  console.log("TOKEN SAVED:", token);
  console.log("USER SAVED:", user);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full mb-3 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full mb-4 rounded"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
