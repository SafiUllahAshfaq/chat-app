// pages/[guestId].tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const GuestChatRedirect = () => {
  const router = useRouter();
  const { guestId } = router.query;

  useEffect(() => {
    const createGuest = async () => {
      try {
        const response = await axios.post(`/api/guest/${guestId}`);
        if (response.status === 201) {
          const hostId = response.data.guest.hostId; // Assume the hostId is returned in the response
          router.push(`/guest/messenger/${guestId}?hostId=${hostId}`);
        } else {
          console.error("Failed to create guest", response.data);
        }
      } catch (error) {
        console.error("Error creating guest", error);
      }
    };

    if (guestId) {
      createGuest();
    }
  }, [guestId]);

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default GuestChatRedirect;
