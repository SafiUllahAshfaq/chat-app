import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { useLanguage } from "../../context/LanguageContext";

const PrivacyPolicyPage = () => {
  const [content, setContent] = useState<{
    contentEng: string;
    contentFre: string;
  } | null>(null);
  const { language } = useLanguage(); // Use the language context

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get("/api/privacy-policy/get");
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      }
    };

    fetchPolicy();
  }, []);

    if (!content) {
      return <div>Loading...</div>;
    }

  const finalContent =
    language === "fr" ? content.contentFre : content?.contentEng;

  return (
    <>
      <Header title="MY WEBSITE" />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
        {/* Render the HTML content using dangerouslySetInnerHTML */}
        <div
          dangerouslySetInnerHTML={{
            __html: finalContent || "No privacy policy available",
          }}
        />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;
