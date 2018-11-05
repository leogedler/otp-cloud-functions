const admin = require('firebase-admin');

module.exports = (req, res) => {
  if (!req.body.phone || !req.body.code) {
    return res.status(422).json({ error: 'Phone and code must be provided' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');
  const code = parseInt(req.body.code);

  return admin.auth().getUser(phone)
    .then(() => {
      const ref = admin.database().ref(`users/${phone}`);
      return ref.on('value', snapshot => {
        ref.off();
        const user = snapshot.val();

        if (user.code !== code || !user.codeValid) {
          return res.status(422).json({ error: 'Code not valid' });
        }

        ref.update({ codeValid: false });
        return admin.auth().createCustomToken(phone)
          .then(token => res.json({ token }))
          .catch(() => res.status(422).json({ error }))
      })
    })
    .catch(error => res.status(422).json({ error }))

};
