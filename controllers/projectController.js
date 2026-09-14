const service = require("../services/projectService"); const generateProjectId=async(req,res,next)=>{try{res.json({success:true,data:{projectCode:await service.generateProjectId()}});}catch(e){next(e)}};
const getProjects = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.list({
        query: req.query,
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
        user: req.user,
      }),
    });
  } catch (e) {
    next(e);
  }
};
const getProjectById = async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id, req.user);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const createProject = async (req, res, next) => {
  try {
    const projectCode = req.body.projectCode || await service.generateProjectId();
    const data = await service.create({ ...req.body, projectCode, createdBy: req.user._id, businessDevelopmentOwner: req.user.role === "bd" ? req.user._id : req.body.businessDevelopmentOwner });
    res
      .status(201)
      .json({ success: true, message: "Project created successfully", data });
  } catch (e) {
    next(e);
  }
};
const updateProject = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project updated successfully", data });
  } catch (e) {
    next(e);
  }
};
const deleteProject = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id, req.user._id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    res.json({ success: true, message: "Project deleted successfully", data });
  } catch (e) {
    next(e);
  }
};
module.exports = { generateProjectId,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
const membership=method=>async(req,res,next)=>{try{const data=await method(req);if(!data)return res.status(404).json({success:false,message:'Project not found'});res.json({success:true,data});}catch(e){if(e.status)return res.status(e.status).json({success:false,message:e.message});next(e);}};
module.exports.addMember=membership(req=>service.addMember(req.params.id,req.body.userId));module.exports.removeMember=membership(req=>service.removeMember(req.params.id,req.params.userId));
module.exports.updateScope=membership(req=>service.updateScope(req.params.id,req.body));module.exports.updateFrd=membership(req=>service.updateFrd(req.params.id,req.body,req.user._id));module.exports.addPhase=membership(req=>service.addPhase(req.params.id,req.body));module.exports.updatePhase=membership(req=>service.updatePhase(req.params.id,req.params.phaseId,req.body));

module.exports.deletePhase=membership(req=>service.deletePhase(req.params.id,req.params.phaseId));

module.exports.deleteFrd=membership(req=>service.deleteFrd(req.params.id,req.params.frdId));
