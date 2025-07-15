const axios = require('axios');

const getSummary = async (url) => {
  try {
    const response = await axios.post(
      'https://r.jina.ai/',
      { data: url },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data || 'No summary available';
  } catch (err) {
    console.error('Jina AI error:', err.message);
    return 'Summary unavailable';
  }
};

module.exports = { getSummary };
