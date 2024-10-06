import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaSmile, FaUser } from "react-icons/fa";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { db } from "../../../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import Header from "../../../../components/Header";
import { useTranslation } from "react-i18next";

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: Timestamp;
  senderProfilePic?: string; // Profile picture as base64 string
}

interface Guest {
  guestId: string;
  firstname: string;
  lastname: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  image?: string; // Image as base64 string
}

interface Host {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  zipCode: string;
  city: string;
  country: string;
  image?: string; // Image as base64 string
}

const GuestChatPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { guestId, hostId } = router.query;
  const [guest, setGuest] = useState<Guest | null>(null);
  const [host, setHost] = useState<Host | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const response = await fetch(`/api/guest/${guestId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch guest data: ${response.statusText}`);
        }
        const data = await response.json();

        // Convert guest image from Buffer to base64 string
        if (data.image) {
          data.image = `data:image/jpeg;base64,${Buffer.from(
            data.image
          ).toString("base64")}`;
        }
        setGuest(data);
      } catch (error) {
        console.error("Error fetching guest", error);
      }
    };

    const fetchHost = async () => {
      try {
        const response = await fetch(`/api/host/get?email=${hostId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch host data: ${response.statusText}`);
        }
        const data = await response.json();

        // Convert host image from Buffer to base64 string
        if (data.image) {
          data.image = `data:image/png;base64,${data.image}`;
        }
        setHost(data);
      } catch (error) {
        console.error("Error fetching host", error);
      }
    };

    const fetchMessages = async () => {
      if (guestId && hostId) {
        const messagesQuery = query(
          collection(db, `chats/${hostId}/guests/${guestId}/messages`),
          orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
          const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            sender: doc.data().sender,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            senderProfilePic:
              doc.data().sender === "Host" ? host?.image : guest?.image, // Use base64 images
          }));
          setMessages(fetchedMessages);
        });

        return () => unsubscribe();
      }
    };

    if (guestId && hostId) {
      fetchGuest();
      fetchHost();
      fetchMessages();
    }
  }, [guestId, hostId, guest?.image, host?.image]);

  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const chatDocRef = doc(db, `chats/${hostId}/guests/${guestId}`);

        // Check if guest document exists; if not, create it
        const guestSnapshot = await getDoc(chatDocRef);
        if (!guestSnapshot.exists()) {
          await setDoc(chatDocRef, {
            guestId,
            hostId,
            createdAt: Timestamp.now(),
          });
        }

        // Add the message to the messages sub-collection
        await addDoc(
          collection(db, `chats/${hostId}/guests/${guestId}/messages`),
          {
            sender: guest?.firstname + " " + guest?.lastname,
            text: message,
            timestamp: Timestamp.now(),
            isRead: false,
          }
        );
        setMessage("");
      } catch (error) {
        console.error("Error sending message", error);
      }
    }
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  if (!guest || !host) {
    return <div>{t("guestChatPage.loading")}</div>;
  }

  return (
    <>
      <Header title={t("guestChatPage.title")} />
      <div className="min-h-[90vh] bg-pink-100 flex flex-col md:flex-row">
        <div className="md:w-full p-4 flex flex-col relative">
          <div className="flex justify-between items-center pb-5">
            <h2 className="text-lg font-bold mb-4">
              {t("guestChatPage.conversationWith")}{" "}
              <span className="font-normal">{host?.firstName ? host.firstName : "Host"}</span>
            </h2>
            <button
              onClick={() => router.push(`/guest/${guestId}/account`)}
              className="bg-primary text-white py-2 px-5 rounded"
            >
              {t("guestChatPage.editProfileButton")}
            </button>
          </div>
          <div className="flex-1 bg-gray-100 p-4 rounded-lg overflow-y-auto min-h-96">
            <ul className="space-y-2">
              {messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`flex ${
                    msg.sender !== "Host" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "Host" ? (
                    <div className="flex items-end">
                      {msg.senderProfilePic ? (
                        <img
                          src={msg.senderProfilePic} // Default pic if none
                          alt="Host"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden p-2 mr-2">
                          <FaUser className="w-full h-full" />
                        </div>
                      )}

                      <div
                        className={`p-2 rounded-lg ${
                          msg.sender !== "Host"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-end">
                      <div
                        className={`p-2 rounded-lg ${
                          msg.sender !== "Host"
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      {msg.senderProfilePic ? (
                        <img
                          src={msg.senderProfilePic} // Default pic if none
                          alt="Guest"
                          className="w-8 h-8 rounded-full ml-2"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden p-2 ml-2">
                          <FaUser className="w-full h-full" />
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              className="flex-1 border border-gray-300 p-2 rounded-lg"
              placeholder={t("guestChatPage.placeholderMessage")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="button"
              className="p-2 rounded-lg relative"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <FaSmile className="w-5 h-5 text-gray-500" />
              {showEmojiPicker && (
                <div className="absolute bottom-12 -right-20">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </button>
            <button
              className="ml-2 bg-primary text-white p-2 rounded-lg"
              onClick={sendMessage}
            >
              {t("guestChatPage.sendButton")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuestChatPage;
