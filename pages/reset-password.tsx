import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding confirm password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { token } = router.query; // Get token from URL

  useEffect(() => {
    if (token) {
      setError(""); // Clear the error if token is found
    } else {
      setError("Invalid or missing token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate that passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("No reset token found. Please use a valid reset link.");
      return;
    }

    try {
      const response = await axios.post(`/api/host/reset-password`, {
        password,
        token, // Send token to the backend for verification
      });

      if (response.status === 200) {
        setSuccess("Password reset successfully.");
        router.push("/login"); // Redirect user to login after success
      } else {
        setError("An error occurred while resetting your password.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Axios error handling
        setError(
          err.response?.data?.message ||
            "An error occurred while resetting your password."
        );
      } else if (err instanceof Error) {
        // General error handling
        setError(
          err.message || "An error occurred while resetting your password."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex items-center pb-4">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push("/login")}
          >
            <FaArrowLeft className="text-primary cursor-pointer" />
            <span className="text-sm ml-2">Back</span>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center text-white">
            <FaUser className="w-12 h-12" />
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              New Password
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

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="p-2 border border-gray-300 rounded w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-2 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="w-5 h-5 text-gray-500" />
                ) : (
                  <FaEye className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
