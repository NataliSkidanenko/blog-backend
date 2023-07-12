import express from 'express';
import mongoose from 'mongoose';
import {registerValidation, loginValidation} from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import {postCreateValidation} from './validations/post.js';

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

app.post('/auth/login', loginValidation, UserController.login);
app.post('/auth/register', registerValidation, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(port, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server is running on port ${port}`);
});
