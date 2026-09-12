const service = require("../services/teamService");
const getTeams = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: await service.list({
        query: req.query,
        page: +req.query.page || 1,
        limit: +req.query.limit || 20,
      }),
    });
  } catch (e) {
    next(e);
  }
};
const getTeamById = async (req, res, next) => {
  try {
    const data = await service.findById(req.params.id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
};
const createTeam = async (req, res, next) => {
  try {
    const data = await service.create({ ...req.body, createdBy: req.user._id });
    res
      .status(201)
      .json({ success: true, message: "Team created successfully", data });
  } catch (e) {
    next(e);
  }
};
const updateTeam = async (req, res, next) => {
  try {
    const data = await service.update(req.params.id, req.body);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({ success: true, message: "Team updated successfully", data });
  } catch (e) {
    next(e);
  }
};
const deleteTeam = async (req, res, next) => {
  try {
    const data = await service.remove(req.params.id, req.user._id);
    if (!data)
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    res.json({ success: true, message: "Team deleted successfully", data });
  } catch (e) {
    next(e);
  }
};
const membership=method=>async(req,res,next)=>{try{const data=await method(req);if(!data)return res.status(404).json({success:false,message:'Team not found'});res.json({success:true,data});}catch(e){if(e.status)return res.status(e.status).json({success:false,message:e.message});next(e);}};
const addMember=membership(req=>service.addMember(req.params.id,req.body.userId));const removeMember=membership(req=>service.removeMember(req.params.id,req.params.userId));const assignLead=membership(req=>service.assignLead(req.params.id,req.body.userId));
module.exports = { getTeams, getTeamById, createTeam, updateTeam, deleteTeam, addMember, removeMember, assignLead };
