import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebaseConfig";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email login user:", userCredential.user);
      navigate("/home");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google login user:", result.user);
      navigate("/home");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200 flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-pink-300 text-2xl">💖</div>
      <div className="absolute top-20 right-20 text-rose-300 text-xl">✨</div>
      <div className="absolute bottom-20 left-20 text-pink-300 text-lg">💕</div>
      <div className="absolute bottom-10 right-10 text-rose-300 text-2xl">🌸</div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#fca2cd] rounded-full mb-4 shadow-lg">
            <span className="text-white text-2xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              Femora
            </span>
          </h1>
          <p className="text-gray-600">Log in to continue your health journey</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-pink-100">
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex gap-3 text-sm font-medium text-pink-950 ml-1">
                <Heart className="h-[3.5] w-4" />
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-400">📧</span>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="flex gap-3 text-sm font-medium text-pink-950 ml-1">
                <Heart className="h-[3.5] w-4" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-gray-400">🔒</span>
                </div>
              </div>
            </div>

            {/* Log In Button */}
            <button
              type="submit"
              className="w-full bg-[#D284AB] text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
            >
              Log In 🔐
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>🌸</span>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By logging in, you agree to our{" "}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-pink-500 hover:text-pink-600 underline">
                Privacy Policy
              </a>
            </p>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <a href="/signup" className="text-pink-500 hover:text-pink-600 font-medium underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
