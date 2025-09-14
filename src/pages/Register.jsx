import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    nic: "",
    email: "",
    password: "",
    confirmPassword: "",
    pin: "",
    bank: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // ✅ Register user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // ✅ Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        nic: formData.nic,
        email: formData.email,
        pin: formData.pin, // ⚠️ Consider hashing this
        bank: formData.bank, // ⚠️ Consider masking/saving securely
        createdAt: serverTimestamp(),
        rewards: 0, // user starts with 0 rupees
        history: [], // waste deposit history
      });

      alert("🎉 Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-gray-800 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-4 text-green-400">User Registration</h2>
      {error && <p className="text-red-400 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="nic"
          placeholder="NIC Number"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="pin"
          placeholder="4-digit PIN"
          onChange={handleChange}
          maxLength="4"
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />
        <input
          type="text"
          name="bank"
          placeholder="Bank Account Details"
          onChange={handleChange}
          required
          className="w-full p-2 rounded bg-gray-700 focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 p-2 rounded text-white font-semibold transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
