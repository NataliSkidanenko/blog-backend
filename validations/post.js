import {body} from 'express-validator';

export const postCreateValidation = [
  body('title', 'Введите заголовок').isLength({min: 3}).isString(),
  body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
  body('tags', 'Неверный формат тегов').optional().isArray(),
  body('imageUrl').optional().isURL(),
];
