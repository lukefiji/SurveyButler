// CommonJS modules on the server side - require()
const express = require("express");
const app = express();

// Route handler
app.get("/", (req, res) => {
  res.send({
    it: "works!"
  });
});

// Dynamic port binding
const PORT = process.env.PORT || 5000;
app.listen(PORT);
