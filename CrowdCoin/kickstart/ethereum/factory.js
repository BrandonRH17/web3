import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x0152Ac62C2075EF2A467b2BD3642B702Ce18AbD3"
);

export default instance;
