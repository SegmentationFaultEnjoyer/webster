const { Router } = require('express');
require("dotenv").config();
const s3Client = require('../data/aws');
const { v4: uuidv4 } = require('uuid');
const projectRouter = Router();

const multer = require('multer');
const multerS3 = require('multer-s3');

const ProjectController = require('../controllers/handlers/projects');
const BackgroundController = require('../controllers/handlers/background');

// Configure multer to upload directly to S3
const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_BUCKET,
      key: (req, file, cb) => { 
        const fileExtension = file.originalname.split('.').pop(); // Extract the file extension
      cb(null, `${uuidv4()}.${fileExtension}`);
      },
    }),
  });
  
projectRouter.route('/')
    .get(ProjectController.GetProjectsList) 
    .post(ProjectController.CreateProject)

projectRouter.route('/:id')
    .get(ProjectController.GetProjectById)
    .delete(ProjectController.DeleteProjectById)
    .patch(ProjectController.UpdateProjectById) 

projectRouter.post('/:id/background', upload.single('file'), 
    BackgroundController.UploadBackground)

module.exports = projectRouter;