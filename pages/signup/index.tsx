import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaUser, FaEye, FaEyeSlash, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { hostSignup } from "../../requests/api";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const data = {
        firstName,
        lastName,
        email,
        password,
        address: "Default Address", // Add address, zipCode, city, country fields as per your form design
        zipCode: "00000",
        city: "Default City",
        country: "Default Country",
        image: "data:image/png;base64,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",
      };
      await hostSignup(data);
      router.push("/login");
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
            <label htmlFor="firstName" className="block text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="p-2 border border-gray-300 rounded w-full"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="p-2 border border-gray-300 rounded w-full"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
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
              <FaEnvelope className="w-5 h-5 text-gray-500 absolute right-2 top-2" />
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
            SIGN UP
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="text-primary">
            <span className="text-black mr-1">Already have an account?</span>
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
