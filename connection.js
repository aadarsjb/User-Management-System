const express = require('express');
const app = express();
const port = 4000;

module.exports = {
  startServer: () => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  },
  getApp: () => app,
};


