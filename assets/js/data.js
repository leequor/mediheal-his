// Core mock data. Every page reads from here so names, IDs and dates stay consistent.
window.HIS = {
  today: new Date(2026, 7, 31), // Monday, August 31, 2026
  user: { name: 'Dr. Elsie Chen', role: 'Chief Physician', first: 'Elsie' },
  contact: { email: 'MediHeal@gmail.com.ph', phone: '+63 96759 8532' },
  // Figma Dashboard 211:59
  stats: [
    { label: 'Total Patients', value: '12,480', delta: '+ 6.2%  vs. last month', icon: 'users' },
    { label: 'Inpatients Admitted', value: '133', delta: '+ 3.1% currently admitted', icon: 'bed' },
    { label: 'Outpatient Visits', value: '1,046', delta: '+ 9.4%  this week', icon: 'walk' },
    { label: "Today's Appointments", value: '87', delta: '-2.7% schedule today', icon: 'calendar-check' }
  ],
  registrations: [
    { name: 'Isabel Geliz V. Ramos', id: 'PT-99213', age: 54, type: 'Inpatient', dept: 'Cardiology', doctor: 'Dr. Laurice Laureta', time: '9:42 AM', status: 'Admitted' },
    { name: 'Rilaneh Marie L. Acabal', id: 'PT-99212', age: 37, type: 'Outpatient', dept: 'Orthopedics', doctor: 'Dr. Marc Laureta', time: '9:28 AM', status: 'Waiting' },
    { name: 'Tobias Reyes', id: 'PT-99210', age: 88, type: 'Outpatient', dept: 'General Medicine', doctor: 'Dr. Yumie Pasiol', time: '8:50 AM', status: 'In Consultation' },
    { name: 'Eleanor Whitfield', id: 'PT-99211', age: 29, type: 'Inpatient', dept: 'Neurology', doctor: 'Dr. Jeremias Esperanza', time: '8:31 AM', status: 'Admitted' },
    { name: 'Hana Kobayashi', id: 'PT-99209', age: 40, type: 'Outpatient', dept: 'Pediatrics', doctor: 'Dr. Paolo Tipay', time: '8:12 AM', status: 'Completed' }
  ],
  schedule: [
    { time: '10:00 AM', name: 'Isabel Geliz V. Ramos', what: 'Follow-up \u00b7 Cardiology', doctor: 'Dr. Laurice Laureta', status: 'Confirmed' },
    { time: '10:30 AM', name: 'Rilaneh Marie L. Acabal', what: 'Consultation \u00b7 Orthopedics', doctor: 'Dr. Marc Laureta', status: 'Confirmed' },
    { time: '11:15 AM', name: 'Tobias Reyes', what: 'New Patient \u00b7 General Medicine', doctor: 'Dr. Yumie Pasiol', status: 'In Progress' },
    { time: '12:00 PM', name: 'Eleanor Whitfield', what: 'Scan Review \u00b7 Neurology', doctor: 'Dr. Jeremias Esperanza', status: 'Pending' }
  ],
  // badge color class for each status
  statusClass: { Inpatient: 'in', Outpatient: 'ok', Admitted: 'ok', Waiting: 'ok', 'In Consultation': 'in', Critical: 'red', Completed: 'off', Discharged: 'off', Confirmed: 'ok', 'In Progress': 'in', Pending: 'off' }
};
HIS.fmtShort = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
