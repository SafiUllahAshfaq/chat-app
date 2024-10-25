import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useTranslation } from "react-i18next";
import { FaSpinner } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

const AccountPage = () => {
  const router = useRouter();
  const { guestId } = router.query;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [guestData, setGuestData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    address: "",
    zipCode: "",
    city: "",
    country: "",
    image: "",
  });

  useEffect(() => {
    const fetchGuestData = async () => {
      if (guestId) {
        try {
          const response = await axios.get(`/api/guest/${guestId}`);
          const data = response.data;
          setGuestData({
            ...data,
            image: data.image
              ? `data:image/jpeg;base64,${Buffer.from(data.image).toString(
                  "base64"
                )}`
              : "",
          });
        } catch (error) {
          console.error(t("accountPage.errorFetching"), error);
        }
      }
    };

    fetchGuestData();
  }, [guestId, t]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGuestData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setGuestData((prevData) => ({
          ...prevData,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(""); // Reset error message
    try {
      const updatedData = { ...guestData };
      if (guestData.image.startsWith("data:image/")) {
        updatedData.image = guestData.image.split(",")[1]; // Extract base64 string
      }
      await axios.put(`/api/guest/update`, { guestId, ...updatedData });
    } catch (error) {
      const axiosError = error as AxiosError; // Cast error to AxiosError
      if (axiosError.response && axiosError.response.status === 413) {
        setErrorMessage(t("accountPage.imageTooLarge")); // Set specific error message
      } else {
        console.error(t("accountPage.errorUpdating"), error);
      }
    } finally {
      setLoading(false);
      if (!errorMessage) router.back();
    }
  };

  return (
    <>
      <Header title="MY WEBSITE" />
      <div className="min-h-screen bg-pink-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6 bg-primary text-white py-2 rounded-t-lg">
            {t("accountPage.title")}
          </h1>
          <div className="flex justify-center mb-4">
            {guestData.image ? (
              <img
                src={guestData.image}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                <span>{t("accountPage.noImage")}</span>
              </div>
            )}
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-600 text-center">{errorMessage}</div>
          )}
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label htmlFor="firstname" className="block text-gray-700 mb-2">
                {t("accountPage.firstName")}
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={guestData.firstname}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastname" className="block text-gray-700 mb-2">
                {t("accountPage.lastName")}
              </label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={guestData.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 mb-2">
                {t("accountPage.email")}
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full border border-gray-300 p-2 rounded-lg"
                value={guestData.email}
                onChange={handleInputChange}
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
                value={guestData.address}
                onChange={handleInputChange}
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
                value={guestData.zipCode}
                onChange={handleInputChange}
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
                value={guestData.city}
                onChange={handleInputChange}
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
                value={guestData.country}
                onChange={handleInputChange}
              />
            </div>
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
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-primary text-white p-2 rounded"
            >
              {t("accountPage.save")}
              {loading && <CgSpinner className="ml-4 animate-spin" size={16} />}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountPage;
