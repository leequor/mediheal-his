// Doctor Consultation data (Figma 2030:3609, "Doctor Consultation • Module 2"). Queue rows and the PT-99213 record are read from Figma; the other 7 records are DERIVED (not drawn in Figma).
window.HIS = window.HIS || {};
HIS.consult = {
  depts: ['Cardiology', 'Orthopedics', 'General Medicine', 'Neurology', 'Gastroenterology', 'Dermatology'],
  outcomes: ['Prescribe medication', 'Order tests', 'Refer to specialist', 'Admit for observation'],
  doctors: { 'Cardiology': 'Dr. Laurice Laureta', 'Orthopedics': 'Dr. Marc Laureta', 'General Medicine': 'Dr. Yumie Pasiol', 'Neurology': 'Dr. Jeremias Esperanza' },
  pts: [
    { id: 'PT-99208', name: 'Ana Villanueva', ini: 'AV', rl: 'Follow-up \u00b7 Hypertension', cc: 'Follow-up for hypertension', dept: 'Cardiology' },
    { id: 'PT-99213', name: 'Isabel Geliz V. Ramos', ini: 'IR', rl: 'Chest pain \u00b7 Cardiology', cc: 'Chest pain', dept: 'Cardiology', sex: 'Female', age: '54', kind: 'Inpatient',
      rec: {
        s1: [['Chief complaint', 'Chest pain and tightness for 2 days'], ['Onset', 'Aug 29, 2026 \u00b7 on exertion'], ['Severity', '6 of 10 \u00b7 intermittent'], ['Associated symptoms', 'Shortness of breath, sweating'], ['Medical history', 'Hypertension, type 2 diabetes'], ['Current medication', 'Amlodipine 5 mg, Metformin 500 mg'], ['Family history', 'Father: coronary artery disease'], ['Last visit', 'Aug 12, 2026 \u00b7 Cardiology']],
        s2: [['Allergies', 'Penicillin \u00b7 skin rash'], ['Allergy severity', 'Moderate'], ['Blood pressure', '150/95 mmHg'], ['Heart rate', '92 bpm'], ['Temperature', '36.8 \u00b0C'], ['SpO\u2082 \u00b7 Weight', '97% \u00b7 68 kg']],
        s3: [['Attending doctor', 'Dr. Laurice Laureta'], ['Department', 'Cardiology'], ['Visit type', 'Inpatient consultation'], ['Next step', 'Record diagnosis']],
        upd: 'Updated Aug 31, 2026 \u00b7 Dr. Laurice Laureta'
      } },
    { id: 'PT-99212', name: 'Rilaneh Marie L. Acabal', ini: 'RMA', rl: 'Knee pain \u00b7 Orthopedics', cc: 'Knee pain', dept: 'Orthopedics' },
    { id: 'PT-99215', name: 'Maria Santos', ini: 'MS', rl: 'Fever \u00b7 General Medicine', cc: 'Fever', dept: 'General Medicine' },
    { id: 'PT-99210', name: 'Tobias Reyes', ini: 'TR', rl: 'Cough \u00b7 General Medicine', cc: 'Cough', dept: 'General Medicine' },
    { id: 'PT-99211', name: 'Eleanor Whitfield', ini: 'EW', rl: 'Headache \u00b7 Neurology', cc: 'Headache', dept: 'Neurology' },
    { id: 'PT-99218', name: 'Luis Garcia', ini: 'LG', rl: 'Abdominal pain \u00b7 Gastroenterology', cc: 'Abdominal pain', dept: 'Gastroenterology' },
    { id: 'PT-99209', name: 'Hana Kobayashi', ini: 'HK', rl: 'Skin rash \u00b7 Pediatrics', cc: 'Skin rash', dept: 'Pediatrics' }
  ]
};
