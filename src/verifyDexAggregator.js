/** @format */

const hre = require("hardhat");
const { loadContract, waitPromise, loadContractByAbi, ZERO_ADDRESS } = require("../utils/contract");
const { etherToWeiString, weiToEther } = require("../utils/maths");
const { readContracts } = require("../utils/resources");
let instance, deployer, contracts;

async function verify() {
    deployer = (await hre.ethers.getSigners())[0];
    instance = await loadContract(hre, "DexAggregator");
    contracts = readContracts(hre);
    await verifyUniswap()
    await verifyUniswapWETHOut()
    await verifyUniswapWETHIn()
    await verifySyncswapETHIn()
    await verifySyncswapETHOut()
    await verifyMultipleDexSwapETHIn()
    await verifyMultipleDexSwap();
    await verifySyncswap();
}


async function verifyUniswap() {
    let pools = [{ a: contracts['Orich-USDC'].address, t: 0 }]
    let orichInstance = await loadContract(hre, "Orich")
    let tokenIn = orichInstance.address
    let amountIn = etherToWeiString("1000");
    let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
    console.log("params", params)
    await waitPromise(orichInstance.approve(instance.address, etherToWeiString("1000000000000")), "approve")
    await waitPromise(instance.swap(...Object.values(params)), "swap")
}

//syncswap  <-> ostrich swap
async function verifyMultipleDexSwapETHIn() {
    let orichInstance = await loadContract(hre, "Orich")
    let shibInstance = await loadContract(hre, "SHIB")
    let wethInstance = await loadContract(hre, "WETH")
    let orich = orichInstance.address.toLowerCase();
    let shib = shibInstance.address.toLowerCase();
    let weth = wethInstance.address.toLowerCase();
    let ostrichswapOrichShibPool = contracts[orich < shib ? "Orich-SHIB" : "SHIB-Orich"].address;
    let syncswapShibWethPool = await getSyncSwapPool(weth, shib)
    console.log("orichShibPool", ostrichswapOrichShibPool)
    console.log("shibWethPool", syncswapShibWethPool)
    var tran1 = async function () {
        console.log("-----------------ETH->SHIB->Orich------------------------")
        let pools = [{ a: syncswapShibWethPool, t: 1 }, { a: ostrichswapOrichShibPool, t: 0 }]
        let tokenIn = ZERO_ADDRESS
        let amountIn = etherToWeiString("0.0000001")
        let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
        console.log("params", JSON.stringify(params))
        let { tokenOut, amountOut } = await instance.getAmountOut(pools, tokenIn, amountIn);
        console.log("tokenOut:", tokenOut, "amountOut:", weiToEther(amountOut.toString()))
        // await waitPromise(shibInstance.approve(instance.address, etherToWeiString("1000000000000")), "approve")
        await waitPromise(instance.swap(...Object.values(params), { value: amountIn }), "swap")
    }
    var tran2 = async function () {
        console.log("-----------------Orich->SHIB->ETH------------------------")
        let pools = [{ a: ostrichswapOrichShibPool, t: 0 }, { a: syncswapShibWethPool, t: 1 }]
        let tokenIn = orich
        let amountIn = etherToWeiString("1000")
        let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
        console.log("params", JSON.stringify(params))
        let { tokenOut, amountOut } = await instance.getAmountOut(pools, tokenIn, amountIn);
        console.log("tokenOut:", tokenOut, "amountOut:", weiToEther(amountOut.toString()))
        // await waitPromise(orichInstance.approve(instance.address, etherToWeiString("1000000000000")), "approve")
        await waitPromise(instance.swap(...Object.values(params)), "swap")
    }
    await tran2()
}

async function getSyncSwapPool(token0, token1) {
    const { abi: factoryAbi } = await hre.artifacts.readArtifact("ISyncswapPoolFactory");
    //https://syncswap.gitbook.io/api-documentation/resources/smart-contract#staging-testnet-recommended
    let factoryInstance = await loadContractByAbi(hre, factoryAbi, "0xf2FD2bc2fBC12842aAb6FbB8b1159a6a83E72006", deployer);
    //from syncswap project
    let pool = await factoryInstance.getPool(token0, token1)
    return pool.toLowerCase()
}

async function verifyMultipleDexSwap() {
    let orichInstance = await loadContract(hre, "Orich")
    let wethInstance = await loadContract(hre, "WETH")
    let shibInstance = await loadContract(hre, "SHIB")
    let orich = orichInstance.address.toLowerCase();
    let weth = wethInstance.address.toLowerCase();
    let shib = shibInstance.address.toLowerCase();
    //from ostrich project
    let orichWethPool = contracts[orich < weth ? "Orich-WETH" : "WETH-Orich"].address;
    console.log("orichWethPool", orichWethPool)
    //from syncswap project
    let wethOrichPool = await getSyncSwapPool(shib, weth)
    console.log("wethOrichPool", wethOrichPool)
    //Orich->ETH->SHIB
    let pools = [{ a: orichWethPool, t: 0 }, { a: wethOrichPool, t: 1 }]
    let tokenIn = orich
    let amountIn = etherToWeiString(1);
    let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
    console.log("params", params)
    // console.log("instance", instance);
    let { tokenOut, amountOut } = await instance.getAmountOut(pools, tokenIn, amountIn);
    console.log("tokenOut:", tokenOut, "amountOut:", amountOut.toString())
    await waitPromise(orichInstance.approve(instance.address, etherToWeiString("1000000000000")), "approve")
    await waitPromise(instance.swap(...Object.values(params)), "swap")
}

async function verifyUniswapWETHOut() {
    let orichInstance = await loadContract(hre, "Orich")
    let wethInstance = await loadContract(hre, "WETH")
    let orichAddress = orichInstance.address.toLowerCase();
    let wethAddress = wethInstance.address.toLowerCase();
    let pairName = orichAddress < wethAddress ? "Orich-WETH" : "WETH-Orich"
    let pools = [{ a: contracts[pairName].address, t: 0 }]
    let tokenIn = orichInstance.address;
    let amountIn = etherToWeiString("1");
    let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
    // console.log("instance: " + instance)
    // console.log("WETH", await instance.WETH())
    console.log("params", params)
    let { tokenOut, amountOut } = await instance.getAmountOut(params.pools, params.tokenIn, params.amountIn);
    console.log("tokenOut:", tokenOut, "amountOut:", amountOut.toString())
    // console.log('weth balance: ' + await wethInstance.balanceOf(instance.address))
    await waitPromise(orichInstance.approve(instance.address, etherToWeiString("1000000000000")), "approve")
    await waitPromise(instance.swap(...Object.values(params)), "swap")
    // console.log('weth balance: ' + await wethInstance.balanceOf(instance.address))
}
async function verifyUniswapWETHIn() {
    let orichInstance = await loadContract(hre, "Orich")
    let wethInstance = await loadContract(hre, "WETH")
    let orichAddress = orichInstance.address.toLowerCase();
    let wethAddress = wethInstance.address.toLowerCase();
    let pairName = orichAddress < wethAddress ? "Orich-WETH" : "WETH-Orich"
    let pools = [{ a: contracts[pairName].address, t: 0 }]
    let amountIn = etherToWeiString("0.000001");
    let tokenIn = ZERO_ADDRESS;
    let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
    // console.log("WETH", await instance.WETH())
    console.log("params", params)
    let { tokenOut, amountOut } = await instance.getAmountOut(pools, tokenIn, amountIn);
    console.log("tokenOut:", tokenOut, "amountOut:", amountOut.toString())
    await waitPromise(instance.swap(...Object.values(params), { value: amountIn }), "swap")
}

async function verifySyncswapETHOut() {
    let weth = contracts["WETH"].address;
    let shib = '0x52cd904b5ca0Aab368C070155f608D1F0D1E47b2'
    let pool = await getSyncSwapPool(shib, weth)
    let pools = [{ a: pool, t: 1 }]
    let amountIn = etherToWeiString("1");
    let tokenIn = shib;
    let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
    console.log("params", params)
    let { tokenOut, amountOut } = await instance.getAmountOut(pools, tokenIn, amountIn);
    console.log("tokenOut:", tokenOut.toLowerCase(), "amountOut:", amountOut.toString())
    // await waitPromise(shibInstance.approve(instance.address, etherToWeiString("1111111111111")), "approve");
    await waitPromise(instance.swap(...Object.values(params)), "swap")
}

async function verifySyncswapETHIn() {
    let weth = contracts["WETH"].address;
    let shib = '0x52cd904b5ca0Aab368C070155f608D1F0D1E47b2'
    let pool = await getSyncSwapPool(shib, weth)
    let pools = [{ a: pool, t: 1 }]
    let amountIn = etherToWeiString("0.0000001");
    let tokenIn = ZERO_ADDRESS;
    let params = { pools, tokenIn, amountIn, amountOutMin: 0, to: deployer.address, deadline: Date.now() }
    console.log("params", params)
    let { tokenOut, amountOut } = await instance.getAmountOut(pools, tokenIn, amountIn);
    console.log("tokenOut:", tokenOut.toLowerCase(), "amountOut:", amountOut.toString())
    await waitPromise(instance.swap(...Object.values(params), { value: amountIn }), "swap")
}

// shib->link->test->milt
async function verifySyncswap() {
    let shib = '0x52cd904b5ca0Aab368C070155f608D1F0D1E47b2'
    let link = "0x40609141Db628BeEE3BfAB8034Fc2D8278D0Cc78"
    let test = "0x26C78bD5901f57DA8aa5CF060aB2116d26906B5E"
    let milt = '0x21d09a612A00CC8E07113CD75101B3365C43D82D'

    //搜topic 0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822
    let pool1 = await getSyncSwapPool(shib, link);
    let pool2 = await getSyncSwapPool(link, test);
    let pool3 = await getSyncSwapPool(test, milt)
    let amountIn = etherToWeiString("10000")
    let tokenIn = shib;
    let pools = [{ a: pool1, t: 1 }, { a: pool2, t: 1 }, { a: pool3, t: 1 },]
    let amountOut = await instance.getAmountOut(pools, tokenIn, amountIn);
    console.log("amountOut", amountOut.toString())
    await waitPromise(instance.swap(pools, tokenIn, amountIn, 0, deployer.address, Date.now()), "swap")
}

async function showPoolInfo(address) {
    const { abi: ISyncswapPoolABI } = await hre.artifacts.readArtifact("ISyncswapPool");
    //https://syncswap.gitbook.io/api-documentation/resources/smart-contract#staging-testnet-recommended
    let poolInstance = await loadContractByAbi(hre, ISyncswapPoolABI, address, deployer);
    let token0 = await poolInstance.token0();
    let token1 = await poolInstance.token1();
    console.log("token0", token0)
    console.log("token1", token1)
}


module.exports = { verify };

