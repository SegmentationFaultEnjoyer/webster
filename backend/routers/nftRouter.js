const { Router } = require('express');

const nftRouter = Router();

const NftController = require('../controllers/handlers/nfts');

nftRouter.route('/')
    .get(NftController.GetNftsList) 
    .post(NftController.CreateNft)

nftRouter.route('/:token_id')
    .get(NftController.GetNftByTokenId)
    .patch(NftController.UpdateNftByTokenId)
    
module.exports = nftRouter;