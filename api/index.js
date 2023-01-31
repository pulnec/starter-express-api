import express from "express";
import { readFile } from "node:fs/promises";
import cron from "node-cron";
import { updateBlueData } from "../app.js";
import { firebaseInit } from "../firebase/firebase.js";

const app = express();
const PORT = process.env.PORT || 9000;
const CRON_CONFIG = "0 */3 * * *"; // every 3 hours

await firebaseInit();

cron.schedule(CRON_CONFIG, () => {
  const date = new Date();
  updateBlueData(date);
});

app.get("/blue", async (req, res) => {
  const data = await readFile("./db/dollar_blue.json", "utf-8").then(
    JSON.parse
  );
  res.status(200);
  res.send(data);
});

app.get("/blueUp", async (req, res) => {
  const date = new Date();
  updateBlueData(date);
  res.status(200);
  res.send({ message: "update db" });
});

app.listen(PORT, (error) => {
  if (!error)
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  else console.log("Error occurred, server can't start", error);
});
