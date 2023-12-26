import { useEffect, useState } from "react";
import io from "socket.io-client"; // Add this
import "../../../App.css";

const socket = io("http://localhost:4000"); // Add this -- our server will run on port 4000, so we connect to it from here

function ChatPage() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [messagesRecieved, setMessagesReceived] = useState<any[]>([]);

  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { username, room });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message !== "") {
      const __createdtime__ = Date.now();
      // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
      socket.emit("send_message", { username, room, message, __createdtime__ });
      setMessage("");
    }
  };

  useEffect(() => {
    if (!joined) return;

    const receiveMessageHandler = (data: any) => {
      console.log(data);
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    };

    socket.on("receive_message", receiveMessageHandler);

    // Remove event listener on component unmount
    return () => {
      socket.off("receive_message");
      socket.off("receive_message", receiveMessageHandler);
    };
  }, [joined]);

  return (
    <>
      {!joined ? (
        <div>
          <select onChange={(e) => setRoom(e.target.value)} value={room}>
            <option>-- Select Room --</option>
            <option value="group">Group</option>
            <option value="duo">Duo</option>
          </select>
          <input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <div className="messages-wrapper">
            {messagesRecieved.map((message) => (
              <div className="message-item">
                <b>{message.username}</b>
                <p>{message.message}</p>
              </div>
            ))}
          </div>

          <div>
            <input
              placeholder="Enter message"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            <button onClick={sendMessage}>send</button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatPage;
