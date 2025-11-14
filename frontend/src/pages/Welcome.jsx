import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Welcome to Store Rating App
      </h1>
      <p className="text-gray-600 mb-8">
        Rate and review your favorite stores easily!
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Welcome;
