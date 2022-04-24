import Web3 from 'web3';

let web3; 

if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
    window.ethereum.request({method: "eth_requestAccounts"});
    web3 = new Web3(window.ethereum)
} else {
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/7d5fba1568f64b4c98f0051ec94b9bcd"
    );
    web3 = new Web3(provider)
}

export default web3;