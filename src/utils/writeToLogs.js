import { promises as fs } from "fs";

export const writeToLogs = async (ip, text) => {
  try {
    fs.appendFile("./logs.txt", `{${ip ? `${ip}\n` : ""}} ${text}\n`);
    console.log("Data successfully written to the logs!");
  } catch (err) {
    console.error("Error writing to the logs:", err);
  }
};
