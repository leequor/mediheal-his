// Patient profile content from Figma: Geliz 459:680, Marie 488:1955, Tobias 488:2105, Eleanor 488:2255, Hana 488:2405. Extends window.HIS.
// Geliz values were read from the node text (get_nodes_info). Marie, Tobias, Eleanor and Hana values were read from Figma EXPORT IMAGES (session 6, scale 0.75), not from node text: re-check spelling if exact text matters.
// Tag colours: 'o' orange (#fdeee0/#b6641b), 'g' green (#e6f6ec/#1a8a4a), 'g2' bright green (#d8ffd3/#084d02, ESTIMATED from the export, used for Marie's Outpatient tag).
// Values are copied as Figma shows them, including its inconsistencies (date formats, Tobias 68 yrs here vs 88 in the Registration list).
HIS.profiles = {
  'PT-99213': {
    frame: '459:680', name: 'Isabel Geliz V. Ramos', ini: 'IR', meta: 'PT-99213 \u00b7 54 yrs \u00b7 Inpatient',
    tags: [['Inpatient', 'o'], ['Admitted', 'g']],
    personal: [['Full Name', 'Isabel Geliz V. Ramos'], ['Date of Birth', '1972-02-11'], ['Gender', 'Female'], ['Civil Status', 'Married'], ['Blood Type', 'A+']],
    contact: [['Phone', '+63 917 555 0134'], ['Email', 'isabel.ramos@gmail.com'], ['Address', '342 Sampaguita St., Brgy. San Isidro, Quezon City, Metro Manila, 1100']],
    emergency: [['Name', 'Marco Ramos'], ['Relationship', 'Spouse'], ['Contact Number', '+63 917 555 0135']],
    health: [['Existing Conditions', 'Type 2 diabetes, hypertension'], ['Reason for Registration', 'Chest tightness and shortness of breath during exertion'], ['Additional Notes', 'Referred by primary care physician for cardiac evaluation']],
    registration: [['Registered By', 'Nurse Aiko Tanaka'], ['Registered At', 'Sep 13, 2026 \u00b7 09:42 AM'], ['Patient Type', 'Inpatient']],
    admission: [['Department', 'Cardiology'], ['Assigned Doctor', 'Dr. Laurice Laureta'], ['Ward', 'Cardiology Ward'], ['Bed Number', 'C-08'], ['Admission Date', 'Sep 13, 2026'], ['Condition', 'Under Observation']],
    // Treatment History card (Figma 2047:24685) exists only on the Geliz frame.
    treatment: [
      ['Aug 31, 2026 \u00b7 Diagnosis: Acute coronary syndrome (I24.9)', 'Recorded \u00b7 Dr. Laurice Laureta'],
      ['Aug 31, 2026 \u00b7 Atorvastatin 40 mg tablet', 'Prescribed \u00b7 Dr. Laurice Laureta'],
      ['Aug 31, 2026 \u00b7 ECG and troponin tests', 'Results ready \u00b7 Cardiology Lab'],
      ['Aug 31, 2026 \u00b7 Cardiac monitoring (Ward 3, Bed 12)', 'In progress \u00b7 Dr. Laurice Laureta'],
      ['Aug 31, 2026 \u00b7 Nursing care: vitals every 4 hours', 'Ongoing \u00b7 Ward nursing team'],
      ['Sep 2, 2026 \u00b7 Coronary angiography', 'Scheduled \u00b7 Dr. Laurice Laureta']
    ]
  },
  'PT-99212': {
    frame: '488:1955', name: 'Rilaneh Marie L. Acabal', ini: 'RA', meta: 'PT-99212 \u00b7 37 yrs \u00b7 Outpatient',
    tags: [['Outpatient', 'g2'], ['Waiting', 'g']],
    personal: [['Full Name', 'Rilaneh Marie L. Acabal'], ['Date of Birth', 'Jun 23, 1989'], ['Gender', 'Female'], ['Civil Status', 'Single'], ['Blood Type', 'B+']],
    contact: [['Phone', '+63 918 555 0156'], ['Email', 'rilaneh.acabal@gmail.com'], ['Address', '87 Ilang-Ilang St., Brgy. Kristong Hari, Quezon City, Metro Manila, 1112']],
    emergency: [['Name', 'Grace Acabal'], ['Relationship', 'Mother'], ['Contact Number', '+63 918 555 0157']],
    health: [['Existing Conditions', 'None known'], ['Reason for Registration', 'Persistent knee pain after a fall'], ['Additional Notes', 'Referred for orthopedic assessment']],
    registration: [['Registered By', 'Dr. Elsie Chen'], ['Registered At', 'Aug 31, 2026 \u00b7 09:28 AM'], ['Patient Type', 'Outpatient']],
    admission: [['Department', 'Orthopedics'], ['Assigned Doctor', 'Dr. Marc Laureta'], ['Ward', '\u2014'], ['Bed Number', '\u2014'], ['Admission Date', '\u2014'], ['Condition', 'Waiting']]
  },
  'PT-99210': {
    frame: '488:2105', name: 'Tobias Reyes', ini: 'TR', meta: 'PT-99210 \u00b7 68 yrs \u00b7 Outpatient',
    tags: [['Outpatient', 'o'], ['In Consultation', 'g']],
    personal: [['Full Name', 'Tobias Reyes'], ['Date of Birth', 'Jan 5, 1958'], ['Gender', 'Male'], ['Civil Status', 'Widowed'], ['Blood Type', 'O-']],
    contact: [['Phone', '+63 919 555 0178'], ['Email', 'tobias.reyes@gmail.com'], ['Address', '501 Narra St., Brgy. Holy Spirit, Quezon City, Metro Manila, 1127']],
    emergency: [['Name', 'Daniel Reyes'], ['Relationship', 'Son'], ['Contact Number', '+63 919 555 0179']],
    health: [['Existing Conditions', 'Mild arthritis, high cholesterol'], ['Reason for Registration', 'General checkup, fatigue'], ['Additional Notes', 'Routine follow-up requested']],
    registration: [['Registered By', 'Dr. Elsie Chen'], ['Registered At', 'Aug 31, 2026 \u00b7 08:50 AM'], ['Patient Type', 'Outpatient']],
    admission: [['Department', 'General Medicine'], ['Assigned Doctor', 'Dr. Yumie Pasiol'], ['Ward', '\u2014'], ['Bed Number', '\u2014'], ['Admission Date', '\u2014'], ['Condition', 'In Consultation']]
  },
  'PT-99211': {
    frame: '488:2255', name: 'Eleanor Whitfield', ini: 'EW', meta: 'PT-99211 \u00b7 29 yrs \u00b7 Inpatient',
    tags: [['Inpatient', 'o'], ['Admitted', 'g']],
    personal: [['Full Name', 'Eleanor Whitfield'], ['Date of Birth', 'Mar 14, 1997'], ['Gender', 'Female'], ['Civil Status', 'Single'], ['Blood Type', 'AB+']],
    contact: [['Phone', '+63 920 555 0190'], ['Email', 'eleanor.w29@gmail.com'], ['Address', '12 Fernwood Ave., Brgy. Batasan Hills, Quezon City, Metro Manila, 1126']],
    emergency: [['Name', 'Susan Whitfield'], ['Relationship', 'Mother'], ['Contact Number', '+63 920 555 0191']],
    health: [['Existing Conditions', 'Migraines'], ['Reason for Registration', 'Recurrent dizziness and numbness'], ['Additional Notes', 'Referred for neurological workup']],
    registration: [['Registered By', 'Dr. Elsie Chen'], ['Registered At', '\u2014'], ['Patient Type', 'Inpatient']],
    admission: [['Department', 'Neurology'], ['Assigned Doctor', 'Dr. Jeremias Esperanza'], ['Ward', 'Neuro Ward'], ['Bed Number', 'N-04'], ['Admission Date', 'Sep 12, 2026, 11:30 PM'], ['Condition', 'Under Observation']]
  },
  'PT-99209': {
    frame: '488:2405', name: 'Hana Kobayashi', ini: 'HK', meta: 'PT-99209 \u00b7 40 yrs \u00b7 Outpatient',
    tags: [['Outpatient', 'o'], ['Completed', 'g']],
    personal: [['Full Name', 'Hana Kobayashi'], ['Date of Birth', 'Sep 30, 1985'], ['Gender', 'Female'], ['Civil Status', 'Married'], ['Blood Type', 'A-']],
    contact: [['Phone', '+63 921 555 0122'], ['Email', 'hana.kobayashi@gmail.com'], ['Address', '76 Acacia St., Brgy. Commonwealth, Quezon City, Metro Manila, 1121']],
    emergency: [['Name', 'Kenji Kobayashi'], ['Relationship', 'Spouse'], ['Contact Number', '+63 921 555 0123']],
    health: [['Existing Conditions', 'Seasonal allergies'], ['Reason for Registration', 'Seasonal allergy follow-up'], ['Additional Notes', 'No complications reported']],
    registration: [['Registered By', 'Dr. Elsie Chen'], ['Registered At', 'Aug 31, 2026 \u00b7 02:12 PM'], ['Patient Type', 'Outpatient']],
    admission: [['Department', 'Pediatrics'], ['Assigned Doctor', 'Dr. Paolo Tipay'], ['Ward', '\u2014'], ['Bed Number', '\u2014'], ['Admission Date', '\u2014'], ['Condition', 'Completed']]
  }
};
