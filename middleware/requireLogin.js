module.exports = (req, res, next) => {
  if (!req.user) {
    // Send unauthorized status
    return res
      .status(401) // Forbidden
      .send({ error: 'You must be logged in to purchace credits.' });
  }

  // If user cookie exists
  next();
};
