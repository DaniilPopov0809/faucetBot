import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { writeToLogs } from "../utils/writeToLogs.js";
import { FAUCET_URL } from "../constants.js";

export const sendMessage = async ({
  proxyServer,
  signature,
  message,
  address,
  timeout,
}) => {
  console.log("Sending message...");
  const { signal } = new AbortController();
  //timeout for response
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let isSuccsess = false;
  try {
    const response = await fetch(FAUCET_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "ClaimTokens",
        query: `
        mutation ClaimTokens($address: Address!, $challenge: String!, $signature: String!, $erc20Address: Address) {\n  claimTokens(\n    address: $address\n    challenge: $challenge\n    signature: $signature\n    erc20Address: $erc20Address\n  )\n}
                  `,
        variables: {
          address: address,
          challenge: message,
          signature: signature,
        },
      }),
      signal,
      agent: new HttpsProxyAgent(proxyServer),
    });

    if (!response.ok)
      throw new Error(("Error sending request:", response.status));

    const data = await response.json();
    console.log("Sending message responce:", data);
    isSuccsess = true;
  } catch (error) {
    console.error("Error sending request:", error.message);
    writeToLogs("", `Error sending message: ${error.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
  return { isSuccsess };
};
