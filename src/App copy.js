import React from "react";
import socketClient from "socket.io-client";
let socket = null;

function App() {
  const [dataChat, setDataChat] = React.useState([]);
  const [typing, setTyping] = React.useState(false);
  const [room, setRoom] = React.useState(0);
  const [name, setName] = React.useState("");
  const [msg, setMsg] = React.useState("");
  const changeRoom = (e) => {
    setRoom(e.target.value);
    if (e.target.value) {
      console.log(socket);
      if (socket) {
        socket.emit("room", e.target.value);
      }
    }
  };
  const changeName = (e) => {
    setName(e.target.value);
  };
  const changeMsg = (e) => {
    if (room && name) {
      setMsg(e.target.value);
      socket.emit("type", name);
    } else {
      alert("room and name required");
    }
  };
  React.useEffect(() => {
    socket = socketClient("http://127.0.0.1:5000");
    socket.on("room", (data) => {
      console.log(data);
    });
    socket.on("type", (name) => {
      console.log(name);
      setTyping(name);
    });
  }, []);
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>My Chat App</h1>
      {typing && <p style={{ fontStyle: "italic" }}>{typing} mengetik .....</p>}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <label>Room</label> &nbsp;&nbsp;{" "}
          <input type="text" value={room} onChange={changeRoom} />
        </div>
        <div>
          <label>nama</label> &nbsp;&nbsp;{" "}
          <input type="text" value={name} onChange={changeName} />
        </div>
        <div>
          <label>message</label> &nbsp;&nbsp;{" "}
          <input type="text" value={msg} onChange={changeMsg} />
        </div>
        <button type="button">SendChat</button>
      </div>
    </div>
  );
}

export default App;
