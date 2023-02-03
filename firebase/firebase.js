import admin from "firebase-admin";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { readFile } from "node:fs/promises";
import encryptor from "simple-encryptor";
import * as dotenv from "dotenv";
dotenv.config();

const key = process.env.KEY_SALT;
const fbTopicName = process.env.FB_TOPIC;
const fbCollectionName = process.env.FB_COLLECTION_NAME;
const fbDocumentName = process.env.FB_DOCUMENT_NAME;

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

export const updateDocumentFireStore = async (data) => {
  const db = getFirestore();
  const res = await db
    .collection(fbCollectionName)
    .doc(fbDocumentName)
    .set(data);
  console.log(res);
};

export const getBlueDataFireStore = async () => {
  const db = getFirestore();
  const dolarBlueCollection = db
    .collection(fbCollectionName)
    .doc(fbDocumentName);
  const dolarBlue = await dolarBlueCollection.get();
  return dolarBlue.data();
};

export const sendPushNotification = (title, body) => {
  if (title && body) {
    const message = {
      notification: {
        title,
        body,
      },
      topic: fbTopicName,
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
