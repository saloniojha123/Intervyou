import { useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

export function useAgoraClient({
  appId,
  channelName,
  token,
  uid,
}) {
  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const cancelledRef = useRef(false);

  const [joined, setJoined] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cancelledRef.current = false;

    if (!appId || !channelName) {
      console.warn("Agora configuration missing", {
        appId,
        channelName,
        uid,
      });
      return;
    }

    const client = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8",
    });

    clientRef.current = client;

    let mounted = true;

    async function joinAgora() {
      try {
        console.log("Joining Agora channel:", channelName);

        const joinedUid = await client.join(
          appId,
          channelName,
          token || null,
          uid ?? null
        );

        if (!mounted || cancelledRef.current) {
          return;
        }

        console.log("Agora joined. UID:", joinedUid);

        const microphoneTrack =
          await AgoraRTC.createMicrophoneAudioTrack();

        if (!mounted || cancelledRef.current) {
          microphoneTrack.close();
          return;
        }

        localAudioTrackRef.current = microphoneTrack;

        await client.publish([microphoneTrack]);

        if (!mounted || cancelledRef.current) {
          return;
        }

        setJoined(true);
        setMicActive(true);
        setError(null);

        console.log("Agora microphone published successfully");

        // Listen for AI/remote audio
        client.on(
          "user-published",
          async (user, mediaType) => {
            try {
              await client.subscribe(user, mediaType);

              if (mediaType === "audio") {
                user.audioTrack?.play();

                console.log(
                  "Remote AI audio received from:",
                  user.uid
                );
              }
            } catch (err) {
              console.error(
                "Failed to subscribe to remote audio:",
                err
              );
            }
          }
        );

        client.on("user-unpublished", (user, mediaType) => {
          console.log(
            "Remote user unpublished:",
            user.uid,
            mediaType
          );
        });
      } catch (err) {
        /*
         * Agora can throw OPERATION_ABORTED when an async
         * join/publish operation is cancelled during cleanup.
         *
         * Do not show this as a real microphone error if the
         * component was already unmounted.
         */
        if (
          !mounted ||
          cancelledRef.current ||
          err?.code === "OPERATION_ABORTED" ||
          err?.message?.includes("cancel token canceled")
        ) {
          console.log(
            "Agora operation cancelled during cleanup."
          );
          return;
        }

        console.error("Agora connection failed:", err);

        setError(err);
        setJoined(false);
        setMicActive(false);
      }
    }

    joinAgora();

    return () => {
      mounted = false;
      cancelledRef.current = true;

      console.log("Cleaning up Agora connection...");

      const track = localAudioTrackRef.current;

      if (track) {
        try {
          track.stop();
          track.close();
        } catch (err) {
          console.warn("Error closing microphone:", err);
        }

        localAudioTrackRef.current = null;
      }

      if (clientRef.current) {
        try {
          clientRef.current.removeAllListeners();
        } catch (err) {
          console.warn("Error removing Agora listeners:", err);
        }

        try {
          clientRef.current.leave();
        } catch (err) {
          console.warn("Error leaving Agora:", err);
        }

        clientRef.current = null;
      }

      setJoined(false);
      setMicActive(false);
    };
  }, [appId, channelName, token, uid]);

  /*
   * Mute / unmute candidate microphone
   */
  async function toggleMic() {
    const track = localAudioTrackRef.current;

    if (!track) {
      console.warn("Microphone track is not available");
      return;
    }

    try {
      const newState = !micActive;

      await track.setEnabled(newState);

      setMicActive(newState);

      console.log(
        newState
          ? "Microphone unmuted"
          : "Microphone muted"
      );
    } catch (err) {
      console.error("Failed to toggle microphone:", err);
      setError(err);
    }
  }

  return {
    joined,
    micActive,
    error,
    toggleMic,
  };
}