import { useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "react-i18next";

const ContactUsPage = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) {
      setStatus(t("contactUs.captchaRequired"));
      return;
    }
    setStatus(t("contactUs.sending"));

    try {
      await axios.post("/api/contact", { name, email, message, captchaToken });
      setStatus(t("contactUs.success"));
      setName("");
      setEmail("");
      setMessage("");
      setCaptchaToken(null);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus(t("contactUs.failure"));
    }
  };

  const onCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <>
      <Header title={t("header.contactUs")} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{t("contactUs.title")}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">{t("contactUs.name")}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">
              {t("contactUs.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">
              {t("contactUs.message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full p-2 border border-gray-300 rounded"
              required
            ></textarea>
          </div>
          <div>
            <ReCAPTCHA
              sitekey="YOUR_SITE_KEY" // Replace with your actual site key
              onChange={onCaptchaChange}
            />
          </div>
          <button type="submit" className="bg-primary text-white p-2 rounded">
            {t("contactUs.sendButton")}
          </button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </div>
    </>
  );
};

export default ContactUsPage;
