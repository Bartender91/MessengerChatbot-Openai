const login = require("./fb-chat-api");
const fs = require("fs");

login(
  { appState: JSON.parse(fs.readFileSync("session.json", "utf8")) },
  (err, api) => {
    if (err) return console.error("Login failed:", err);

    api.setOptions({
      logLevel: "silent",
      forceLogin: true,
      listenEvents: true,
      autoMarkDelivery: true,
      autoMarkRead: true,
      selfListen: false,
      online: true,
      proxy: "http://159.255.188.134:41258", // Replace with your own proxy if needed
    });

    api.listenMqtt(async (err, event) => {
      if (err) return console.error("Error in event listener:", err);

      api.markAsReadAll(() => {});

      switch (event.type) {
        case "message":
        case "message_reply":
          if (event.body === "ping") {
            api.sendMessage("Pong!", event.threadID);
          } else if (event.body.toLowerCase() === "hello") {
            api.sendMessage("Hi there! How can I help you?", event.threadID);
          } else if (event.body.toLowerCase() === "joke") {
            api.sendMessage("Why don’t scientists trust atoms? Because they make up everything!", event.threadID);
          }
          break;
        
        case "event":
          // Add other event handling here if needed
          break;
      }
    });
  }
);
