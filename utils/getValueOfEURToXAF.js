const axios = require('axios');

const GetValueOfEURToXAF = async () => {
    try {
        const response = await axios.get('https://ec.europa.eu/budg/inforeuro/api/converted-rate', {
            params: {
                isoFrom: 'EUR',
                isoTo: 'XAF'
            }
        });

        // Extract numeric value from response data
        const rawData = response.data; // Example: ")]}', 655.95700"
        const match = rawData.match(/[-+]?\d*\.?\d+/); // Regex to extract the first number
        const rate = match ? parseFloat(match[0]) : null;
        if (!rate) {
            throw new Error('Rate not found in the API response');
        }
        return rate;
    } catch (error) {
        console.error('Error fetching EUR to XAF rate:', error.message);
        throw error;
    }
};

module.exports = { GetValueOfEURToXAF };
