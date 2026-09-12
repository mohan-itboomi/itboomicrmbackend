require("dotenv").config();
const mongoose = require("mongoose"),
  bcrypt = require("bcryptjs"),
  { User, Project, Task } = require("./app");
(async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/employee_tracker",
  );
  const password = await bcrypt.hash("Admin@123", 12);
  let admin = await User.findOne({ email: "admin@example.com" });
  if (!admin)
    admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password,
      role: "admin",
    });
  const employees = [];
  for (const [name, email, designation] of [
    ["Mohan", "mohan@example.com", "Frontend Developer"],
    ["Arun", "arun@example.com", "Backend Developer"],
    ["Priya", "priya@example.com", "QA Engineer"],
  ]) {
    let u = await User.findOne({ email });
    if (!u)
      u = await User.create({
        name,
        email,
        password: await bcrypt.hash("Employee@123", 12),
        role: "employee",
        designation,
        department: "Development",
      });
    employees.push(u);
  }
  let project = await Project.findOne({ code: "ECOM-001" });
  if (!project)
    project = await Project.create({
      name: "E-Commerce Website",
      code: "ECOM-001",
      description: "Complete e-commerce platform",
      status: "In Progress",
      managerId: employees[0]._id,
      createdBy: admin._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 86400000),
    });
  let project2 = await Project.findOne({ code: "HRMS-001" });
  if (!project2)
    project2 = await Project.create({
      name: "HRMS Portal",
      code: "HRMS-001",
      description: "Internal employee management portal",
      status: "Planning",
      managerId: employees[1]._id,
      createdBy: admin._id,
    });
  if (!(await Task.exists({ projectId: project._id }))) {
    const names = [
      "Authentication",
      "Product Management",
      "Shopping Cart",
      "Order Management",
      "Payment Integration",
      "Admin Dashboard",
      "Product List UI",
      "Create Product",
      "Product API",
      "QA Testing",
    ];
    await Task.insertMany(
      names.map((title, i) => ({
        projectId: project._id,
        title,
        description: `Implement ${title} functionality for the project.`,
        expectedWork:
          "Design, development, validation, API integration and testing",
        assignedTo: employees[i % 3]._id,
        priority: i < 2 ? "High" : "Medium",
        estimatedMinutes: (i + 2) * 60,
        createdBy: admin._id,
        parentTaskId: null,
      })),
    );
  }
  if (!(await Task.exists({ projectId: project2._id })))
    await Task.create({
      projectId: project2._id,
      title: "Employee Registration",
      description: "Build employee registration workflow.",
      expectedWork: "Form, validation and API integration",
      assignedTo: employees[1]._id,
      priority: "High",
      estimatedMinutes: 480,
      createdBy: admin._id,
    });
  console.log("Seed complete");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
