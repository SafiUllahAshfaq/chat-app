import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useLanguage } from "../../context/LanguageContext"; // Import the useLanguage hook
import { useAuth } from "../../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { language } = useLanguage(); // Use the language context
  const [homeContent, setHomeContent] = useState<{
    backgroundImage: string;
    textFre: string;
    textEng: string;
    titleFre: string;
    titleEng: string;
  } | null>(null);

  useEffect(() => {
    const fetchHomeContent = async () => {
      try {
        const response = await axios.get("/api/homepage/get");
        setHomeContent(response.data);
      } catch (error) {
        console.error("Failed to fetch homepage content", error);
      }
    };

    fetchHomeContent();
  }, []);

  if (!homeContent) {
    return <div>Loading...</div>;
  }

  // Use the language to determine which content to display
  const title = language === "fr" ? homeContent.titleFre : homeContent.titleEng;
  const textContent =
    language === "fr" ? homeContent.textFre : homeContent.textEng;

  return (
    <div className="flex flex-col h-screen bg-pink-100">
      <Header title="MY WEBSITE" />
      <div
        className="text-center flex-1 bg-cover bg-center"
        style={{ backgroundImage: `url(${homeContent.backgroundImage})` }}
      >
        <div className="w-full text-white p-4 md:py-16 md:px-56 bg-[rgba(0,0,0,0.2)] bottom-0">
          <h1 className="mt-5 text-5xl">{title}</h1>
          <h1 className="mt-5 text-2xl">{textContent}</h1>
          {isAuthenticated ? (
            <p className="mt-5">
              {t("homepage.goto")}{" "}
              <Link
                href={
                  JSON.parse(localStorage.getItem("user") || "").type ===
                  "admin"
                    ? "admin/manage"
                    : "host"
                }
              >
                <span className="text-blue-400">{t("homepage.menu")}</span>
              </Link>
            </p>
          ) : (
            <p className="mt-5">
              {t("homepage.signupPrompt")}{" "}
              <Link href="/signup">
                <span className="text-blue-400">{t("homepage.here")}</span>
              </Link>
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
