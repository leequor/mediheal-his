// Records for Registration and Appointments. Extends window.HIS from data.js.
HIS.departments = ['Cardiology', 'Orthopedics', 'General Medicine', 'Neurology', 'Pediatrics'];
HIS.doctors = ['Dr. Laurice Laureta', 'Dr. Marc Laureta', 'Dr. Yumie Pasiol', 'Dr. Jeremias Esperanza', 'Dr. Paolo Tipay', 'Dr. Elsie Chen'];

// Figma Registration 23:2285. attention = counted in the "Needs Attention" KPI.
HIS.patients = [
  { name: 'Isabel Geliz V. Ramos', id: 'PT-99213', age: 54, type: 'Inpatient', dept: 'Cardiology', doctor: 'Dr. Laurice Laureta', registered: 'Aug 31, 2026 · 09:42 AM', status: 'Admitted', attention: true },
  { name: 'Rilaneh Marie L. Acabal', id: 'PT-99212', age: 37, type: 'Outpatient', dept: 'Orthopedics', doctor: 'Dr. Marc Laureta', registered: 'Aug 31, 2026 · 09:28 AM', status: 'Waiting', attention: true },
  { name: 'Tobias Reyes', id: 'PT-99210', age: 88, type: 'Outpatient', dept: 'General Medicine', doctor: 'Dr. Yumie Pasiol', registered: 'Aug 31, 2026 · 08:50 AM', status: 'In Consultation', attention: true },
  { name: 'Eleanor Whitfield', id: 'PT-99211', age: 29, type: 'Inpatient', dept: 'Neurology', doctor: 'Dr. Jeremias Esperanza', registered: 'Aug 30, 2026 · 11:30 PM', status: 'Admitted' },
  { name: 'Hana Kobayashi', id: 'PT-99209', age: 40, type: 'Outpatient', dept: 'Pediatrics', doctor: 'Dr. Paolo Tipay', registered: 'Aug 30, 2026 · 02:12 PM', status: 'Completed' }
];

// Figma Appointments 23:2289
HIS.appointments = [
  { patient: 'Isabel Geliz', when: 'Aug 31, 2026 • 09:30 AM', kind: 'Inpatient Admission', doctor: 'Dr. Laurice Laureta', status: 'Confirmed' },
  { patient: 'Tobias Reyes', when: 'Aug 31, 2026 • 10:15 AM', kind: 'General Check-Up', doctor: 'Dr. Marc Laureta', status: 'Completed' },
  { patient: 'Eleanor Whitfield', when: 'Aug 31, 2026 • 01:30 PM', kind: 'General Check-Up', doctor: 'Dr. Yumie Pasiol', status: 'Cancelled' },
  { patient: 'Hana Kobayashi', when: 'Aug 31, 2026 • 02:15 PM', kind: 'Lab/Test Result Review', doctor: 'Dr. Jeremias Esperanza', status: 'Confirmed' },
  { patient: 'Rilaneh M. Acabal', when: 'Aug 31, 2026 • 04:00 PM', kind: 'Vaccination/Immunization', doctor: 'Dr. Paolo Tipay', status: 'Pending' },
  { patient: 'Maria Santos', when: 'Aug 31, 2026 • 04:30 PM', kind: 'Medical Certificate Request', doctor: 'Dr. Elsie Chen', status: 'Confirmed' }
];
HIS.apptKinds = ['Inpatient Admission', 'General Check-Up', 'Lab/Test Result Review', 'Vaccination/Immunization', 'Medical Certificate Request', 'Follow-up'];
HIS.apptStatuses = ['Confirmed', 'Completed', 'Cancelled', 'Pending'];
HIS.apptTotals = { total: '1,284', confirmed: '856', pending: '263', cancelled: '165', walkin: '12' };
HIS.statusClass.Cancelled = 'red';
