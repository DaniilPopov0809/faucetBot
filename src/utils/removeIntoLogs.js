import { promises as fs } from "fs";

export const removeIntoLogs = async () => {
  try {
    await fs.truncate("./logs.txt", 0);
    console.log("Data successfully deleted!");
  } catch (err) {
    console.error("Error deleting data:", err);
  }
};
