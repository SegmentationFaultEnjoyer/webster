// Convert a single nft object to JSON API format
exports.toNftJsonApi = (nft) => ({
  data: {
    type: 'nfts',
    id: nft.id,
    attributes: {
      title: nft.title,
      contract_address: nft.contract_address,
      token_id: nft.token_id,
      buyer: nft.buyer,
      seller: nft.seller,
      token_uri: nft.token_uri,
      price: nft.price,
      created_at: nft.created_at,
      is_enabled: nft.is_enabled
    }
  }
});

// Convert a list of nft objects to JSON API format
exports.toNftsJsonApi = (nfts, links) => ({
  data: nfts.map(nft => ({
    type: 'nfts',
    id: nft.id,
    attributes: {
      contract_address: nft.contract_address,
      token_id: nft.token_id,
      title: nft.title,
      buyer: nft.buyer,
      seller: nft.seller,
      price: nft.price,
      token_uri: nft.token_uri,
      created_at: nft.created_at,
      is_enabled: nft.is_enabled
    }
  })),
  links
});