import admin from "firebase-admin";
import { readFile } from "node:fs/promises";

export const firebaseInit = async () => {
  const accountService = await readFile(
    "./firebase/cambiando-app-firebase-adminsdk-jzyss-a14c10d85c.json",
    "utf-8"
  ).then(JSON.parse);
  admin.initializeApp({
    credential: admin.credential.cert(accountService),
  });
};

export const sendPushNotification = (title, body) => {
  if (title && body) {
    const message = {
      notification: {
        title,
        body,
      },
      topic: "cambiando-app-topic",
    };

    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("mensaje enviado", response);
      })
      .catch((error) => {
        console.log("push error:", error);
      });
  }
};
