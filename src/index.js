import { ethers } from "ethers";
import { removeIntoLogs } from "./utils/removeIntoLogs.js";
import { proxiesData } from "./proxy/proxiesData.js";
import { getMessage } from "./api/getMessage.js";
import { sendMessage } from "./api/sendMessage.js";
import { WALLET_ADDRESS, WALLET_PRIVAT_KEY, TIMEOUT } from "./constants.js";

let succsessOperations = 0;
const proxies = proxiesData.split("\n").map((ip) => ip.trim());

const runBot = async () => {
  await removeIntoLogs();
  for (let i = 0; i < proxies.length; i++) {
    const proxyServer = `http://${proxies[i]}`;
    console.log("\x1b[35m%s\x1b[0m", "proxyServer:", proxyServer);

    //five operation for one proxy
    for (let j = 0; j < 5; j++) {
      const { message, isError } = await getMessage({
        proxyServer,
        timeout: TIMEOUT,
      });
      if (isError) {
        break;
      }
      const wallet = new ethers.Wallet(WALLET_PRIVAT_KEY);
      //sing message with wallet
      const signature = await wallet.signMessage(message);
      const { isSuccsess } = await sendMessage({
        proxyServer,
        signature,
        message,
        address: WALLET_ADDRESS,
        timeout: TIMEOUT,
      });

      if (isSuccsess) {
        succsessOperations++;
      }
    }
  }
};

await runBot();

console.log("\x1b[35m%s\x1b[0m", "succsessOperations:", succsessOperations);
