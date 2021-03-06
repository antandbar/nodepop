'use strict';

const jwt = require('jsonwebtoken');
const { User } = require('../models');

class LoginController {
  // login post desde API que retorna JWT
  async postJWT(req, res, next) {
    try {
      const { email, password } = req.body;

      // buscar el usuario en la BD
      const usuario = await User.findOne({ email });

      // si no se encuentra o no coincide la contraseña --> error
      if (!usuario || !(await usuario.comparePassword(password))) {
        res.status(401).json({ error: 'invalid credentials' });
        return;
      }

      // se genera un JWT con su _id
      jwt.sign(
        { _id: usuario._id },
        process.env.JWT_SECRET,
        {
          expiresIn: '3d',
        },
        (err, jwtToken) => {
          if (err) {
            next(err);
            return;
          }
          // se devuelve al cliente es token generado
          res.json({ token: jwtToken });
        },
      );
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LoginController;
