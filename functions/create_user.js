const admin = require('firebase-admin');

module.exports = (req, res) => {
  const { phone } = req.body;
  // Verify the user provided a phone
  if (!phone) {
    return res.status(422).json({ error: 'Bad input' });
  }

  // Format the phone number to remove dashes and parens
  const phoneString = String(phone).replace(/[^\d]/g, '');

  // Create a new user account using that phone
  return admin.auth().createUser({ uid: phoneString })
    // Respond to the user request saying that the account was created
    .then(user => res.json(user))
    .catch(error => res.status(500).json({error}));
};