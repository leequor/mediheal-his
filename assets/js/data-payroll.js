// Payroll data (Figma Payroll 623:702, read session 10). Net pay = basic + allowances - deductions.
HIS.payroll = {
  period: 'Aug 16\u201331, 2026', payDate: 'Aug 31, 2026', method: 'Bank transfer',
  depts: ['Administration', 'Cardiology', 'Orthopedics', 'General Medicine', 'Nursing', 'Laboratory', 'Pharmacy'],
  statuses: ['Paid', 'Processing', 'Pending'],
  emps: [
    { id: 'EMP-001', name: 'Dr. Elsie Chen', role: 'Chief Physician', dept: 'Administration', days: 11, hours: 92, basic: 60000, allow: 8000, ded: 8800, status: 'Paid', tax: 5200, sss: 1350, phil: 1500, pag: 750 },
    { id: 'EMP-002', name: 'Dr. Laurice Laureta', role: 'Consultant', dept: 'Cardiology', days: 10, hours: 80, basic: 55000, allow: 6500, ded: 7400, status: 'Paid' },
    { id: 'EMP-003', name: 'Dr. Marc Laureta', role: 'Consultant', dept: 'Orthopedics', days: 11, hours: 88, basic: 50000, allow: 6000, ded: 6800, status: 'Paid' },
    { id: 'EMP-004', name: 'Dr. Yumie Pasiol', role: 'Resident Physician', dept: 'General Medicine', days: 11, hours: 96, basic: 42000, allow: 4500, ded: 5200, status: 'Paid' },
    { id: 'EMP-005', name: 'Andrea Santos', role: 'Head Nurse', dept: 'Nursing', days: 12, hours: 96, basic: 35000, allow: 4000, ded: 3900, status: 'Processing' },
    { id: 'EMP-006', name: 'Miguel Reyes', role: 'Medical Technologist', dept: 'Laboratory', days: 10, hours: 80, basic: 32000, allow: 3500, ded: 3500, status: 'Processing' },
    { id: 'EMP-007', name: 'Sofia Mendoza', role: 'Pharmacist', dept: 'Pharmacy', days: 11, hours: 88, basic: 28000, allow: 3000, ded: 3000, status: 'Pending' },
    { id: 'EMP-008', name: 'Daniel Cruz', role: 'Administrative Officer', dept: 'Administration', days: 9, hours: 72, basic: 26000, allow: 2500, ded: 2800, status: 'Pending' }
  ]
};
