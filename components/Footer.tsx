import Link from "next/link";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-center text-center items-center">
        <div className="m-0 sm:m-0 md:ml-24 lg:ml-24 mb-4 md:mb-0">
          <h3 className="text-xl font-bold">{t("footer.title")}</h3>
          <p className="text-sm">{t("footer.subtitle")}</p>
          <nav className="flex space-x-4">
            <Link className="hover:underline" href="/privacy-policy">
              {t("footer.privacyPolicy")}
            </Link>
            <Link className="hover:underline" href="/contact-us">
              {t("footer.contact")}
            </Link>
          </nav>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg
              className="w-6 h-6 fill-current text-white hover:text-blue-500"
              viewBox="0 0 24 24"
            >
              {/* Facebook SVG Path */}
            </svg>
          </a>
          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <svg
              className="w-6 h-6 fill-current text-white hover:text-blue-400"
              viewBox="0 0 24 24"
            >
              {/* Twitter SVG Path */}
            </svg>
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <svg
              className="w-6 h-6 fill-current text-white hover:text-blue-700"
              viewBox="0 0 24 24"
            >
              {/* LinkedIn SVG Path */}
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center text-sm mt-4">
        <p>
          &copy; {new Date().getFullYear()} {t("footer.copyright")}{" "}
          {t("footer.rightsReserved")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
