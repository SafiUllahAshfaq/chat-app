import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaCaretDown } from "react-icons/fa";
import logo from "./../public/logo-white.png";
import Image from "next/image";
import { useLanguage } from "../context/LanguageContext"; // Import the useLanguage hook

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage(); // Use the context

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setLangDropdownOpen(false);
  };

  const toggleLangDropdown = () => {
    setDropdownOpen(false);
    setLangDropdownOpen(!langDropdownOpen);
  };

  const handleLangSelect = (lang: string) => {
    setLangDropdownOpen(false);
    setLanguage(lang); // Use the setLanguage function from context
  };

  return (
    <header className="bg-primary text-white flex justify-between items-center p-4">
      <div className="flex-1 flex justify-between text-xl font-bold">
        <Link href="/">
          <Image alt="logo" className="w-20" src={logo} />
        </Link>
      </div>
      <nav className="relative flex items-center">
        <div className="relative z-10">
          <button
            onClick={toggleLangDropdown}
            className="text-lg flex items-center focus:outline-none mr-5"
          >
            Language <FaCaretDown className="ml-1" />
          </button>
          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg">
              <button
                onClick={() => handleLangSelect("en")}
                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
              >
                English
              </button>
              <button
                onClick={() => handleLangSelect("fr")}
                className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
              >
                Français
              </button>
            </div>
          )}
        </div>
        {isAuthenticated ? (
          <button onClick={logout} className="text-lg">
            {t("header.logout")}
          </button>
        ) : (
          <div className="relative z-10">
            <Link href="/login" className="cursor-pointer">
              {/* <button
                onClick={toggleDropdown}
                className="text-lg focus:outline-none"
              >
              </button> */}
              {t("header.login")}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
