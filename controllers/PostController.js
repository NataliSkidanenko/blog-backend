import PostModel from '../models/Post.js';

export const create = (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = doc.save();

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось создать пост'});
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось получить статьи'});
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndUpdate(
      {_id: postId},
      {
        $inc: {viewsCount: 1},
      },
      {
        returnDocument: 'after',
      }
    );

    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось открыть статью'});
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete({_id: postId});
    res.json({message: 'Пост удален'});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Не удалось удалить статью'});
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    await PostModel.updateOne(
      {_id: postId},
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
      }
    );
    res.json({success: true});
  } catch (error) {
    console.log(error);
    res.status(500).json({medssage: 'не удалось обновить статью'});
  }
};
