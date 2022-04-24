const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory; 
let campaignAddress;
let campaign; 

beforeEach(async () =>{
    accounts = await web3.eth.getAccounts(); 

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});
    
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    })

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
})

describe('Campaigns', () => {
    it('deploys a factory and a campaign', ()=>{
        assert.ok(factory.options.address);
        assert.ok(factory.options.address);
    });
    it('Marks creator as campaign manager', async () =>{
        assert.equal(accounts[0], await campaign.methods.manager().call());
    });
    it('People can donate and are marked as donators', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '200'
        });

        assert(await campaign.methods.approvers(accounts[1]).call());
    });
    it('Requires a minimum amount to contribute', async () => {
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '5'
            });
            assert(false)
        } catch(err) {
            assert(err);
        }
    });
    it('Manager can create request', async () => {
        await campaign.methods.createRequest('Purchase batteries', '12', accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const requestCreated = await campaign.methods.requests(0).call();

        assert.equal('Purchase batteries', requestCreated.description);
    });
    it('Processes request', async () => {

        let oldReceiverBalance = await web3.eth.getBalance(accounts[2])
        oldReceiverBalance = web3.utils.fromWei(oldReceiverBalance, 'ether');
        oldReceiverBalance = parseFloat(oldReceiverBalance);

        await campaign.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.createRequest('Purchase fan', web3.utils.toWei('5', 'ether'), accounts[2]).send({
            from: accounts[0],
            gas: '1000000'
        });
        await campaign.methods.approveRequest(0).send({
            from: accounts[1],
            gas:'1000000'
        });
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let newReceiverBalance = await web3.eth.getBalance(accounts[2])
        newReceiverBalance = web3.utils.fromWei(newReceiverBalance, 'ether');
        newReceiverBalance = parseFloat(newReceiverBalance);

        assert(newReceiverBalance > oldReceiverBalance);
        
    });
});