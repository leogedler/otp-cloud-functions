const admin = require('firebase-admin');
const nexmo = require('./nexmo');

module.exports = (req, res) => {
  if (!req.body.phone) {
    return res.status(422).json({ error: 'You must provide a phone number' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  return admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));

      const from = 'Nexmo';
      const to = phone;
      const text = `Your code is: ${code}`;

      return nexmo.message.sendSms(from, to, text, {}, (err) => {
        if (err) {
          return res.status(422).json({ error: err });
        }

        return admin.database().ref(`users/${phone}`)
          .update({ code, codeValid: true }, () => {
            res.json({ success: true });
          });
      });
    })
    .catch(error => res.status(422).json({ error }));
};
