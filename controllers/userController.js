/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const _ = require('lodash')
const bcrypt = require('bcryptjs');
const { validate } = require('indicative/validator')
const jwt = require('jsonwebtoken');
const User = require('../database/models/users');

const jwtSecret = process.env.JWT_SECRETKEY;

module.exports = {

  registerUser: (req, res) => {
    const userData = _.pick(req.body, ['name', 'email', 'password'])
    const newUser = new User(userData)

    const schema = {
      name: 'required',
      email: 'required|email',
      password: 'required|alpha_numeric|min:6'
    }
    const message = {
      required: (field) => `${field} is required`,
      'email.email': 'email is not valid',
      'password.alpha_numeric': 'password contains invalid characters',
      'password.min': 'password should contain at least 6 characters'
    }

    validate(newUser, schema, message)
      .then(user => {

        User.findOne({ email: user.email })
          .then(user => {
            if (user) return res.status(400).json({ success: false, msg: 'User already exist' })

            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then((user) => {
                    if (!user) return res.status(400).json({ success: false, msg: 'User already exists' });
                    res.status(200).json({ success: true, msg: 'user registered' });
                  })
                  .catch(() => res.status(400).json({ success: false, err: 'An error occured' }));
              });
            });
          })
          .catch(err => res.status(400).json({ success: false, msg: 'An error occured', err }))
      })
      .catch(err => res.status(400).json({ success: false, msg: 'Validation error', error: err[0].message }))
  },

  loginUser: (req, res) => {
    const loginForm = _.pick(req.body, ['email', 'password'])

    const schema = {
      email: 'required|email',
      password: 'required|alpha_numeric|min:6'
    }
    const message = {
      required: (field) => `${field} is required`,
      'email.email': 'email is not valid',
      'password.alpha_numeric': 'password contains invalid characters',
      'password.min': 'password should contain at least 6 characters'
    }

    validate(loginForm, schema, message)
      .then(({ email, password }) => {

        User.findOne({ email })
          .then((user) => {
            if (!user) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });

            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (!isMatch) return res.status(400).json({ success: false, msg: 'Invalid credentials' });

              const payload = {
                id: user._id,
                email: user.email,
              };
              jwt.sign(
                payload,
                jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  if (err) res.status(400).json({ success: false, msg: 'Error occured while creating a token' });
                  res.status(200).json({
                    success: true,
                    msg: "User Logged In",
                    token: `Bearer ${token}`,
                  });
                },
              );
            });
          });
      })
      .catch(err => res.status(400).json({ success: false, msg: 'Validation error', error: err[0].message }))

  },

  getUsers: (req, res) => {
    User.find({}, { password: 0 })
      .then((users) => {
        if (!users) return res.status(400).json({ success: false, msg: 'There are no users' });

        res.status(200).json({ success: true, users });
      });
  },

  getUserById: (req, res) => {
    const { id } = req.params;

    if (id !== req.user.id) return res.status(401).json({ success: false, msg: 'User is not authorized' });

    User.findById(id, { password: 0 })
      .then((user) => {
        if (!user) return res.status(400).json({ success: false, msg: 'User does not exist' });

        res.status(200).json({ success: true, msg: 'User Found', user });
      })
      .catch(() => res.status(400).json({ success: false, msg: 'User does not exist' }));
  },
};
