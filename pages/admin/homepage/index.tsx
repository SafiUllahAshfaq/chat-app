import { useState, useEffect } from "react";
import axios from "axios";
import AdminRoute from "../../../AuthGuards/AdminAuthGuard";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const AdminHomepage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string>("");
  const [textEng, setTextEng] = useState<string>("");
  const [textFre, setTextFre] = useState<string>("");
  const [titleEng, setTitleEng] = useState<string>("");
  const [titleFre, setTitleFre] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get("/api/homepage/get");
        setBackgroundImage(data.backgroundImage);
        setTextEng(data.textEng);
        setTextFre(data.textFre);
        setTitleFre(data.titleFre);
        setTitleEng(data.titleEng);
      } catch (error) {
        console.error("Error fetching homepage content:", error);
      }
    };

    fetchContent();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");

    try {
      await axios.post("/api/homepage/update", {
        backgroundImage,
        textEng,
        textFre,
        titleEng,
        titleFre,
      });
      setMessage("Homepage content updated successfully");
    } catch (error) {
      console.error("Error updating homepage content:", error);
      setMessage("Failed to update homepage content");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackgroundImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AdminRoute>
      <Header title="Admin - Update Homepage" />
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold mb-4">Update Homepage Content</h2>
          {message && <p className="mb-4">{message}</p>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Background Image</label>
            <input type="file" onChange={handleImageChange} />
            {backgroundImage && (
              <img
                src={backgroundImage}
                alt="Background Preview"
                className="mt-2"
              />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title (English)</label>
            <input
              className="w-full border border-gray-300 p-2 rounded"
              value={titleEng}
              onChange={(e) => setTitleEng(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title (French)</label>
            <input
              className="w-full border border-gray-300 p-2 rounded"
              value={titleFre}
              onChange={(e) => setTitleFre(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Text (English)</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              value={textEng}
              onChange={(e) => setTextEng(e.target.value)}
              rows={5}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Text (French)</label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              value={textFre}
              onChange={(e) => setTextFre(e.target.value)}
              rows={5}
            />
          </div>
          <button
            onClick={handleUpdate}
            className="bg-primary text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
      <Footer />
    </AdminRoute>
  );
};

export default AdminHomepage;
