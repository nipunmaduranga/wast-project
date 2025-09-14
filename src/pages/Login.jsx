import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Firebase Login
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // ✅ Redirect to JoystickDashboard
      navigate("/user-object");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4 text-green-400">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded text-white font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
