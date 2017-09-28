// Configurable middleware
module.exports = creditsRequired => {
  // Return configured middleware
  return (req, res, next) => {
    if (req.user.credits < creditsRequired) {
      return res.status(403).send({ error: "You don't have enough credits!" });
    }

    next();
  };
};
