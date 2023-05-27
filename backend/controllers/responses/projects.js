// Convert a single project object to JSON API format
exports.toProjectJsonApi = (project) => ({
  data: {
    type: 'projects',
    id: project.id,
    attributes: {
      title: project.title,
      owner: project.owner,
      content: project.content,
      aws_banner_key: project.aws_banner_key,
      created_at: project.created_at
    }
  }
});

// Convert a list of project objects to JSON API format
exports.toProjectsJsonApi = (projects, links) => ({
  data: projects.map(project => ({
    type: 'projects',
    id: project.id,
    attributes: {
      title: project.title,
      owner: project.owner,
      content: project.content,
      aws_banner_key: project.aws_banner_key,
      created_at: project.created_at
    }
  })),
  links
});