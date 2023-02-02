import * as cheerio from "cheerio";
import axios from "axios";
import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import {
  sendPushNotification,
  updateDocumentFireStore,
} from "./firebase/firebase.js";
import { pushMessage } from "./constant/constant.js";
import { getTableData } from "./supabase/supabase.js";

const PAGE_URL = "https://dolarhoy.com/";

function removeStr(value, replaceValue) {
  return value.replace(replaceValue, "").trim();
}

export async function frameBlueData(currentCronDate) {
  const url = "https://dolarhoy.com/i/cotizaciones/dolar-blue";
  const response = await axios.get(url);
  const $ = await cheerio.load(response.data);
  const values = [];
  $("div.data__valores > p").each((i, e) => {
    const formatNumber = $(e)
      .text()
      .replace(/Venta|Compra/g, "");
    values.push(parseInt(formatNumber));
  });

  const lastUpdate = $(
    "div.fecha-container > span.fecha-container__valor"
  ).text();

  const data = {
    symbol: "$",
    ISO: "ars",
    sale: values[0],
    buy: values[1],
    last_update_page: removeStr(lastUpdate, "Actualizado hace"),
    cron_last_update: currentCronDate,
  };

  getTableData();
}

export async function updateBlueData(currentCronDate) {
  const currentData = await readFile("./db/dollar_blue.json", "utf-8").then(
    JSON.parse
  );

  const response = await axios.get(PAGE_URL);
  const $ = await cheerio.load(response.data);

  const includeValuesPage = [0, 1];
  const values = [];

  $("div.val").each((i, e) => {
    if (includeValuesPage.includes(i)) {
      values.push($(e).text());
    }
  });

  const lastUpdate = $("div.tile > span").text();

  const cleanValueSale = removeStr(values[0], "$");
  const cleanValueBuy = removeStr(values[1], "$");

  const data = {
    symbol: "$",
    ISO: "ars",
    sale: cleanValueSale,
    buy: cleanValueBuy,
    last_update_page: removeStr(lastUpdate, "Actualizado el"),
    cron_last_update: currentCronDate,
  };

  updateDocumentFireStore(data);

  const filePath = path.join(process.cwd(), "./db/dollar_blue.json");
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  if (parseInt(cleanValueBuy) > parseInt(currentData.buy)) {
    const { title, body } = pushMessage.dolarUp(removeStr(values[0], "$"));
    sendPushNotification(title, body);
  } else if (parseInt(cleanValueBuy) < parseInt(currentData.buy)) {
    const { title, body } = pushMessage.dolarDown(removeStr(values[0], "$"));
    sendPushNotification(title, body);
  }
}
