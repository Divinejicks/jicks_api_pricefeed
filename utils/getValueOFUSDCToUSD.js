const ethers = require("ethers");
const GetChainlinkAggregatorV3InterfaceABI = require("./getChainlinkAggregatorV3InterfaceABI");

// Retry Logic for provider or API calls
const retryWithDelay = async (fn, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed: ${error.message}`);
            if (i === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};

const GetValueOfUSDCToUSD = async () => {
    const v3InterfaceABI = GetChainlinkAggregatorV3InterfaceABI;
    const Arbitrum_CONTRACT_TO_PROVIDE_THE_PRICE_FROM_USDC_TO_USD =
        "0x50834F3163758fcC1Df9973b6e91f0F0F0434aD3";

    const rpcARBMainnet = "https://arb1.arbitrum.io/rpc";

    // Function to fetch the EUR to USD price
    const fetchEURToUSD = async () => {
        const provider = new ethers.providers.JsonRpcProvider(rpcARBMainnet);

        const priceFeed = new ethers.Contract(
            Arbitrum_CONTRACT_TO_PROVIDE_THE_PRICE_FROM_USDC_TO_USD,
            v3InterfaceABI,
            provider
        );

        const latestRoundData = await priceFeed.latestRoundData();
        const decimals = await priceFeed.decimals();

        const usdValueOfOneUSDC = Number(
            (latestRoundData.answer.toString() / Math.pow(10, decimals)).toFixed(3)
        );

        return usdValueOfOneUSDC;
    };

    // Retry the fetchEURToUSD function in case of failures
    return await retryWithDelay(fetchEURToUSD, 3, 2000); // 3 retries, 2-second delay
};

// Export using CommonJS syntax
module.exports = { GetValueOfUSDCToUSD };