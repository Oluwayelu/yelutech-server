
/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const _ = require('lodash')
const multer = require('multer');
const { validate } = require('indicative/validator');

const Blog = require('../database/models/blogs');

module.exports = {

  getBlogs: (req, res) => {
    Blog.find()
      .then((blogs) => {
        if (!blogs) return res.status(400).json({ success: false, msg: 'There are no blogs' });

        res.status(200).json({ success: true, blogs });
      });
  },

  getBlogById: (req, res) => {
    const { id } = req.params;

    Blog.findById(id)
      .then((blog) => {
        if (!blog) return res.status(400).json({ success: false, msg: 'Blog does not exist' });

        res.status(200).json({ success: true, msg: 'Blog Found', blog });
      })
      .catch(() => res.status(400).json({ success: false, msg: 'Blog does not exist' }));
  },

  postBlog: (req, res) => {
    const blogData = _.pick(req.body, ['title', 'body', 'tags'])
    const newBlog = new Blog(blogData)

    const schema = {
      title: 'required',
      body: 'required'
    }
    const message = {
      required: (field) => `${field} is required`,
    }

    validate(newBlog, schema, message)
      .then(blog => {
        newBlog.save()
          .then(() => {
            res.status(200).json({ success: true, message: 'Blog Succesfully Posted' })
          })
      })
  },

  deleteBlog: (req, res) => {
    const { id } = req.params

    Blog.findById(id)
      .then((blog) => {
        if (!blog) return res.status(400).json({ success: false, msg: 'Blog does not exist' });
        if (blog.createdBy == req.user.id) return res.status(500).json({ success: false, msg: "You are not Authorized to delete this blog" });

        blog.remove()
        res.status(200).json({ success: true, message: 'Blog Deleted' })
      })
  },

  commentOnBlog: (req, res) => {
    const { id } = req.params;

    Blog.findById(id)
      .then((blog) => {
        if (!blog) return res.status(400).json({ success: false, msg: 'Blog does not exist' });

        blog.comments.push(req.body)
        blog.save()
          .then(() => {
            res.status(200).json({ success: true, msg: 'Comment added' })
          })
      })
  },

  upload: (req, res) => {

    const { id } = req.params

    var storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/blog')
      },
      filename: (req, file, cb) => {
        cb(null, `blog_${Date.now()}_${file.originalname}`)
      },
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' && ext !== '.png') {
          return cb(res.status(400).end('Only jpg and png is allowed'), false)
        }
        cb(null, true)
      }
    })

    var upload = multer({ storage }).single("blog")

    upload(req, res, err => {
      if (err) return res.status(400).json({ success: false, err })

      Blog.findByIdAndUpdate(
        id,
        { image: res.req.file.destination + "/" + res.req.file.filename },
        { new: true }
      )
        .then(() => {
          res.status(200).json({ success: true, msg: 'Image uploaded', url: res.req.file.destination + "/" + res.req.file.filename })
        })
        .catch(err => res.status(400).json({ success: false, err }))
    })

  }
};
