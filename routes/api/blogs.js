const express = require('express');
const passport = require('passport');
const blogController = require('../../controllers/blogController');

const router = express.Router();

router.get('/', blogController.getBlogs);

router.get('/:id', blogController.getBlogById);

router.post('/:id/comment', blogController.commentOnBlog);

router.post('/', passport.authenticate('jwt', { session: false }), blogController.postBlog);

router.delete('/:id', passport.authenticate('jwt', { session: false }), blogController.deleteBlog);

router.post('/:id/upload', passport.authenticate('jwt', { session: false }), blogController.upload);

module.exports = router;