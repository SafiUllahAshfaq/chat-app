import { useRouter } from "next/router";
import AdminRoute from "../../../AuthGuards/AdminAuthGuard";
import Header from "../../../components/Header";
import { useTranslation } from "react-i18next";

// pages/host/HostPage.tsx
const AdminManagePage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <AdminRoute>
      <Header title={t("adminManagePage.title")} />
      <div className="min-h-screen bg-white flex flex-col items-center p-4 pt-10">
        <h1 className="text-xl mb-4 text-center">
          {t("adminManagePage.welcomeMessage")}
        </h1>
        <div className="space-y-4 w-full max-w-xs">
          <button
            onClick={() => router.push("/admin/generate-urls")}
            className="w-full bg-primary text-white p-2 rounded"
          >
            {t("adminManagePage.generateUrlsButton")}
          </button>
          <button className="w-full bg-primary text-white p-2 rounded">
            {t("adminManagePage.orderManagerButton")}
          </button>
          <button
            onClick={() => router.push("/admin/privacy-policy")}
            className="w-full bg-primary text-white p-2 rounded"
          >
            {t("adminManagePage.privacyPolicyButton")}
          </button>
          <button
            onClick={() => router.push("/admin/homepage")}
            className="w-full bg-primary text-white p-2 rounded"
          >
            HOME PAGE
          </button>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminManagePage;
