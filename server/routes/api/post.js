const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Get Post
router.get('/', async (req, res)=> {
  const posts = await loadPostCollection();
  res.send(await posts.find({}).toArray());
})

// Add Post
router.post('/', async (req, res) => {
  const posts = await loadPostCollection();
  await posts.insertOne({
    text: req.body.text,
    status: 'active',
    createdAt: new Date()
  });
  console.log(req);
  res.status(201).send();
})

// Update Post
router.put('/:id', async (req, res) => {
  const posts = await loadPostCollection();
  console.log(req.params.id);
  await posts.updateOne(
    { _id: new mongodb.ObjectID(req.params.id) },
    { $set: { text: req.body.text } },
    { upsert: false }
  );
  res.status(200).send();
})

// Delete Post
router.delete('/:id', async(req, res)=> {
  const posts = await loadPostCollection();
  await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
  res.status(200).send();
});

// ******************
// like
router.put('/like/:id', async (req, res) => {
  const posts = await loadLikesCollection();
  await posts.updateOne( { _id: new mongodb.ObjectID(req.params.id) },
  { $set: { like: req.body.like } },
  { upsert: false });
  res.status(201).send();
})
// like get
router.get('/like', async (req, res) => {
  const posts = await loadLikesCollection();
  res.send(await posts.find({}).toArray());
})

async function loadPostCollection() {
  try {
    // outside port: 47000
    // inside container port: 27017
    const client = await mongodb.MongoClient.connect('mongodb://localhost:47000', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.db('vue_express').collection('todos');
  } catch (e) {
    console.error(e);
  }
}
async function loadLikesCollection() {
  try {
    // outside port: 47000
    // inside container port: 27017
    const client = await mongodb.MongoClient.connect('mongodb://localhost:47000', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return client.db('vue_express').collection('likes');
  } catch (e) {
    console.error(e);
  }
}
module.exports = router;
