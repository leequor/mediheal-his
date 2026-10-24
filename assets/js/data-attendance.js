// Attendance data (Figma 2002:369, Aug 31, 2026). Rows: id, name, role, department, shift, time in, time out, status.
HIS.attendance = {
  date: 'Aug 31, 2026',
  period: 'Aug 16\u201331, 2026',
  synced: 'Aug 30, 2026 \u00b7 6:00 PM',
  depts: ['Administration', 'Cardiology', 'Orthopedics', 'General Medicine', 'Nursing', 'Laboratory', 'Pharmacy'],
  statuses: ['Present', 'Late', 'On leave', 'Absent'],
  timesIn: ['07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM'],
  timesOut: ['03:00 PM', '04:00 PM', '05:00 PM', '05:30 PM', '06:00 PM', '07:00 PM'],
  leaveTypes: ['Sick leave', 'Vacation leave', 'Emergency leave', 'Conference leave'],
  emps: [
    { id: 'EMP-001', name: 'Dr. Elsie Chen', role: 'Chief Physician', dept: 'Administration', shift: '8 AM \u2013 5 PM', tin: '07:52 AM', tout: '05:10 PM', status: 'Present' },
    { id: 'EMP-002', name: 'Dr. Laurice Laureta', role: 'Consultant', dept: 'Cardiology', shift: '8 AM \u2013 5 PM', tin: '07:58 AM', tout: '05:02 PM', status: 'Present' },
    { id: 'EMP-003', name: 'Dr. Marc Laureta', role: 'Consultant', dept: 'Orthopedics', shift: '8 AM \u2013 5 PM', tin: '07:49 AM', tout: '05:21 PM', status: 'Present' },
    { id: 'EMP-004', name: 'Dr. Yumie Pasiol', role: 'Resident Physician', dept: 'General Medicine', shift: '8 AM \u2013 5 PM', tin: '08:06 AM', tout: '05:00 PM', status: 'Present' },
    { id: 'EMP-005', name: 'Andrea Santos', role: 'Head Nurse', dept: 'Nursing', shift: '7 AM \u2013 3 PM', tin: '07:24 AM', tout: '03:08 PM', status: 'Late' },
    { id: 'EMP-006', name: 'Miguel Reyes', role: 'Medical Technologist', dept: 'Laboratory', shift: '8 AM \u2013 5 PM', tin: '08:37 AM', tout: '05:04 PM', status: 'Late' },
    { id: 'EMP-007', name: 'Sofia Mendoza', role: 'Pharmacist', dept: 'Pharmacy', shift: '9 AM \u2013 6 PM', tin: '', tout: '', status: 'On leave' },
    { id: 'EMP-008', name: 'Daniel Cruz', role: 'Administrative Officer', dept: 'Administration', shift: '8 AM \u2013 5 PM', tin: '', tout: '', status: 'Absent' }
  ],
  leaves: [
    { name: 'Sofia Mendoza', type: 'Sick leave', range: 'Aug 31, 2026', days: 1, status: 'Approved' },
    { name: 'Miguel Reyes', type: 'Vacation leave', range: 'Sep 2\u20134, 2026', days: 3, status: 'Pending' },
    { name: 'Andrea Santos', type: 'Vacation leave', range: 'Sep 9\u201310, 2026', days: 2, status: 'Pending' },
    { name: 'Dr. Marc Laureta', type: 'Conference leave', range: 'Sep 15\u201316, 2026', days: 2, status: 'Approved' },
    { name: 'Dr. Yumie Pasiol', type: 'Sick leave', range: 'Aug 24, 2026', days: 1, status: 'Approved' },
    { name: 'Daniel Cruz', type: 'Emergency leave', range: 'Aug 18, 2026', days: 1, status: 'Declined' }
  ]
};
