const axios = require('axios');

const getSummary = async (url) => {
  const res = await axios.post('https://r.jina.ai/', {
    url,
  });
  return res.data;
};

module.exports = getSummary;
