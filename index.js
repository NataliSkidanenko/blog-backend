import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {registerValidation} from './validations/auth.js';
import {validationResult} from 'express-validator';
import UserModel from './models/User.js';
import checkAuth from './utils/checkAuth.js';

const app = express();
const port = process.env.PORT || 4444;

app.use(express.json());

mongoose
  .connect(`mongodb+srv://admin:wwww@cluster0.v7rze3z.mongodb.net/blog?retryWrites=true&w=majority`)
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => {
    console.log('DB error', err);
  });

app.post('/auth/login', async (req, res) => {
  try {
    const user = await UserModel.findOne({email: req.body.email});
    if (!user) {
      return res.status(404).json({message: 'Неверный логин или пароль'});
    }

    const isValidPass = bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({message: 'Неверный логин или пароль'});
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );
    const {passwordHash: hash, ...userData} = user._doc;
    res.json({...userData, token});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось авторизоваться'});
  }
});

app.post('/auth/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      }
    );

    const {passwordHash: hash, ...userData} = user._doc;
    res.json({...userData, token});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось зарегистрироваться'});
  }
});

app.get('/auth/me', checkAuth, (req, res) => {
  try {
    res.json({
      success: true,
    });
  } catch (error) {}
});

app.listen(port, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server is running on port ${port}`);
});
