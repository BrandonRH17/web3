const HDWalletProvider = require("@truffle/hdwallet-provider");
const { compile } = require("solc");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "law devote joy vault slot mad screen pulp phone sauce repeat such",

  "https://rinkeby.infura.io/v3/7d5fba1568f64b4c98f0051ec94b9bcd"
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });

  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();

//Old Contract deployed to 0xd9D830c29ec9c5146D53397C377899E06ad930f4
//New Contract deployed to 0x0152Ac62C2075EF2A467b2BD3642B702Ce18AbD3
