import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import {PostController, UserController} from './controllers/index.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';
import {registerValidation, loginValidation} from './validations/auth.js';
import {postCreateValidation} from './validations/post.js';

const app = express();
const port = process.env.PORT || 4444;

app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({storage});

mongoose
  .connect(`mongodb+srv://admin:wwww@cluster0.v7rze3z.mongodb.net/blog?retryWrites=true&w=majority`)
  .then(() => {
    console.log('DB ok');
  })
  .catch((err) => {
    console.log('DB error', err);
  });

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({url: `/uploads/${req.file.originalname}`});
});

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(port, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log(`Server is running on port ${port}`);
});
