import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ERP database for Indian digital services agency...');

  // ─── Create Tenant ───
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Nueera Digital Pvt. Ltd.',
      industry: 'Digital Services & Technology',
      gstNumber: '27AABCN1234F1Z5',
      panNumber: 'AABCN1234F',
      address: 'B-1204, Raheja Platinum, Infiniti Mall Rd',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    },
  });

  console.log(`✅ Created tenant: ${tenant.name}`);

  // ─── Create Departments ───
  const departments = await Promise.all([
    prisma.department.create({ data: { name: 'Engineering', code: 'ENG', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'Design', code: 'DES', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'Project Management', code: 'PM', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'Sales & Marketing', code: 'S&M', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'Human Resources', code: 'HR', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'Finance', code: 'FIN', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'Quality Assurance', code: 'QA', tenantId: tenant.id } }),
    prisma.department.create({ data: { name: 'DevOps', code: 'OPS', tenantId: tenant.id } }),
  ]);

  console.log(`✅ Created ${departments.length} departments`);

  // ─── Create Employees ───
  const employeeData = [
    { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul.sharma@nueera.in', phone: '+91 98765 43210', designation: 'Senior Frontend Engineer', departmentId: departments[0].id, baseSalary: 1800000, productivityScore: 92 },
    { firstName: 'Priya', lastName: 'Patel', email: 'priya.patel@nueera.in', phone: '+91 98765 43211', designation: 'UI/UX Designer', departmentId: departments[1].id, baseSalary: 1500000, productivityScore: 88 },
    { firstName: 'Amit', lastName: 'Kumar', email: 'amit.kumar@nueera.in', phone: '+91 98765 43212', designation: 'Project Manager', departmentId: departments[2].id, baseSalary: 2000000, productivityScore: 85 },
    { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@nueera.in', phone: '+91 98765 43213', designation: 'Backend Engineer', departmentId: departments[0].id, baseSalary: 1900000, productivityScore: 90 },
    { firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@nueera.in', phone: '+91 98765 43214', designation: 'Sales Manager', departmentId: departments[3].id, baseSalary: 1700000, productivityScore: 78 },
    { firstName: 'Anjali', lastName: 'Gupta', email: 'anjali.gupta@nueera.in', phone: '+91 98765 43215', designation: 'HR Manager', departmentId: departments[4].id, baseSalary: 1600000, productivityScore: 95 },
    { firstName: 'Karthik', lastName: 'Iyer', email: 'karthik.iyer@nueera.in', phone: '+91 98765 43216', designation: 'Full Stack Developer', departmentId: departments[0].id, baseSalary: 1750000, productivityScore: 87 },
    { firstName: 'Meera', lastName: 'Nair', email: 'meera.nair@nueera.in', phone: '+91 98765 43217', designation: 'Visual Designer', departmentId: departments[1].id, baseSalary: 1400000, productivityScore: 91 },
    { firstName: 'Rajesh', lastName: 'Verma', email: 'rajesh.verma@nueera.in', phone: '+91 98765 43218', designation: 'Finance Controller', departmentId: departments[5].id, baseSalary: 2200000, productivityScore: 93 },
    { firstName: 'Deepa', lastName: 'Menon', email: 'deepa.menon@nueera.in', phone: '+91 98765 43219', designation: 'QA Lead', departmentId: departments[6].id, baseSalary: 1550000, productivityScore: 86 },
    { firstName: 'Suresh', lastName: 'Babu', email: 'suresh.babu@nueera.in', phone: '+91 98765 43220', designation: 'DevOps Engineer', departmentId: departments[7].id, baseSalary: 1850000, productivityScore: 89 },
    { firstName: 'Neha', lastName: 'Joshi', email: 'neha.joshi@nueera.in', phone: '+91 98765 43221', designation: 'Content Strategist', departmentId: departments[3].id, baseSalary: 1200000, productivityScore: 82 },
    { firstName: 'Arjun', lastName: 'Rao', email: 'arjun.rao@nueera.in', phone: '+91 98765 43222', designation: 'React Developer', departmentId: departments[0].id, baseSalary: 1650000, productivityScore: 84 },
    { firstName: 'Pooja', lastName: 'Das', email: 'pooja.das@nueera.in', phone: '+91 98765 43223', designation: 'Motion Designer', departmentId: departments[1].id, baseSalary: 1350000, productivityScore: 79 },
    { firstName: 'Manish', lastName: 'Tiwari', email: 'manish.tiwari@nueera.in', phone: '+91 98765 43224', designation: 'Scrum Master', departmentId: departments[2].id, baseSalary: 1700000, productivityScore: 88 },
    { firstName: 'Swati', lastName: 'Kulkarni', email: 'swati.kulkarni@nueera.in', phone: '+91 98765 43225', designation: 'QA Engineer', departmentId: departments[6].id, baseSalary: 1300000, productivityScore: 85 },
    { firstName: 'Gaurav', lastName: 'Mishra', email: 'gaurav.mishra@nueera.in', phone: '+91 98765 43226', designation: 'Node.js Developer', departmentId: departments[0].id, baseSalary: 1700000, productivityScore: 83 },
    { firstName: 'Ritu', lastName: 'Agarwal', email: 'ritu.agarwal@nueera.in', phone: '+91 98765 43227', designation: 'Business Analyst', departmentId: departments[2].id, baseSalary: 1550000, productivityScore: 90 },
    { firstName: 'Sanjay', lastName: 'Chauhan', email: 'sanjay.chauhan@nueera.in', phone: '+91 98765 43228', designation: 'Cloud Architect', departmentId: departments[7].id, baseSalary: 2500000, productivityScore: 94 },
    { firstName: 'Tanvi', lastName: 'Pillai', email: 'tanvi.pillai@nueera.in', phone: '+91 98765 43229', designation: 'Junior Designer', departmentId: departments[1].id, baseSalary: 800000, productivityScore: 76, status: 'probation' },
  ];

  const employees = [];
  for (const emp of employeeData) {
    const joinDate = new Date(2024 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const employee = await prisma.employee.create({
      data: {
        ...emp,
        tenantId: tenant.id,
        joinDate,
        salaryBand: `L${Math.ceil(emp.baseSalary / 500000)}`,
        status: emp.status || 'active',
      },
    });
    employees.push(employee);
  }

  console.log(`✅ Created ${employees.length} employees`);

  // ─── Create Projects ───
  const projectData = [
    { name: 'NexaBank Mobile App', client: 'NexaBank Financial Services', accountManager: 'Amit Kumar', budget: 4500000, actualSpend: 3800000, progress: 75, profitability: 18, health: 'good', sla: 95, priority: 'high', isRecurring: false, departmentId: departments[0].id },
    { name: 'ShopVerse E-commerce Platform', client: 'ShopVerse Retail Pvt. Ltd.', accountManager: 'Vikram Singh', budget: 8000000, actualSpend: 9200000, progress: 60, profitability: -8, health: 'critical', sla: 82, priority: 'critical', isRecurring: false, departmentId: departments[0].id },
    { name: 'MediCare Patient Portal', client: 'MediCare Health Systems', accountManager: 'Amit Kumar', budget: 3200000, actualSpend: 2400000, progress: 85, profitability: 25, health: 'excellent', sla: 98, priority: 'medium', isRecurring: false, departmentId: departments[0].id },
    { name: 'EduLearn LMS', client: 'EduLearn Academy', accountManager: 'Vikram Singh', budget: 2800000, actualSpend: 2600000, progress: 90, profitability: 12, health: 'good', sla: 94, priority: 'medium', isRecurring: false, departmentId: departments[0].id },
    { name: 'FoodieApp Delivery Platform', client: 'FoodieApp Technologies', accountManager: 'Amit Kumar', budget: 5500000, actualSpend: 4000000, progress: 45, profitability: 15, health: 'at-risk', sla: 88, priority: 'high', isRecurring: false, departmentId: departments[0].id },
    { name: 'TravelGo Booking System', client: 'TravelGo Holidays', accountManager: 'Vikram Singh', budget: 3800000, actualSpend: 3200000, progress: 70, profitability: 20, health: 'good', sla: 92, priority: 'medium', isRecurring: true, departmentId: departments[0].id },
    { name: 'InsureRight Claims Portal', client: 'InsureRight General Insurance', accountManager: 'Amit Kumar', budget: 4200000, actualSpend: 3500000, progress: 55, profitability: 10, health: 'good', sla: 90, priority: 'high', isRecurring: false, departmentId: departments[0].id },
    { name: 'GreenEnergy Dashboard', client: 'GreenEnergy Solutions', accountManager: 'Vikram Singh', budget: 2200000, actualSpend: 1800000, progress: 95, profitability: 30, health: 'excellent', sla: 99, priority: 'low', isRecurring: true, departmentId: departments[7].id },
  ];

  const projects = [];
  for (const proj of projectData) {
    const dueDate = new Date(2026, Math.floor(Math.random() * 6) + 6, Math.floor(Math.random() * 28) + 1);
    const project = await prisma.project.create({
      data: {
        ...proj,
        tenantId: tenant.id,
        dueDate,
      },
    });
    projects.push(project);
  }

  console.log(`✅ Created ${projects.length} projects`);

  // ─── Create Milestones ───
  for (const project of projects) {
    const milestoneNames = ['Discovery & Planning', 'Design Complete', 'Alpha Release', 'Beta Release', 'UAT Sign-off', 'Go Live'];
    for (let i = 0; i < 4; i++) {
      await prisma.milestone.create({
        data: {
          projectId: project.id,
          title: milestoneNames[i],
          date: new Date(2026, i + 1, 15),
          completed: project.progress > (i + 1) * 20,
        },
      });
    }
  }

  console.log('✅ Created milestones for all projects');

  // ─── Create Tasks ───
  const taskTitles = ['Setup project repository', 'Create database schema', 'Build authentication flow', 'Design landing page', 'Implement API endpoints', 'Write unit tests', 'Code review', 'Deploy to staging', 'Fix responsive layout', 'Performance optimization'];
  const stages = ['todo', 'in-progress', 'review', 'done', 'done', 'done'];

  for (const project of projects) {
    for (let i = 0; i < 6; i++) {
      const assignee = employees[Math.floor(Math.random() * employees.length)];
      await prisma.task.create({
        data: {
          projectId: project.id,
          title: taskTitles[i],
          description: `${taskTitles[i]} for ${project.name}`,
          stage: stages[i],
          assignee: `${assignee.firstName} ${assignee.lastName}`,
          dueDate: new Date(2026, Math.floor(Math.random() * 4) + 4, Math.floor(Math.random() * 28) + 1),
          storyPoints: [1, 2, 3, 5, 8][Math.floor(Math.random() * 5)],
          timeLogged: Math.floor(Math.random() * 40) + 5,
        },
      });
    }
  }

  console.log('✅ Created tasks for all projects');

  // ─── Create Invoices ───
  const invoiceData = [
    { invoiceNo: 'INV-2026-001', client: 'NexaBank Financial Services', amount: 1500000, gst: 270000, status: 'paid', paidAmount: 1770000, recurring: false },
    { invoiceNo: 'INV-2026-002', client: 'ShopVerse Retail Pvt. Ltd.', amount: 2800000, gst: 504000, status: 'overdue', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-003', client: 'MediCare Health Systems', amount: 960000, gst: 172800, status: 'sent', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-004', client: 'EduLearn Academy', amount: 840000, gst: 151200, status: 'paid', paidAmount: 991200, recurring: false },
    { invoiceNo: 'INV-2026-005', client: 'FoodieApp Technologies', amount: 2200000, gst: 396000, status: 'draft', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-006', client: 'TravelGo Holidays', amount: 1140000, gst: 205200, status: 'paid', paidAmount: 1345200, recurring: true },
    { invoiceNo: 'INV-2026-007', client: 'InsureRight General Insurance', amount: 1680000, gst: 302400, status: 'partial', paidAmount: 991200, recurring: false },
    { invoiceNo: 'INV-2026-008', client: 'GreenEnergy Solutions', amount: 660000, gst: 118800, status: 'sent', paidAmount: 0, recurring: true },
    { invoiceNo: 'INV-2026-009', client: 'NexaBank Financial Services', amount: 750000, gst: 135000, status: 'sent', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-010', client: 'ShopVerse Retail Pvt. Ltd.', amount: 1800000, gst: 324000, status: 'overdue', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-011', client: 'MediCare Health Systems', amount: 480000, gst: 86400, status: 'draft', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-012', client: 'EduLearn Academy', amount: 560000, gst: 100800, status: 'paid', paidAmount: 660800, recurring: false },
    { invoiceNo: 'INV-2026-013', client: 'FoodieApp Technologies', amount: 1100000, gst: 198000, status: 'sent', paidAmount: 0, recurring: false },
    { invoiceNo: 'INV-2026-014', client: 'TravelGo Holidays', amount: 380000, gst: 68400, status: 'paid', paidAmount: 448400, recurring: true },
    { invoiceNo: 'INV-2026-015', client: 'GreenEnergy Solutions', amount: 440000, gst: 79200, status: 'paid', paidAmount: 519200, recurring: true },
  ];

  const invoices = [];
  for (const inv of invoiceData) {
    const dueDate = new Date(2026, Math.floor(Math.random() * 4) + 3, Math.floor(Math.random() * 28) + 1);
    const invoice = await prisma.invoice.create({
      data: {
        ...inv,
        tenantId: tenant.id,
        projectId: projects[Math.floor(Math.random() * projects.length)].id,
        dueDate,
      },
    });
    invoices.push(invoice);
  }

  console.log(`✅ Created ${invoices.length} invoices`);

  // ─── Create Vendors ───
  const vendorData = [
    { name: 'CloudHost India', type: 'Infrastructure', contractValue: 2400000, payoutDue: 600000, slaScore: 92, qualityScore: 88, rating: 4.2, status: 'active' },
    { name: 'DesignStudio Pro', type: 'Creative Services', contractValue: 1800000, payoutDue: 450000, slaScore: 78, qualityScore: 95, rating: 4.5, status: 'active' },
    { name: 'SecureNet Solutions', type: 'Cybersecurity', contractValue: 1200000, payoutDue: 300000, slaScore: 96, qualityScore: 90, rating: 4.7, status: 'active' },
    { name: 'DataPipe Analytics', type: 'Data & BI', contractValue: 900000, payoutDue: 225000, slaScore: 85, qualityScore: 82, rating: 3.8, status: 'on-notice' },
    { name: 'QuickFix IT Services', type: 'IT Support', contractValue: 600000, payoutDue: 150000, slaScore: 70, qualityScore: 65, rating: 3.2, status: 'suspended' },
  ];

  const vendors = [];
  for (const v of vendorData) {
    const vendor = await prisma.vendor.create({
      data: { ...v, tenantId: tenant.id },
    });
    vendors.push(vendor);
  }

  console.log(`✅ Created ${vendors.length} vendors`);

  // ─── Create Assets ───
  const assetData = [
    { name: 'MacBook Pro 16" M3', type: 'Laptop', serialNo: 'MBP-2024-001', assignedTo: 'Rahul Sharma', purchaseCost: 299900 },
    { name: 'Dell UltraSharp 27"', type: 'Monitor', serialNo: 'MON-2024-001', assignedTo: 'Priya Patel', purchaseCost: 52000 },
    { name: 'MacBook Pro 14" M3', type: 'Laptop', serialNo: 'MBP-2024-002', assignedTo: 'Sneha Reddy', purchaseCost: 239900 },
    { name: 'iPad Pro 12.9"', type: 'Tablet', serialNo: 'TAB-2024-001', assignedTo: 'Meera Nair', purchaseCost: 129900 },
    { name: 'ThinkPad X1 Carbon', type: 'Laptop', serialNo: 'TP-2024-001', assignedTo: 'Karthik Iyer', purchaseCost: 165000 },
    { name: 'AWS Cloud Instance (prod)', type: 'Cloud Resource', serialNo: 'AWS-PROD-001', assignedTo: 'Suresh Babu', purchaseCost: 450000 },
    { name: 'Figma Enterprise License', type: 'Software', serialNo: 'FIG-ENT-001', assignedTo: 'Design Team', purchaseCost: 72000 },
    { name: 'Jira Premium License', type: 'Software', serialNo: 'JIRA-PREM-001', assignedTo: 'PM Team', purchaseCost: 96000 },
    { name: 'Ergonomic Desk Chair', type: 'Furniture', serialNo: 'FRN-2024-001', assignedTo: 'Rajesh Verma', purchaseCost: 35000 },
    { name: 'Canon EOS R6 Mark II', type: 'Camera', serialNo: 'CAM-2024-001', assignedTo: 'Pooja Das', purchaseCost: 245000 },
  ];

  const assets = [];
  for (const a of assetData) {
    const purchaseDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const warrantyEnd = new Date(purchaseDate.getFullYear() + 2, purchaseDate.getMonth(), purchaseDate.getDate());
    const asset = await prisma.asset.create({
      data: {
        ...a,
        tenantId: tenant.id,
        purchaseDate,
        warrantyEnd,
        status: a.type === 'Cloud Resource' ? 'active' : 'active',
      },
    });
    assets.push(asset);
  }

  console.log(`✅ Created ${assets.length} assets`);

  // ─── Create Attendance (last 30 days for all employees) ───
  const attendanceStatuses = ['present', 'present', 'present', 'present', 'wfh', 'absent', 'half-day'];
  let attendanceCount = 0;

  for (const emp of employees.slice(0, 15)) { // Only first 15 to keep it manageable
    for (let d = 30; d >= 1; d--) {
      const date = new Date(2026, 3, d); // April 2026
      if (date.getDay() === 0 || date.getDay() === 6) continue; // Skip weekends

      const status = attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)];
      const checkIn = new Date(date);
      checkIn.setHours(9, Math.floor(Math.random() * 30), 0);
      const checkOut = new Date(date);
      checkOut.setHours(18, Math.floor(Math.random() * 60), 0);
      const hours = status === 'absent' ? 0 : status === 'half-day' ? 4.5 : 9 + Math.random() * 2;

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          date,
          checkIn: status !== 'absent' ? checkIn : null,
          checkOut: status !== 'absent' ? checkOut : null,
          hours,
          overtime: Math.max(0, hours - 9),
          status,
          isAnomaly: Math.random() < 0.05,
        },
      });
      attendanceCount++;
    }
  }

  console.log(`✅ Created ${attendanceCount} attendance records`);

  // ─── Create Leave Requests ───
  const leaveData = [
    { employeeId: employees[0].id, type: 'casual', days: 2, reason: 'Family function', approver: 'Amit Kumar', status: 'approved' },
    { employeeId: employees[1].id, type: 'sick', days: 1, reason: 'Not feeling well', approver: 'Amit Kumar', status: 'approved' },
    { employeeId: employees[3].id, type: 'earned', days: 5, reason: 'Vacation trip', approver: 'Amit Kumar', status: 'pending' },
    { employeeId: employees[5].id, type: 'casual', days: 1, reason: 'Personal work', approver: 'Amit Kumar', status: 'approved' },
    { employeeId: employees[7].id, type: 'sick', days: 3, reason: 'Medical appointment', approver: 'Amit Kumar', status: 'pending' },
    { employeeId: employees[9].id, type: 'comp-off', days: 1, reason: 'Weekend work compensation', approver: 'Amit Kumar', status: 'approved' },
    { employeeId: employees[11].id, type: 'casual', days: 2, reason: 'Festival', approver: 'Amit Kumar', status: 'rejected' },
    { employeeId: employees[13].id, type: 'earned', days: 4, reason: 'Home town visit', approver: 'Amit Kumar', status: 'pending' },
  ];

  for (const leave of leaveData) {
    const startDate = new Date(2026, 3, Math.floor(Math.random() * 20) + 1);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + leave.days - 1);

    await prisma.leaveRequest.create({
      data: {
        employeeId: leave.employeeId,
        type: leave.type,
        startDate,
        endDate,
        days: leave.days,
        status: leave.status,
        reason: leave.reason,
        approver: leave.approver,
      },
    });
  }

  console.log(`✅ Created ${leaveData.length} leave requests`);

  // ─── Create Deliveries ───
  for (const project of projects.slice(0, 6)) {
    const deliverables = ['Website Homepage', 'Mobile App UI', 'API Integration', 'Admin Dashboard'];
    const delStatuses = ['delivered', 'client-review', 'in-progress', 'pending'];

    for (let i = 0; i < 3; i++) {
      await prisma.delivery.create({
        data: {
          projectId: project.id,
          deliverable: deliverables[i],
          status: delStatuses[i],
          dueDate: new Date(2026, Math.floor(Math.random() * 4) + 4, Math.floor(Math.random() * 28) + 1),
          clientApproval: delStatuses[i] === 'delivered',
          revisionRounds: Math.floor(Math.random() * 3),
          assignedTo: `${employees[Math.floor(Math.random() * employees.length)].firstName} ${employees[Math.floor(Math.random() * employees.length)].lastName}`,
        },
      });
    }
  }

  console.log('✅ Created delivery items');

  // ─── Create Approvals ───
  const approvalData = [
    { type: 'design', title: 'ShopVerse Homepage V2 Design', requestedBy: 'Priya Patel', status: 'pending', project: 'ShopVerse E-commerce Platform' },
    { type: 'invoice', title: 'INV-2026-005 Approval', requestedBy: 'Rajesh Verma', status: 'pending', project: 'FoodieApp Delivery Platform' },
    { type: 'budget', title: 'Additional Budget Request - NexaBank', requestedBy: 'Amit Kumar', status: 'escalated', project: 'NexaBank Mobile App' },
    { type: 'content', title: 'MediCare Blog Content Review', requestedBy: 'Neha Joshi', status: 'approved', project: 'MediCare Patient Portal' },
    { type: 'leave', title: 'Leave Approval - Sneha Reddy', requestedBy: 'Sneha Reddy', status: 'pending' },
    { type: 'proposal', title: 'TravelGo Phase 2 Proposal', requestedBy: 'Vikram Singh', status: 'pending', project: 'TravelGo Booking System' },
  ];

  for (const a of approvalData) {
    await prisma.approval.create({
      data: {
        type: a.type,
        title: a.title,
        requestedBy: a.requestedBy,
        status: a.status,
        project: a.project || null,
        version: Math.floor(Math.random() * 3) + 1,
      },
    });
  }

  console.log(`✅ Created ${approvalData.length} approvals`);

  // ─── Create Workload Entries ───
  for (const emp of employees.slice(0, 15)) {
    const allocation = 40 + Math.random() * 80;
    const status = allocation > 90 ? 'overloaded' : allocation > 75 ? 'at-capacity' : allocation < 50 ? 'under-utilized' : 'optimal';
    const projectNames = projects.slice(0, Math.floor(Math.random() * 4) + 1).map(p => p.name);

    await prisma.workloadEntry.create({
      data: {
        employeeId: emp.id,
        allocation,
        capacity: 100,
        projects: JSON.stringify(projectNames),
        overtime: Math.max(0, allocation - 80) * 0.5,
        status,
      },
    });
  }

  console.log('✅ Created workload entries');

  console.log('\n🎉 Seeding complete! Nueera Digital Pvt. Ltd. is ready for ERP operations.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
