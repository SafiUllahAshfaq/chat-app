import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  onSnapshot,
  setDoc,
  getDocs,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";

interface Chat {
  id: string;
  guestId: string;
  firstname: string;
  lastname: string;
  unreadCount: number;
  image?: string; // Image as base64 string
  unsubscribeMessages?: Unsubscribe;
}

const HostMessengerPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useTranslation(); // Translation hook
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      const q = query(collection(db, `chats/${user.email}/guests`));

      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const guestId = doc.data().guestId;

            // Fetch guest info from your API
            const response = await fetch(`/api/guest/${guestId}`);
            const guest = await response.json();

            // Convert guest image from Buffer to base64 string if it exists
            if (guest.image) {
              guest.image = `data:image/jpeg;base64,${Buffer.from(
                guest.image
              ).toString("base64")}`;
            }

            // Listen for changes in unread messages in real-time
            const messagesCollection = collection(
              db,
              `chats/${user.email}/guests/${guestId}/messages`
            );
            const unreadQuery = query(
              messagesCollection,
              where("isRead", "==", false)
            );

            const unsubscribeMessages = onSnapshot(
              unreadQuery,
              (unreadSnapshot) => {
                const unreadCount = unreadSnapshot.size;

                setChats((prevChats) => {
                  const updatedChats = prevChats.map((chat) =>
                    chat.guestId === guestId ? { ...chat, unreadCount } : chat
                  );
                  return updatedChats;
                });
              }
            );

            return {
              id: doc.id,
              guestId,
              firstname: guest.firstname || "Guest",
              lastname: guest.lastname || "",
              unreadCount: 0, // Default unread count; will be updated by the onSnapshot
              image: guest.image, // Default image if none
              unsubscribeMessages, // Store the unsubscribe function to clean up later if needed
            };
          })
        );
        setChats(chatData.filter((chat) => chat !== null) as Chat[]);
      });

      return () => {
        unsubscribe();
        chats.forEach((chat) => chat.unsubscribeMessages?.()); // Clean up the message listeners
      };
    }
  }, [user?.email]);

  const handleChatClick = async (chatId: string, guestId: string) => {
    const messagesCollection = collection(
      db,
      `chats/${user?.email}/guests/${guestId}/messages`
    );
    const unreadQuery = query(messagesCollection, where("isRead", "==", false));
    const unreadSnapshot = await getDocs(unreadQuery);

    unreadSnapshot.forEach(async (doc) => {
      await setDoc(doc.ref, { isRead: true }, { merge: true });
    });

    router.push(`/host/messenger/${chatId}/${guestId}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header title="Host Messenger" />
      <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
        <div className="w-full">
          <FaArrowLeft
            className="text-primary cursor-pointer"
            onClick={() => router.push("/host")}
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 mt-4">
          {t("hostMessengerPage.manageChats")}
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-2">
          {chats.length === 0 && !error && (
            <p>{t("hostMessengerPage.noChatsAvailable")}</p>
          )}
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="p-4 bg-white rounded shadow flex justify-between items-center"
            >
              <button
                onClick={() => handleChatClick(chat.id, chat.guestId)}
                className="flex-grow flex items-center text-left"
              >
                {chat.image ? (
                  <img
                    src={chat.image} // Default pic if none
                    alt="Guest"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden p-2 mr-3">
                    <FaUser className="w-full h-full" />
                  </div>
                )}
                {chat.firstname} {chat.lastname}
              </button>
              {chat.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {chat.unreadCount < 10 ? chat.unreadCount : "9+"}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default HostMessengerPage;
