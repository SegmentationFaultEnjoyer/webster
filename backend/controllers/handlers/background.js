const statusTypes = require("../../helpers/types/httpStatus")
require("dotenv").config();
const knex = require("../../data/db");
const ProcessError = require("../errors/handler")

// Upload a new background
exports.UploadBackground = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await knex("projects")
      .where({ id })
      .update({ aws_banner_key: req.file.key })
      .returning("*");
    if (!result) {
      return res.status(statusTypes.NOT_FOUND).json({ error: "Project not found" });
    }
    res.status(statusTypes.OK).json({
        id: req.file.key,
        type: "url",
        data: {
            attributes: {
                url: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.file.key}`,
            }
        }
    });
  } catch (error) {
    ProcessError(res, error)
  }
};
