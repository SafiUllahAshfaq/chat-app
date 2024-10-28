import { useState } from "react";
import { useRouter } from "next/router";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import axios, { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`/api/host/forget-password`, { email });

      if (response.status === 200) {
        setSuccess("Password reset link sent to your email.");
      } else {
        setError("An error occurred while sending the reset email.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Axios error handling
        setError(
          err.response?.data?.message ||
            "An error occurred while sending the reset email."
        );
      } else if (err instanceof Error) {
        // General error handling
        setError(
          err.message || "An error occurred while sending the reset email."
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
            <span className="text-sm ml-2">{t("auth.back")}</span>
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
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              {t("auth.email")}
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
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded"
          >
            {t("auth.sendLink")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
