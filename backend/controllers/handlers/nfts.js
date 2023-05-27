const knex = require("../../data/db");
const setLinks = require("../../helpers/setLinks");
const {toNftsJsonApi, toNftJsonApi} = require("../responses/nfts")
const statusTypes = require("../../helpers/types/httpStatus")
const ProcessError = require("../errors/handler")

// Create a new nft
exports.CreateNft = async (req, res) => {
  const { title, seller, price, token_uri, contract_address, token_id } = req.body.data.attributes;
  created_at = new Date()
  try {
    const [result] = await knex("nfts")
      .insert({ title, seller, token_uri, price, contract_address, token_id, created_at: created_at.toISOString() })
      .returning("*");
    
    res.status(statusTypes.CREATED).json(toNftJsonApi(result));
  } catch (error) {
    ProcessError(res, error)
  }
};

// Get all nfts
exports.GetNftsList = async (req, res) => {
  try {
      // Build the initial query using knex
      let query = knex("nfts").select("*");
    if (req.query.filter) {
      const { title, buyer, seller, is_enabled } = req.query.filter;


      // Apply the filters if they are present
      if (title) {
        query = query.where("title", "ilike", `%${title}%`);
      }   
      if (seller) {
        query = query.where("seller", "ilike", `%${seller}%`);
      }
      if (buyer) {
        query = query.where("buyer", "ilike", `%${buyer}%`);
      }
      if (is_enabled) {
        query = query.where("is_enabled", "=", is_enabled);
      }
    }
   
    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0
    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)
    const nfts = await query.limit(limit).offset(number * limit);
    res.status(statusTypes.OK).json(toNftsJsonApi(nfts, setLinks(new URL("http://localhost:3000/nfts" + req.url), number)));
  } catch (error) {
    ProcessError(res, error)
  }
};

// Get a specific nft by token ID
exports.GetNftByTokenId = async (req, res) => {
  const { token_id } = req.params;

  try {
    const [nft] = await knex("nfts").select("*").where({ token_id });
    if (!nft) {
      return res.status(statusTypes.NOT_FOUND).json({ error: "Nft not found" });
    }
    res.status(statusTypes.OK).json(toNftJsonApi(nft));
  } catch (error) {
    ProcessError(res, error)
  }
};


// Update a specific NFT by token ID
exports.UpdateNftByTokenId = async (req, res) => {
  const { token_id } = req.params;
  let { title, price, buyer, is_enabled } = req.body.data.attributes;
  if (buyer) is_enabled = false
  try {
    const [result] = await knex("nfts")
      .where({ token_id })
      .update({ title, price, buyer, is_enabled })
      .returning("*");
    if (!result) {
      return res.status(statusTypes.NOT_FOUND).json({ error: "NFT not found" });
    }
    res.status(statusTypes.OK).json(toNftJsonApi(result));
  } catch (error) {
    ProcessError(res, error)
  }
};