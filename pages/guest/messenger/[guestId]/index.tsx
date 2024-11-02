import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaSmile, FaUser, FaPaperclip, FaTimes } from "react-icons/fa";
import Picker from "emoji-picker-react";
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
  image?: string;
  timestamp: Timestamp;
  senderProfilePic?: string;
}

interface Guest {
  guestId: string;
  firstname: string;
  lastname: string;
  email: string;
  image?: string;
}

interface Host {
  firstName: string;
  lastName: string;
  email: string;
  image?: string;
}

const GuestChatPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { guestId } = router.query;
  const [guest, setGuest] = useState<Guest | null>(null);
  const [host, setHost] = useState<Host | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // State for full-screen image

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const response = await fetch(`/api/guest/${guestId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch guest data: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.image) {
          data.image = `data:image/jpeg;base64,${Buffer.from(
            data.image
          ).toString("base64")}`;
        }
        fetchHost(data?.hostId);
        fetchMessages(data?.hostId);
        setGuest(data);
      } catch (error) {
        console.error("Error fetching guest", error);
      }
    };

    const fetchHost = async (hostId: string) => {
      try {
        const response = await fetch(`/api/host/get?email=${hostId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch host data: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.image) {
          data.image = `data:image/png;base64,${data.image}`;
        }
        console.log({ data });
        setHost(data);
      } catch (error) {
        console.error("Error fetching host", error);
      }
    };

    const fetchMessages = async (hostId: string) => {
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
            image: doc.data().image,
            timestamp: doc.data().timestamp,
            senderProfilePic:
              doc.data().sender === "Host" ? host?.image : guest?.image,
          }));
          setMessages(fetchedMessages);
        });

        return () => unsubscribe();
      }
    };

    if (guestId) {
      fetchGuest();
    }
  }, [guestId, guest?.image, host?.image]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        sendMessage(base64Image, true);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (content: string, isImage: boolean = false) => {
    if (content.trim()) {
      try {
        const chatDocRef = doc(db, `chats/${host?.email}/guests/${guestId}`);

        const guestSnapshot = await getDoc(chatDocRef);
        if (!guestSnapshot.exists()) {
          await setDoc(chatDocRef, {
            guestId,
            hostId: host?.email,
            createdAt: Timestamp.now(),
          });
        }

        await addDoc(
          collection(db, `chats/${host?.email}/guests/${guestId}/messages`),
          {
            sender: guest?.firstname + " " + guest?.lastname,
            text: !isImage ? content : "",
            image: isImage ? content : null,
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

  const onEmojiClick = (emojiObject: any) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl); // Open modal and display the selected image
  };

  const closeModal = () => {
    setSelectedImage(null); // Close the modal
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
              <span className="font-normal">
                {host?.firstName ? host.firstName : "Host"}
              </span>
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
                        {msg.image ? (
                          <img
                            src={msg.image}
                            alt="Image"
                            className="w-48 h-auto rounded-lg cursor-pointer"
                            onClick={() => openImageModal(msg.image || "")}
                          />
                        ) : (
                          <p>{msg.text}</p>
                        )}
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
                        {msg.image ? (
                          <img
                            src={msg.image}
                            alt="Image"
                            className="w-48 h-auto rounded-lg cursor-pointer"
                            onClick={() => openImageModal(msg.image || "")}
                          />
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                      {msg.senderProfilePic ? (
                        <img
                          src={msg.senderProfilePic}
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

          {/* Modal for full-screen image */}
          {selectedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Full screen"
                  className="max-w-full max-h-screen rounded-lg"
                />
              </div>
              <button
                className="absolute top-4 right-4 text-white text-3xl"
                onClick={closeModal}
              >
                <FaTimes />
              </button>
            </div>
          )}

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
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="imageUpload"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="imageUpload"
              className="p-2 rounded-lg cursor-pointer"
            >
              <FaPaperclip className="w-5 h-5 text-gray-500" />
            </label>
            <button
              className="ml-2 bg-primary text-white p-2 rounded-lg"
              onClick={() => sendMessage(message)}
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
