const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//Buscar el path de directorio de build
const buildPath = path.resolve(__dirname, 'build');
//Eliminar carpeta build
fs.removeSync(buildPath);

//Buscar el path de directorio de Campaign.sol
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
//Leer el contenido de Campaign.sol
const source = fs.readFileSync(campaignPath, 'utf8');
//Compilar con Solidity el contenido de source 
const output = solc.compile(source, 1).contracts;

//Reconstruir la carpeta build
fs.ensureDirSync(buildPath);

//Del output, loopear por cada contrato y asignar cada uno a un archivo JSON 
for(let contract in output){
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':','') + '.json'),
        output[contract]
    )
}

