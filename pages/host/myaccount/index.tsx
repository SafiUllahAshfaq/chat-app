import { useEffect, useState } from "react";
import HostRoute from "../../../AuthGuards/HostPrivateRoute";
import Header from "../../../components/Header";
import { getHostInfo, updateHostInfo } from "../../../requests/api";
import { useAuth } from "../../../context/AuthContext";
import Footer from "../../../components/Footer";
import { useTranslation } from "react-i18next";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const AccountPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [hostInfo, setHostInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchHostInfo = async () => {
      if (user?.email) {
        try {
          const data = await getHostInfo(user.email);
          setHostInfo(data);
          if (data.image) {
            setImagePreview(`data:image/png;base64,${data.image}`);
          }
        } catch (err) {
          setError((err as Error).message || t("accountPage.errorFetching"));
        }
      }
    };

    fetchHostInfo();
  }, [user?.email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHostInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1];
        setHostInfo((prevInfo) => ({
          ...prevInfo,
          image: base64String || "",
        }));
        setImagePreview(reader.result?.toString() || "");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateHostInfo(hostInfo);
      setSuccess(t("accountPage.successUpdating"));
    } catch (err) {
      setError((err as Error).message || t("accountPage.errorUpdating"));
    }
  };

  return (
    <HostRoute>
      <Header title="MY WEBSITE" />
      <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
        <div className="w-full">
          <FaArrowLeft
            className="text-primary cursor-pointer"
            onClick={() => router.push("/host")}
          />
        </div>

        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6 bg-primary text-white py-2 rounded-t-lg">
            {t("accountPage.title")}
          </h1>
          <div className="flex justify-center mb-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <span>{t("accountPage.noImage")}</span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700 mb-2">
                {t("accountPage.profileImage")}
              </label>
              <input
                type="file"
                id="image"
                name="image"
                className="w-full border border-gray-300 p-2 rounded-lg"
                onChange={handleImageChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-gray-700 mb-2">
                {t("accountPage.firstName")}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 mb-2">
                {t("accountPage.lastName")}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.lastName}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                {t("accountPage.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.email}
                disabled
              />
            </div>
            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 mb-2">
                {t("accountPage.address")}
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.address}
                onChange={handleChange}
                placeholder="12, palm street"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="zipCode" className="block text-gray-700 mb-2">
                {t("accountPage.zipCode")}
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.zipCode}
                onChange={handleChange}
                placeholder="75003"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="city" className="block text-gray-700 mb-2">
                {t("accountPage.city")}
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.city}
                onChange={handleChange}
                placeholder="Paris"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="country" className="block text-gray-700 mb-2">
                {t("accountPage.country")}
              </label>
              <input
                type="text"
                id="country"
                name="country"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={hostInfo.country}
                onChange={handleChange}
                placeholder="France"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded"
            >
              {t("accountPage.save")}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </HostRoute>
  );
};

export default AccountPage;
