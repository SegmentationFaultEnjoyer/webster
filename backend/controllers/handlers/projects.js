const knex = require("../../data/db");
const setLinks = require("../../helpers/setLinks");
const {toProjectsJsonApi, toProjectJsonApi} = require("../responses/projects")
const statusTypes = require("../../helpers/types/httpStatus")
const ProcessError = require("../errors/handler")

const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../../data/aws');
// Create a new project
exports.CreateProject = async (req, res) => {
  const { title, owner, content } = req.body.data.attributes;
  created_at = new Date()
  try {
    const [result] = await knex("projects")
      .insert({ title, owner, content, created_at: created_at.toISOString() })
      .returning("*");
    
    res.status(statusTypes.CREATED).json(toProjectJsonApi(result));
  } catch (error) {
    ProcessError(res, error)
  }
};

// Get all projects
exports.GetProjectsList = async (req, res) => {
  try {
      // Build the initial query using knex
      let query = knex("projects").select("*");
    if (req.query.filter) {
      const { title, owner } = req.query.filter;


      // Apply the filters if they are present
      if (title) {
        query = query.where("title", "ilike", `%${title}%`);
      }   
      if (owner) {
        query = query.where("owner", "ilike", `%${owner}%`);
      }
    }
   
    const { page } = req.query;
    let limit = page && page.limit ? page.limit : 15
    let number = page && page.number ? page.number : 0
    sortColumn = req.query.sort ? req.query.sort : "id"
    order = page && page.order ? page.order : undefined
    
    query.orderBy(sortColumn, order)
    const projects = await query.limit(limit).offset(number * limit);
    res.status(statusTypes.OK).json(toProjectsJsonApi(projects, setLinks(new URL("http://localhost:3000/projects" + req.url), number)));
  } catch (error) {
    ProcessError(res, error)
  }
};

// Get a specific project by ID
exports.GetProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [project] = await knex("projects").select("*").where({ id });
    if (!project) {
      return res.status(statusTypes.NOT_FOUND).json({ error: "Project not found" });
    }
    res.status(statusTypes.OK).json(toProjectJsonApi(project));
  } catch (error) {
    ProcessError(res, error)
  }
};

// Update a specific project by ID
exports.UpdateProjectById = async (req, res) => {
  const { id } = req.params;
  const { title, content, owner } = req.body.data.attributes;

  try {
    const [result] = await knex("projects")
      .where({ id })
      .update({ title, content, owner })
      .returning("*");
    if (!result) {
      return res.status(statusTypes.NOT_FOUND).json({ error: "Project not found" });
    }
    res.status(statusTypes.OK).json(toProjectJsonApi(result));
  } catch (error) {
    ProcessError(res, error)
  }
};

// Delete a specific project by ID
exports.DeleteProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await knex("projects").where({ id }).del().returning("*");
    if (!result) {
      return res.status(statusTypes.NOT_FOUND).json({ error: "Project not found" });
    }
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: result.aws_banner_key
    }));
  
    res.status(statusTypes.NO_CONTENT).end();
  } catch (error) {
    ProcessError(res, error)
  }
};
