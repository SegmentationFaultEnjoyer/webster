const { Router } = require('express');
const router = Router();

const projectRouter = require('./projectRouter');
const nftRouter = require('./nftRouter');

router.use('/projects', projectRouter);
router.use('/nfts', nftRouter);

module.exports = router;