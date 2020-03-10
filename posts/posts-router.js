const express = require('express');
const db = require("../data/db");

//notice uppercase R
const router = express.Router(); //invoke Router()

// the router handles endpoints that begin with /api/posts
//router only cares about what comes after /api/posts

//GET /api/posts
router.get('/', (req, res) => {
    db.find(req.query)
    .then(posts => {
        if (req.body.hasOwnProperty("title") && req.body.hasOwnProperty("contents") ){
          res.status(200).json(posts);  
        } else{
            res.status(400).json({errorMessage: "Please provide title and contents for the post."})
        }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database",
      });
    });
  });
  
//GET /api/posts/:id
  router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
  });
  
  //POST /api/posts
  router.post('/', (req, res) => {
    db.add(req.body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved.",
      });
    });
  });
  
  //DELETE /api/posts/:id
  router.delete('/:id', (req, res) => {
    db.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: 'The post has been nuked' });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(error => {
      // log error to database
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
  });
  
  //PUT /api/posts/:id
  router.put("/:id", (req, res) => {
    const post = req.body;
    const { id, title, contents } = post;
    console.log(post);
    if (title && contents) {
      db.findById(post.id)
        .then(foundDoc => {
          // Process the update here
          db.update(id, post)
            .then(result => {
              res.status(200).json(post);
            })
            .catch(err =>
              res
                .status(500)
                .json({ error: "The post information could not be modified." })
            );
        })
        .catch(err => {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist." });
        });
    } else {
      res
        .status(400)
        .json({
          errorMessage: "Please provide title and contents for the post."
        });
    }
  });
  
//GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findCommentById(id)
        .then(comments => {
            if (comments && comments.length) {
                res.status(200).json(comments)
            } else {
                res.status(404)
                    .json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(error => {
            console.log("error from GET/:id", error);
            res
                .status(500)
                .json({ error: "The comments information could not be retrieved." });
        });
});

  //POST /api/posts/:id/comments
  router.post('/:id/comments', (req, res) => {
    const comment = req.body;
    const { text, post_id } = comment;
    console.log(comment);
    if (!text) {
      res
        .status(400)
        .json({ errorMessage: "Please provide text for the comment." });
    } else {
      db.findById(req.params.id);
      db.insertComment(req.body)
        .then(result => {
          db.findCommentById(result.id)
            .then(found => {
              res.status(200).json(found);
            })
            .catch(err => {
              res.status(404).json({
                message: "The post with the specified ID does not exist."
              });
            });
        })
        .catch(err => {
          res.status(500).json({
            error: "There was an error while saving the comment to the database"
          });
        });
    }
  });

module.exports = router;