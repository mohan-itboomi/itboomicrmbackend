# Employee CRM & Project Work Tracking System

## Functional Requirements Document (FRD)

### 1. Project Overview

The system is an internal company CRM and employee project/work management platform.

The main purpose is to manage:

* Employees
* Roles and permissions
* Teams
* Projects
* Project tasks
* Daily work
* Task time tracking
* Pause/resume work
* Employee working hours
* Project-wise time
* Task-wise time
* Daily work reports
* Team Lead monitoring
* Tester activities
* Developer activities
* Project Coordinator activities
* Business Development activities
* Management dashboards

The system should allow a Super Admin to create employees, assign roles, create projects, assign employees to projects, create tasks, monitor work progress, and calculate the actual time spent on each task/project.

---

# 2. Technology Stack

## Frontend

* React.js
* TypeScript
* Vite
* React Router
* Redux Toolkit
* Axios
* MUI or Ant Design
* Day.js
* Recharts/ApexCharts

## Backend

* Node.js
* Express.js
* TypeScript
* JWT Authentication
* bcrypt
* REST API

## Database

Recommended:

* MongoDB
* Mongoose

## Other

* Socket.io optional for realtime task timer/status
* Cloudinary/S3 optional for file attachments
* Nodemailer optional for email notifications

---

# 3. User Roles

The system must support Role-Based Access Control (RBAC).

## Main Roles

1. Super Admin
2. Team Lead
3. Web Developer
4. Mobile Developer
5. Tester
6. Project Coordinator
7. Business Development (BD)

---

# 4. Role Hierarchy

```text
Super Admin
    |
    +-- Project Coordinator
    |       |
    |       +-- Team Lead
    |               |
    |               +-- Web Developer
    |               +-- Mobile Developer
    |               +-- Tester
    |
    +-- Business Development
```

The hierarchy can be configurable by the Super Admin.

---

# 5. Super Admin

Super Admin has complete access.

## Super Admin Features

### Dashboard

Display:

* Total Employees
* Active Employees
* Total Projects
* Active Projects
* Completed Projects
* Total Tasks
* Pending Tasks
* In Progress Tasks
* Completed Tasks
* Today's Working Hours
* Today's Active Employees
* Total Time Spent Today
* Project-wise Time
* Employee-wise Time

### Employee Management

Super Admin can:

* Create employee
* View employee
* Edit employee
* Activate employee
* Deactivate employee
* Delete employee
* Assign role
* Assign team
* Assign Team Lead
* Reset password
* View employee activity
* View employee working hours

Employee fields:

```text
Employee ID
Name
Email
Phone
Password
Profile Image
Role
Department
Team
Team Lead
Joining Date
Status
Working Hours
Created Date
```

---

# 6. Employee Roles

## Team Lead

Team Lead can:

* View assigned team
* View team members
* Create tasks
* Assign tasks
* Reassign tasks
* Update task priority
* Update task status
* View employee work time
* View task time
* View project time
* Approve/reject work
* Add comments
* View daily reports

Team Lead should NOT be able to:

* Create Super Admin
* Delete the entire project
* Manage system-level settings
* Manage all employees

---

# 7. Web Developer

Web Developer can:

* View assigned projects
* View assigned tasks
* Start task
* Pause task
* Resume task
* Complete task
* Add task description
* Add comments
* Upload files
* Add GitHub/PR URL
* Update task progress
* View personal work history
* View daily work summary

Developer can only modify tasks assigned to them unless additional permission is provided.

---

# 8. Mobile Developer

Mobile Developer has similar functionality to Web Developer.

Can:

* View mobile projects
* View assigned tasks
* Start task
* Pause task
* Resume task
* Complete task
* Add comments
* Upload APK/build
* Add Git branch
* Add PR URL
* Update progress
* View working time

---

# 9. Tester

Tester can:

* View assigned testing tasks
* Start testing
* Pause testing
* Resume testing
* Complete testing
* Create bug
* Assign bug
* Update bug status
* Add screenshots
* Add test result
* Add comments

Testing statuses:

```text
Not Tested
Testing
Passed
Failed
Blocked
Retest Required
Completed
```

---

# 10. Project Coordinator

Project Coordinator can:

* Create projects
* Edit projects
* Assign Team Leads
* Assign employees
* View project progress
* Create project-level tasks
* Monitor deadlines
* View project time
* View employee time
* View reports
* View project status

Project Coordinator acts as a bridge between management, Team Leads and development teams.

---

# 11. Business Development (BD)

BD can manage:

* Leads
* Customers
* Companies
* Contacts
* Requirements
* Follow-ups
* Opportunities
* Deals

BD can create a project after a deal is converted.

Example:

```text
Lead
 ↓
Customer
 ↓
Requirement
 ↓
Deal
 ↓
Project
```

---

# 12. Authentication

System must support:

* Login
* Logout
* JWT authentication
* Access token
* Refresh token
* Password hashing
* Forgot password
* Reset password
* Change password
* Role-based authorization

Login:

```text
Email
Password
```

After login:

```text
JWT
 ↓
User
 ↓
Role
 ↓
Permissions
 ↓
Dashboard
```

---

# 13. Permission System

Use permission-based authorization instead of checking only roles.

Example permissions:

```text
employee:create
employee:view
employee:update
employee:delete

project:create
project:view
project:update
project:delete

task:create
task:view
task:update
task:delete
task:assign

timer:start
timer:pause
timer:resume
timer:stop

report:view
report:export

lead:create
lead:view
lead:update
lead:delete
```

Role example:

```text
Web Developer

task:view
task:update
timer:start
timer:pause
timer:resume
timer:stop
comment:create
```

---

# 14. Team Management

Super Admin can create teams.

Example:

```text
Web Team
Mobile Team
QA Team
Backend Team
Design Team
BD Team
```

Team fields:

```text
Team ID
Team Name
Team Lead
Members
Department
Status
Created Date
```

---

# 15. Project Management

Project Coordinator/Super Admin can create projects.

Project fields:

```text
Project ID
Project Name
Project Code
Client
Description
Project Type
Start Date
End Date
Priority
Project Manager
Project Coordinator
Team Lead
Assigned Team
Status
Estimated Hours
Actual Hours
Created Date
```

Project status:

```text
Planning
Not Started
Active
On Hold
Completed
Cancelled
```

---

# 16. Project Example

```text
Project:
Company CRM

Project Code:
CRM-001

Client:
ABC Company

Start Date:
01/09/2026

End Date:
30/09/2026

Project Coordinator:
John

Team Lead:
Mohan

Teams:
Web Team
Mobile Team
QA Team
```

---

# 17. Project Modules

Each project can contain modules.

Example:

```text
CRM Project

    Authentication
    Employee Management
    Project Management
    Task Management
    Reports
    Settings
```

Module fields:

```text
Module Name
Description
Project
Priority
Start Date
End Date
Status
Assigned Team
```

---

# 18. Task Management

Every project contains tasks.

Task hierarchy:

```text
Project
   ↓
Module
   ↓
Task
   ↓
Sub Task
```

Example:

```text
Project:
CRM

Module:
Employee Management

Task:
Create Employee API

Sub Tasks:

1. Create employee schema
2. Create controller
3. Create service
4. Create validation
5. Test API
```

---

# 19. Task Fields

```text
Task ID
Task Title
Description
Project
Module
Parent Task
Assigned Employee
Assigned Team
Created By
Priority
Status
Estimated Hours
Start Date
Due Date
Actual Hours
Completion Percentage
Created Date
Updated Date
```

Priority:

```text
Low
Medium
High
Critical
```

Status:

```text
Todo
Assigned
In Progress
Paused
Blocked
Review
Testing
Completed
Cancelled
```

---

# 20. Task Description

Each task must have a detailed description.

Example:

```text
Task:
Create Employee CRUD API

Description:

Create REST APIs for employee management.

Required APIs:

POST /employees
GET /employees
GET /employees/:id
PUT /employees/:id
DELETE /employees/:id

Validation:
Name required
Email required
Role required
Phone required
```

---

# 21. Task Assignment

Team Lead/Project Coordinator can assign tasks.

Example:

```text
Task:
Employee CRUD UI

Assigned To:
Mohan

Role:
Web Developer

Estimated Time:
6 Hours

Due Date:
12/09/2026
```

Employee receives the task in their dashboard.

---

# 22. Daily Task System

Employees should see a daily task dashboard.

Example:

```text
Today's Date: 11/09/2026

My Tasks

1. Login UI
   Estimated: 2h
   Actual: 1h 20m
   Status: Completed

2. Employee CRUD
   Estimated: 5h
   Actual: 3h 40m
   Status: In Progress

3. Dashboard UI
   Estimated: 3h
   Actual: 1h
   Status: Todo
```

---

# 23. Task Timer

The most important feature is the task timer.

Employee clicks:

```text
START TASK
```

System records:

```text
Start Time:
10:15:20 AM
```

Timer starts:

```text
00:00:01
00:00:02
00:00:03
...
```

Employee can click:

```text
PAUSE
```

System records pause time.

Example:

```text
Start:
10:00 AM

Pause:
11:15 AM
```

Working time:

```text
1 Hour 15 Minutes
```

Employee resumes:

```text
Resume:
11:30 AM
```

Employee stops/completes:

```text
Stop:
01:00 PM
```

Total active work:

```text
Start → Pause
10:00 → 11:15 = 1h 15m

Resume → Stop
11:30 → 01:00 = 1h 30m

Total:
2h 45m
```

---

# 24. Timer Rules

Important:

The timer should NOT simply calculate:

```text
Stop Time - Start Time
```

because pause time must be excluded.

Correct calculation:

```text
Total Active Time =
Sum of all work sessions
```

Example:

```text
Session 1
09:30 - 10:30
= 1h

Session 2
11:00 - 12:30
= 1h 30m

Session 3
02:00 - 04:00
= 2h

Total:
4h 30m
```

---

# 25. Work Session

Every start/resume should create a work session.

Example:

```text
Task ID: TASK-1001

Session 1
Start: 09:00
End: 10:30
Duration: 1h 30m

Session 2
Start: 11:00
End: 12:00
Duration: 1h

Session 3
Start: 02:00
End: 04:00
Duration: 2h
```

Total:

```text
4h 30m
```

---

# 26. Pause System

Pause reasons should be recorded.

Example:

```text
Pause Reason:

Lunch
Meeting
Client Discussion
Waiting for API
Waiting for Design
Technical Issue
Personal Break
Other
```

The system should record:

```text
Pause Start
Pause End
Pause Duration
Pause Reason
```

---

# 27. Task Time Calculation

Each task stores:

```text
Estimated Hours
Actual Hours
Remaining Hours
```

Example:

```text
Estimated:
6h

Actual:
4h 20m

Remaining:
1h 40m
```

Formula:

```text
Remaining Time =
Estimated Time - Actual Time
```

If actual time exceeds estimated:

```text
Estimated: 4h
Actual: 5h 30m

Overtime:
1h 30m
```

---

# 28. Project Time Calculation

Project actual time is calculated from its tasks.

Example:

```text
Project: CRM

Task 1 = 5h
Task 2 = 3h
Task 3 = 2h
Task 4 = 4h

Project Actual Time:
14h
```

Project dashboard:

```text
Estimated Hours: 100h
Actual Hours: 65h
Remaining: 35h
```

---

# 29. Employee Daily Working Time

System should calculate each employee's daily working time.

Example:

```text
Employee: Mohan
Date: 11/09/2026

Login:
09:15 AM

Task Work:
09:30 - 11:00 = 1h 30m

Task Work:
11:20 - 01:00 = 1h 40m

Task Work:
02:00 - 04:30 = 2h 30m

Task Work:
05:00 - 06:00 = 1h

Total:
6h 40m
```

---

# 30. Daily Work Summary

At the end of the day:

```text
Employee:
Mohan

Date:
11/09/2026

Tasks Worked:
5

Completed:
3

In Progress:
2

Total Work:
7h 20m

Estimated Work:
8h

Difference:
-40m
```

---

# 31. Daily Attendance

Employee attendance should track:

```text
Login Time
Logout Time
Total Office Time
Total Active Task Time
Break Time
```

Example:

```text
Login:
09:10 AM

Logout:
06:30 PM

Office Time:
9h 20m

Break:
1h 10m

Task Work:
7h 30m
```

---

# 32. Employee Dashboard

Employee dashboard should show:

```text
Good Morning, Mohan

Today's Working Time
06h 20m

Today's Tasks
8

Completed
4

In Progress
2

Pending
2
```

### Current Task

```text
Employee CRUD API

Status:
In Progress

Timer:
02:34:20

[ PAUSE ]

[ COMPLETE ]
```

### Today's Tasks

Table:

```text
Task
Project
Priority
Estimated
Actual
Status
Action
```

---

# 33. Team Lead Dashboard

Display:

```text
Team Members: 8

Active:
5

Absent:
1

Completed Tasks:
12

Pending Tasks:
8

Team Working Hours:
43h 20m
```

Employee table:

```text
Employee
Tasks
Completed
In Progress
Working Time
Status
```

Example:

```text
Mohan
5
3
2
6h 40m
Working
```

---

# 34. Project Dashboard

Display:

```text
Project Name
Progress
Total Tasks
Completed
Pending
In Progress
Estimated Hours
Actual Hours
Remaining Hours
Team Members
```

Progress:

```text
Completed Tasks / Total Tasks * 100
```

Example:

```text
Total Tasks: 50
Completed: 35

Progress:
70%
```

---

# 35. Task Details Page

Task page should show:

```text
Task Title

Description

Project
Module
Assigned Employee
Created By
Priority
Status

Estimated Time
Actual Time
Remaining Time

Start Date
Due Date

Timer

Activity Timeline

Comments

Attachments

GitHub / PR

Sub Tasks
```

---

# 36. Task Activity Timeline

Record every important action.

Example:

```text
10:00 AM
Mohan started task

11:15 AM
Mohan paused task

11:30 AM
Mohan resumed task

01:00 PM
Mohan added comment

02:00 PM
Mohan uploaded file

04:30 PM
Mohan completed task
```

---

# 37. Comments

Users can comment on tasks.

Example:

```text
Mohan:
API integration completed.

Team Lead:
Please add validation for phone number.

Mohan:
Validation added.
```

Comments should contain:

```text
User
Message
Created Date
Updated Date
```

---

# 38. Attachments

Tasks can contain attachments.

Allowed:

```text
Images
PDF
DOC
ZIP
APK
Screenshots
```

Example:

Tester can upload:

```text
bug-screenshot.png
```

Developer can upload:

```text
app-release.apk
```

---

# 39. Bug Management

Tester can create bugs.

Bug fields:

```text
Bug ID
Title
Description
Project
Task
Reported By
Assigned To
Priority
Severity
Status
Screenshot
Created Date
Resolved Date
```

Severity:

```text
Low
Medium
High
Critical
```

Bug status:

```text
Open
Assigned
In Progress
Fixed
Retest
Passed
Rejected
Closed
```

---

# 40. Developer → Tester Flow

```text
Developer
    ↓
Complete Development
    ↓
Send for Review
    ↓
Team Lead Review
    ↓
Testing
    ↓
Tester Tests
    ↓
Passed
    ↓
Completed
```

If failed:

```text
Tester
 ↓
Bug Created
 ↓
Developer
 ↓
Fix
 ↓
Retest
```

---

# 41. Task Workflow

Standard task workflow:

```text
Todo
 ↓
Assigned
 ↓
In Progress
 ↓
Paused
 ↓
Resume
 ↓
Review
 ↓
Testing
 ↓
Completed
```

Alternative:

```text
In Progress
 ↓
Blocked
 ↓
Unblocked
 ↓
In Progress
```

---

# 42. Notifications

Notifications should be generated for:

* New task assigned
* Task reassigned
* Task deadline approaching
* Task overdue
* Comment added
* Task moved to testing
* Bug created
* Bug assigned
* Bug fixed
* Task completed
* Project created
* Employee added to project

Notification example:

```text
New Task Assigned

You have been assigned:
Employee CRUD API

Project:
CRM

Due:
12/09/2026
```

---

# 43. Reports

Super Admin and authorized users should have reports.

## Employee Report

Filters:

```text
Employee
Role
Team
Date From
Date To
Project
```

Show:

```text
Total Tasks
Completed Tasks
Pending Tasks
Estimated Hours
Actual Hours
Working Days
Total Working Hours
```

## Project Report

Show:

```text
Project
Estimated Hours
Actual Hours
Remaining Hours
Total Tasks
Completed
Pending
Progress
```

## Daily Report

```text
Date
Employee
Project
Task
Start Time
End Time
Duration
Status
```

---

# 44. EOD Report

Employee can submit an EOD report.

Fields:

```text
Date

What did you work on today?

Completed Tasks

In Progress Tasks

Blockers

Tomorrow's Plan

Total Working Hours
```

Example:

```text
Today's Work:

1. Employee CRUD API
2. Login API
3. Dashboard API

Completed:
Employee CRUD API

In Progress:
Dashboard API

Blocker:
Waiting for UI design

Tomorrow:
Complete dashboard integration
```

---

# 45. EOD Approval

Optional workflow:

```text
Employee
 ↓
Submit EOD
 ↓
Team Lead
 ↓
Review
 ↓
Approve / Request Changes
```

---

# 46. Calendar

Calendar should display:

* Tasks
* Deadlines
* Meetings
* Project milestones
* Employee leave
* Holidays

Views:

```text
Month
Week
Day
```

---

# 47. Search and Filters

All major pages should support:

* Search
* Pagination
* Sorting
* Filtering

Task filters:

```text
Project
Employee
Team
Status
Priority
Date
```

---

# 48. Database Models

## User

```text
User
- _id
- employeeId
- name
- email
- password
- phone
- role
- department
- team
- teamLead
- status
- joiningDate
- createdAt
- updatedAt
```

## Role

```text
Role
- _id
- name
- permissions[]
- description
```

## Permission

```text
Permission
- _id
- name
- module
- action
```

## Team

```text
Team
- _id
- name
- teamLead
- members[]
- status
```

## Project

```text
Project
- _id
- projectCode
- name
- client
- description
- coordinator
- teamLead
- members[]
- startDate
- endDate
- estimatedMinutes
- status
- priority
```

## Module

```text
Module
- _id
- projectId
- name
- description
- status
```

## Task

```text
Task
- _id
- taskCode
- projectId
- moduleId
- parentTaskId
- title
- description
- assignedTo
- createdBy
- priority
- status
- estimatedMinutes
- actualMinutes
- dueDate
- completionPercentage
```

## WorkSession

```text
WorkSession
- _id
- taskId
- projectId
- employeeId
- startTime
- endTime
- durationMinutes
- status
```

## PauseSession

```text
PauseSession
- _id
- workSessionId
- taskId
- employeeId
- startTime
- endTime
- durationMinutes
- reason
```

## DailyWork

```text
DailyWork
- _id
- employeeId
- date
- totalWorkingMinutes
- totalBreakMinutes
- totalTaskMinutes
- completedTasks
- pendingTasks
```

## Comment

```text
Comment
- _id
- taskId
- userId
- message
- createdAt
- updatedAt
```

## Bug

```text
Bug
- _id
- bugCode
- projectId
- taskId
- title
- description
- severity
- priority
- status
- reportedBy
- assignedTo
- attachments[]
```

## EODReport

```text
EODReport
- _id
- employeeId
- date
- completedTasks[]
- inProgressTasks[]
- blockers
- tomorrowPlan
- totalMinutes
- status
- reviewedBy
```

---

# 49. Backend Folder Structure

Use clean architecture.

```text
backend/

src/

config/
    database.ts
    env.ts

controllers/
    auth.controller.ts
    user.controller.ts
    project.controller.ts
    task.controller.ts
    timer.controller.ts
    team.controller.ts
    report.controller.ts
    bug.controller.ts
    eod.controller.ts

models/
    User.ts
    Role.ts
    Permission.ts
    Team.ts
    Project.ts
    Module.ts
    Task.ts
    WorkSession.ts
    PauseSession.ts
    DailyWork.ts
    Comment.ts
    Bug.ts
    EODReport.ts

routes/
    auth.routes.ts
    user.routes.ts
    project.routes.ts
    task.routes.ts
    timer.routes.ts
    team.routes.ts
    report.routes.ts
    bug.routes.ts
    eod.routes.ts

services/
    auth.service.ts
    user.service.ts
    project.service.ts
    task.service.ts
    timer.service.ts
    report.service.ts

middlewares/
    auth.middleware.ts
    role.middleware.ts
    permission.middleware.ts
    error.middleware.ts

utils/
    jwt.ts
    password.ts
    time.ts
    pagination.ts

validators/
    auth.validator.ts
    user.validator.ts
    project.validator.ts
    task.validator.ts

app.ts
server.ts
```

---

# 50. API Structure

Base URL:

```text
/api/v1
```

## Authentication

```http
POST /auth/login
POST /auth/refresh
POST /auth/logout
POST /auth/change-password
POST /auth/forgot-password
POST /auth/reset-password
GET /auth/me
```

## Employees

```http
POST /employees
GET /employees
GET /employees/:id
PUT /employees/:id
DELETE /employees/:id
PATCH /employees/:id/status
```

## Teams

```http
POST /teams
GET /teams
GET /teams/:id
PUT /teams/:id
DELETE /teams/:id
POST /teams/:id/members
DELETE /teams/:id/members/:employeeId
```

## Projects

```http
POST /projects
GET /projects
GET /projects/:id
PUT /projects/:id
DELETE /projects/:id
POST /projects/:id/members
DELETE /projects/:id/members/:employeeId
```

## Modules

```http
POST /projects/:projectId/modules
GET /projects/:projectId/modules
PUT /modules/:id
DELETE /modules/:id
```

## Tasks

```http
POST /tasks
GET /tasks
GET /tasks/:id
PUT /tasks/:id
DELETE /tasks/:id

POST /tasks/:id/assign
PATCH /tasks/:id/status
PATCH /tasks/:id/progress
POST /tasks/:id/comments
GET /tasks/:id/comments
```

---

# 51. Timer APIs

## Start Task

```http
POST /tasks/:taskId/timer/start
```

Response:

```json
{
  "success": true,
  "message": "Task timer started",
  "startTime": "2026-09-11T09:30:00Z"
}
```

## Pause

```http
POST /tasks/:taskId/timer/pause
```

## Resume

```http
POST /tasks/:taskId/timer/resume
```

## Stop

```http
POST /tasks/:taskId/timer/stop
```

## Current Timer

```http
GET /tasks/:taskId/timer/current
```

## Task Time

```http
GET /tasks/:taskId/time
```

---

# 52. Timer Security Rules

Backend must control timer calculations.

Do NOT trust frontend timer values.

Frontend:

```text
00:35:21
```

is only a display.

Backend should calculate actual duration using timestamps.

Example:

```text
startTime = 10:00
endTime = 11:00

duration =
endTime - startTime
```

This prevents users from manipulating working hours from browser JavaScript.

---

# 53. Multiple Timer Rule

An employee should not be able to actively run two tasks simultaneously.

Example:

```text
Task A
Running
```

User attempts:

```text
Start Task B
```

Backend response:

```text
You already have an active task.
Please pause or stop Task A before starting Task B.
```

Optional setting:

Super Admin can allow multiple timers if required.

---

# 54. Automatic Timer Recovery

If browser closes while task is running:

```text
Browser Closed
      ↓
Timer remains active in backend
      ↓
User opens application
      ↓
GET /timer/current
      ↓
Timer continues from backend start time
```

This is important.

Timer should NOT depend on browser memory.

---

# 55. Daily Time Calculation

Every work session contributes to daily work.

Formula:

```text
Daily Task Time =
SUM(all task work sessions for employee on date)
```

Example:

```text
Task A = 2h
Task B = 1h 30m
Task C = 3h

Daily Total:
6h 30m
```

---

# 56. Project Time Calculation

```text
Project Total Time =
SUM(task work sessions belonging to project)
```

Do not manually trust a frontend value.

---

# 57. Employee Productivity

Dashboard can calculate:

```text
Task Completion Rate

Completed Tasks / Assigned Tasks × 100
```

Time efficiency:

```text
Estimated Time / Actual Time × 100
```

Example:

```text
Estimated:
8h

Actual:
6h

Efficiency:
133%
```

However, productivity scores should be treated as reporting metrics, not the sole measure of employee performance.

---

# 58. Overdue Tasks

A task is overdue when:

```text
Current Date > Due Date
AND
Status != Completed
```

Show:

```text
OVERDUE
```

Dashboard:

```text
Overdue Tasks: 6
```

---

# 59. Project Progress

Project progress can be calculated based on completed tasks.

```text
Progress =
Completed Tasks / Total Tasks × 100
```

Optional weighted calculation:

```text
Task Weight = Estimated Hours

Project Progress =
Completed Estimated Hours /
Total Estimated Hours × 100
```

Weighted progress is recommended for projects where tasks have very different sizes.

---

# 60. Dashboard Charts

Super Admin:

```text
Employee Working Hours
Project Working Hours
Task Status
Project Progress
Daily Working Hours
```

Charts:

* Bar chart
* Line chart
* Pie/Donut chart

---

# 61. Audit Logs

System should record important actions.

Example:

```text
Who:
Mohan

Action:
Updated Task

Task:
TASK-1001

Old Status:
In Progress

New Status:
Completed

Date:
11/09/2026
```

Audit actions:

```text
CREATE
UPDATE
DELETE
ASSIGN
STATUS_CHANGE
TIMER_START
TIMER_PAUSE
TIMER_RESUME
TIMER_STOP
LOGIN
LOGOUT
```

---

# 62. Audit Log Model

```text
AuditLog

_id
userId
action
module
entityId
oldValue
newValue
ipAddress
userAgent
createdAt
```

---

# 63. Project Team Flow

```text
Super Admin
      ↓
Create Employee
      ↓
Assign Role
      ↓
Create Team
      ↓
Create Project
      ↓
Assign Project Coordinator
      ↓
Assign Team Lead
      ↓
Add Team Members
      ↓
Create Modules
      ↓
Create Tasks
      ↓
Assign Tasks
      ↓
Employee Starts Task
      ↓
Timer Runs
      ↓
Pause / Resume
      ↓
Complete
      ↓
Team Lead Review
      ↓
Tester
      ↓
Completed
```

---

# 64. Example Real-World Workflow

Project:

```text
E-Commerce Application
```

Module:

```text
Authentication
```

Task:

```text
Create Login API
```

Assigned:

```text
Backend Developer
```

Estimated:

```text
4 Hours
```

Employee clicks:

```text
START
```

09:30 AM → 11:00 AM

```text
1h 30m
```

Employee pauses for meeting:

```text
11:00 AM → 11:30 AM
```

Resume:

```text
11:30 AM → 01:00 PM
```

Second work session:

```text
1h 30m
```

Total:

```text
3 Hours
```

Estimated:

```text
4 Hours
```

Remaining:

```text
1 Hour
```

---

# 65. Frontend Pages

## Authentication

```text
/login
/forgot-password
/reset-password
```

## Super Admin

```text
/dashboard

/employees
/employees/create
/employees/:id
/employees/:id/edit

/teams
/projects
/projects/create
/projects/:id

/tasks
/reports
/reports/daily
/reports/project
/reports/employee

/audit-logs
/settings
```

## Employee

```text
/dashboard
/my-tasks
/my-projects
/today
/timesheet
/eod-report
/notifications
/profile
```

## Team Lead

```text
/dashboard
/my-team
/tasks
/team-timesheet
/team-reports
```

## Tester

```text
/dashboard
/testing
/bugs
/bugs/:id
```

## BD

```text
/dashboard
/leads
/customers
/requirements
/opportunities
/deals
```

---

# 66. Sidebar Should Be Role Based

Super Admin:

```text
Dashboard
Employees
Teams
Projects
Tasks
Reports
Audit Logs
Settings
```

Web Developer:

```text
Dashboard
My Tasks
My Projects
Today's Work
Timesheet
EOD Report
Notifications
Profile
```

Team Lead:

```text
Dashboard
My Team
Projects
Tasks
Team Timesheet
Reports
```

Tester:

```text
Dashboard
Testing Tasks
Bugs
Reports
```

BD:

```text
Dashboard
Leads
Customers
Requirements
Opportunities
Deals
```

---

# 67. Important Business Rules

### Rule 1

Only authorized users can create employees.

### Rule 2

Only Super Admin can create/change system roles.

### Rule 3

Employee can only view projects assigned to them.

### Rule 4

Employee can only work on assigned tasks.

### Rule 5

One employee should normally have only one active timer.

### Rule 6

Timer calculations must happen on the backend.

### Rule 7

Pause duration must not count as working time.

### Rule 8

Completed tasks cannot normally be edited by employees.

### Rule 9

Team Lead can reopen a completed task if necessary.

### Rule 10

Deleted records should preferably use soft delete.

### Rule 11

All important actions should be stored in Audit Logs.

### Rule 12

Every task must belong to a project.

### Rule 13

Every work session must belong to an employee and task.

---

# 68. Soft Delete

Instead of permanently deleting important data:

```text
isDeleted: true
deletedAt
deletedBy
```

Use soft deletion for:

* Employees
* Projects
* Tasks
* Teams

This preserves reporting/history.

---

# 69. API Response Format

Use a consistent API response.

Success:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "You already have an active task",
  "errors": []
}
```

---

# 70. Pagination

All large lists should support:

```text
?page=1
&limit=20
&search=employee
&sortBy=createdAt
&sortOrder=desc
```

Response:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# 71. Security

Backend must implement:

* JWT
* Password hashing with bcrypt
* Role authorization
* Permission authorization
* Request validation
* Rate limiting
* CORS
* Helmet
* Input sanitization
* MongoDB query protection
* Error handling
* Secure HTTP-only refresh cookie if refresh tokens are cookie-based

Never return password fields from APIs.

---

# 72. Recommended Development Phases

## Phase 1 – Authentication

Build:

```text
Login
JWT
Refresh Token
Logout
Roles
Permissions
```

## Phase 2 – Employee Management

Build:

```text
Employee CRUD
Role Assignment
Team Assignment
```

## Phase 3 – Team Management

Build:

```text
Teams
Team Leads
Members
```

## Phase 4 – Project Management

Build:

```text
Projects
Modules
Project Members
Project Dashboard
```

## Phase 5 – Task Management

Build:

```text
Tasks
Sub Tasks
Assignment
Status
Priority
Comments
Attachments
```

## Phase 6 – Time Tracking

Build:

```text
Start
Pause
Resume
Stop
Work Sessions
Daily Time
Task Time
Project Time
```

## Phase 7 – Testing/Bugs

Build:

```text
Testing Workflow
Bug Management
Retesting
```

## Phase 8 – Reports

Build:

```text
Employee Report
Project Report
Daily Report
Timesheet
EOD Report
```

## Phase 9 – Notifications

Build:

```text
Task Assignment
Comments
Deadlines
Bug Notifications
```

## Phase 10 – Audit & Security

Build:

```text
Audit Logs
Security
Permission Management
Soft Delete
```

---

# 73. Final System Architecture

```text
                    FRONTEND
                       |
                    React.js
                       |
                    Axios
                       |
                    REST API
                       |
                  Node.js/Express
                       |
        +--------------+--------------+
        |              |              |
   Controllers     Services      Middlewares
        |              |              |
        +--------------+--------------+
                       |
                    Mongoose
                       |
                    MongoDB
```

---

# 74. Complete System Flow

```text
                    SUPER ADMIN
                         |
          +--------------+---------------+
          |              |               |
      Employees        Teams          Projects
          |              |               |
        Roles        Team Lead         Modules
          |              |               |
          +--------------+---------------+
                         |
                       TASKS
                         |
               +---------+---------+
               |                   |
          Web Developer       Mobile Developer
               |                   |
               +---------+---------+
                         |
                    TIME TRACKING
                         |
             +-----------+-----------+
             |           |           |
           START       PAUSE       RESUME
             |           |           |
             +-----------+-----------+
                         |
                       STOP
                         |
                  WORK SESSION
                         |
               +---------+---------+
               |                   |
          Daily Time          Project Time
               |                   |
               +---------+---------+
                         |
                      REPORTS
                         |
              +----------+----------+
              |                     |
          Team Lead             Super Admin
```

---

# 75. Final Objective

The final application should provide one central system where management can answer:

```text
Who is working?
What project are they working on?
What task are they working on?
When did they start?
How long did they work?
How much time did they pause?
How much time did they actually spend?
What did they complete today?
What is pending?
Which project is consuming more time?
Which tasks are overdue?
What is each team's workload?
What is the project's progress?
```

The system should calculate these values automatically from backend work-session data rather than relying on manually entered time.

The most important principle is:

Employee → Project → Module → Task → Work Session → Daily Time → Project Time → Reports
