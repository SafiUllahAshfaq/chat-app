import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaUser, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.type === "host") {
      router.push("/host");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password, "host");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-center pb-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/home")}
          >
            <FaArrowLeft className="text-primary cursor-pointer" />
            <span className="text-sm ml-2">Home</span>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white">
            <FaUser className="w-12 h-12" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                className="p-2 border border-gray-300 rounded w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaUser className="w-5 h-5 text-gray-500 absolute right-2 top-2" />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="p-2 border border-gray-300 rounded w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2 cursor-pointer"
              >
                {showPassword ? (
                  <FaEyeSlash className="w-5 h-5 text-gray-500" />
                ) : (
                  <FaEye className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              className="mr-2"
            />
            <label htmlFor="rememberMe" className="text-gray-700">
              Remember me
            </label>
            <span className="ml-auto text-sm text-primary cursor-pointer">
              Forgot password?
            </span>
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded"
          >
            LOGIN
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/signup" className="text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
