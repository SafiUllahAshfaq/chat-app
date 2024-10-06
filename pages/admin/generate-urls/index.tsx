import { useState } from "react";
import Header from "../../../components/Header";
import AdminRoute from "../../../AuthGuards/AdminAuthGuard";
import URLsStringComponent from "../../../components/URLsStringComponent";
import { generateHostUrls } from "../../../requests/api";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

interface UrlWithDate {
  url: string;
  createdAt: Date;
}

const GenerateUrlsPage = () => {
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState(50);
  const [email, setEmail] = useState("john.doe@gmail.com");
  const [urls, setUrls] = useState<UrlWithDate[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGenerateUrls = async () => {
    if (quantity > 0) {
      try {
        const data = await generateHostUrls(email, quantity);
        const urlsWithDates = data.urls.map((url: string) => ({
          url,
          createdAt: new Date(),
        }));
        setUrls(urlsWithDates); // Store the generated URLs with creation date
        setError("");
      } catch (err) {
        setError((err as Error).message || t("generateUrls.error"));
      }
    } else {
      setError("Kindly enter a valid number of Quantity")
    }
  };

  const handleExportToExcel = () => {
    const worksheetData = urls.map(({ url, createdAt }) => ({
      URL: url,
      CreatedAt: createdAt.toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "URLs");

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "generated_urls.xlsx");
  };

  return (
    <AdminRoute>
      <>
        <Header title={t("header.title")} />
        <div className="w-full p-4  bg-white">
          <FaArrowLeft
            className="text-primary cursor-pointer"
            onClick={() => router.push("/admin/manage")}
          />
        </div>
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
            <form>
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-gray-700 mb-2">
                  {t("generateUrls.quantity")}
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  value={
                    quantity > 0 ? quantity : quantity === 0 ? "" : quantity
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantity(value === "" ? 0 : Number(value)); // Set the value to 0 if the input is empty, otherwise set the number
                  }}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  {t("generateUrls.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-gray-300 p-2 rounded-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="w-full bg-primary text-white p-2 rounded"
                onClick={handleGenerateUrls}
              >
                {t("generateUrls.generateButton")}
              </button>
            </form>
            {error && <p className="text-red-500">{error}</p>}
            {urls.length > 0 && (
              <>
                <div className="py-2">
                  <URLsStringComponent
                    urls={urls.map((urlObj) => urlObj.url)}
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-primary text-white p-2 rounded"
                  onClick={handleExportToExcel}
                >
                  {t("generateUrls.exportButton")}
                </button>
              </>
            )}
          </div>
        </div>
      </>
    </AdminRoute>
  );
};

export default GenerateUrlsPage;
