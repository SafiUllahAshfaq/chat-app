import { useState, useEffect } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Header from "../../../components/Header";
import { FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const AdminPrivacyPolicy: React.FC = () => {
  const [contentEng, setContentEng] = useState("");
  const [contentFre, setContentFre] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get("/api/privacy-policy/get");
        setContentEng(response.data.contentEng || "");
        setContentFre(response.data.contentFre || "");
      } catch (error) {
        console.error("Error fetching privacy policy:", error);
      }
    };

    // Fetch only on client-side
    if (typeof window !== 'undefined') {
      fetchPolicy();
    }
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await axios.post("/api/privacy-policy/update", {
        contentEng,
        contentFre,
      });
      setMessage(response.data.message || "Privacy policy updated successfully");
    } catch (error) {
      console.error("Error updating privacy policy:", error);
      setMessage("Failed to update privacy policy");
    }
  };

  return (
    <>
      <Header title="Admin - Update Privacy Policy" />
      <div className="w-full p-4">
        <FaArrowLeft
          className="text-primary cursor-pointer"
          onClick={() => router.push("/admin/manage")}
        />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Update Privacy Policy</h1>
        <h2 className="text-xl mb-4">English</h2>
        <ReactQuill
          value={contentEng}
          onChange={setContentEng}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              ["link", "image"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "color",
            "background",
            "align",
          ]}
        />
        <h2 className="text-xl mb-4 mt-10">French</h2>
        <ReactQuill
          value={contentFre}
          onChange={setContentFre}
          modules={{
            toolbar: [
              [{ header: "1" }, { header: "2" }, { font: [] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              ["link", "image"],
              [{ color: [] }, { background: [] }],
              [{ align: [] }],
              ["clean"],
            ],
          }}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "color",
            "background",
            "align",
          ]}
        />
        <button
          onClick={handleUpdate}
          className="mt-16 bg-blue-500 text-white p-2 rounded"
        >
          Update
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </>
  );
};

export default AdminPrivacyPolicy;
