import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { writeToLogs } from "../utils/writeToLogs.js";
import { FAUCET_URL } from "../constants.js";

export const getMessage = async ({ proxyServer, timeout }) => {
  console.log("Getting message...");
  let message = "";
  let isError = false;

  const { signal } = new AbortController();
  //timeout for response
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(FAUCET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "RequestTokens",
        query: `
                mutation RequestTokens($symbol: String) {
                    requestTokens(symbol: $symbol)
                }
            `,
        variables: {
          symbol: "Sonic",
        },
      }),
      signal,
      agent: new HttpsProxyAgent(proxyServer),
    });

    if (!response.ok) {
      isError = true;
      throw new Error(("Error sending request:", response.status));
    }

    const data = await response.json();
    console.log("Getting message responce", data);
    message = data.data.requestTokens;
    if (!message) {
      await writeToLogs(proxyServer, "Incorrect message");
      isError = true;
    }
  } catch (error) {
    console.error("Error sending request:", error.message);
    writeToLogs("", `Error sending message: ${error.message}`);
    isError = true;
  } finally {
    clearTimeout(timeoutId);
  }
  return { message: message || "", isError };
};
