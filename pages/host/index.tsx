import { useRouter } from "next/router";
import PrivateRoute from "../../AuthGuards/HostPrivateRoute";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

// pages/host/HostPage.tsx
const HostPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  const userName = "John"; // Replace this with the actual user's name

  return (
    <PrivateRoute>
      <div className="flex flex-col h-screen">
        <Header title="MY WEBSITE" />
        <div className="flex-1 bg-pink-100 flex flex-col items-center p-4 pt-10">
          <h1 className="text-xl mb-4 text-center">
            {t("hostPage.welcome", { name: user?.firstName })}
          </h1>
          <div className="space-y-4 w-full max-w-xs">
            <button
              onClick={() => router.push("/host/messenger")}
              className="w-full bg-primary text-white p-2 rounded"
            >
              {t("hostPage.messenger")}
            </button>
            <button
              onClick={() => router.push("/host/myaccount")}
              className="w-full bg-primary text-white p-2 rounded"
            >
              {t("hostPage.myAccount")}
            </button>
            <button
              onClick={() => router.push("/host/chat-urls")}
              className="w-full bg-primary text-white p-2 rounded"
            >
              {t("hostPage.chatUrls")}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </PrivateRoute>
  );
};

export default HostPage;
