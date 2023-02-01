import admin from "firebase-admin";
import { readFile } from "node:fs/promises";
import encryptor from "simple-encryptor";
import * as dotenv from "dotenv";
dotenv.config();
const key = process.env.KEY_SALT;
const encryptGen = encryptor.createEncryptor(key);

export const firebaseInit = async () => {
  const accountService = await readFile("./firebase/config.json", "utf-8").then(
    JSON.parse
  );
  const accountConfig = encryptGen.decrypt(accountService.data);

  try {
    admin.initializeApp({
      credential: admin.credential.cert(accountConfig),
    });
    console.log("Firebase ON!");
  } catch {
    console.log("Firebase OFF!");
  }
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
