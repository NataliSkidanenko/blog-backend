import jwt from 'jsonwebtoken';

export default function checkAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');
  if (token) {
  } else {
  }
  res.send(token);
}
