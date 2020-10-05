const express = require('express');
const userRouter = require('./api/users');
const blogRouter = require('./api/blogs')

const router = express();

router.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Welcome YeLuTech API',
  });
});

// User Router
router.use('/users', userRouter);
//Blog Router
router.use('/blogs', blogRouter)

// router.get('*', (req, res) => {
//   res.status(404).json({
//     msg: 'Cannot find EaseIt Nigeria',
//   });
// });

module.exports = router;
