import { useEffect, useState } from "react";
import URLsComponent from "../../../components/URLsComponent";
import Header from "../../../components/Header";
import PrivateRoute from "../../../AuthGuards/HostPrivateRoute";
import { useAuth } from "../../../context/AuthContext";
import { getHostUrls } from "../../../requests/api";
import HostRoute from "../../../AuthGuards/HostPrivateRoute";
import Footer from "../../../components/Footer";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

interface UrlObject {
  url: string;
  isActive: boolean;
  _id: string;
}

const HostChatUrlsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [urls, setUrls] = useState<UrlObject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        if (user && user.email) {
          const data = await getHostUrls(user.email);
          setUrls(data.urls);
        }
      } catch (err) {
        setError((err as Error).message || t("hostChatUrlsPage.errorOccurred"));
      }
    };

    fetchUrls();
  }, [user, t]);

  const handleExportToExcel = () => {
    const worksheetData = urls.map(({ url, isActive }) => ({
      URL: url,
      CreatedAt: new Date().toLocaleString(), // Assuming URLs are created at the time of export
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "URLs");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "host_urls.xlsx");
  };

  return (
    <HostRoute>
      <div className="flex flex-col h-screen">
        <Header title="MY WEBSITE" />
        <div className="flex-1 bg-pink-100 flex flex-col items-center justify-center p-4">
        <div className="w-full">
          <FaArrowLeft className="text-primary cursor-pointer" onClick={()=> router.push("/host")} />
        </div>
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            {error && <p className="text-red-500">{error}</p>}
            <p className="mb-3">{t("hostChatUrlsPage.findUrls")}</p>
            {urls.length > 0 && (
              <>
                <URLsComponent urls={urls} />
                <button
                  type="button"
                  className="w-full bg-primary text-white p-2 rounded-full mt-4"
                  onClick={handleExportToExcel}
                >
                  {t("hostChatUrlsPage.exportToExcel")}
                </button>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </HostRoute>
  );
};

export default HostChatUrlsPage;
