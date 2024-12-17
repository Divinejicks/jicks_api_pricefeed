const express = require("express");
const cors = require("cors");

const http = require('http');
const { GetValueOfEURToUSD } = require("./utils/getValueOfEURToUSD");
const { GetValueOfUSDCToUSD } = require("./utils/getValueOFUSDCToUSD");

const app = express();
const server = http.createServer(app);

var corsOptions = {
    origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// health check route
app.get("/", (req, res) => {
    res.json({message: "Done by Jicks"});
});

app.get("/afripay_usd_value_of_one_eur", async (req, res) => {
    const usdValue = await GetValueOfEURToUSD()
    res.status(200).json({
        message: "Fetched successfully",
        value: usdValue
    })
})

app.get("/afripay_xaf_to_usdc", async (req, res) => {
    try {
        const xafValue = parseInt(req.query.xafValue) || 1
        const usdValueOfEUR = await GetValueOfEURToUSD()

        // using 1eur at 656xaf
        const oneXafEUR = 656
        const oneXAFUSD = Number(usdValueOfEUR) / Number(oneXafEUR)
        const usdValueOfUSDC = await GetValueOfUSDCToUSD()

        const oneUSDTOUSDC = 1 / Number(usdValueOfUSDC)

        const xafUSDC = Number(oneXAFUSD) * Number(oneUSDTOUSDC)

        const totalXAFUSDC = (xafValue * xafUSDC).toFixed(4)

        res.status(200).json({
            message: "Fetched successfully",
            XAFToUSDC: Number(totalXAFUSDC)
        })
    } catch (error) {
        res.status(500).json({
            message: "Failed to get value"
        })
    }
})

const PORT = 8081;

const start = async () => {
    try {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });

    } catch (error) {
        console.log(error);
    }
};

start();
module.exports = app;
