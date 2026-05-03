import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in user:", userCredential.user);

      navigate("/dashboard"); // 🔥 MOST IMPORTANT LINE
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Logged in user with Google:", userCredential.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-5"
      >
        <div className="text-center">
          <Heart className="mx-auto w-10 h-10 text-blue-600 mb-2" />
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-500">Login to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="relative flex items-center justify-center w-full py-2">
          <div className="border-t border-gray-200 w-full"></div>
          <span className="bg-white px-3 text-sm text-gray-500 absolute">OR</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
