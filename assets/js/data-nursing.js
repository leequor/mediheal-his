// Nursing Care data (Figma 2047:20735, origin 0,59500). Only Isabel Geliz V. Ramos (PT-99213) has a drawn care record; the other 7 records are DERIVED in nursing.js (not in Figma).
// Patient rows (name, ward, bed, next due, id) are the Figma main frame. Note: the Figma state frames show "Maria Santos · PT-99215" where the main frame shows "Rosa Mendoza · PT-99220"; the main frame is used.
window.HIS = window.HIS || {};
HIS.nursing = {
  wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Intensive care', 'Isolation'],
  pts: [
    { id: 'PT-99208', name: 'Ana Villanueva', ini: 'AV', wk: 'Ward 1', ward: 'Ward 1', bed: 'Bed 04', next: '6:00 PM' },
    { id: 'PT-99213', name: 'Isabel Geliz V. Ramos', ini: 'IR', wk: 'Ward 3', ward: 'Ward 3', bed: 'Bed 12', next: '6:00 PM', sex: 'Female', age: '54',
      rec: {
        meds: [
          ['Aspirin 81 mg · 8:00 AM', 'Given · 8:05 AM · A. Santos, RN'],
          ['Amlodipine 5 mg · 8:00 AM', 'Given · 8:05 AM · A. Santos, RN'],
          ['Metformin 500 mg · 12:00 PM', 'Given · 12:10 PM · A. Santos, RN'],
          ['IV fluids · NS 500 mL', 'Running · 60 mL per hour'],
          ['Atorvastatin 40 mg · 6:00 PM', 'Due · 6:00 PM'],
          ['Metformin 500 mg · 6:00 PM', 'Due · 6:00 PM'],
          ['Oxygen 2 L/min · as needed', 'Not needed · SpO₂ 97%'],
          ['Missed or refused doses', 'None today']
        ],
        vit: [
          ['6:00 AM', 'BP 148/94 · HR 94 · 36.9 °C · SpO₂ 96%'],
          ['10:00 AM', 'BP 150/95 · HR 92 · 36.8 °C · SpO₂ 97%'],
          ['2:00 PM', 'BP 142/90 · HR 88 · 36.8 °C · SpO₂ 98%'],
          ['6:00 PM', 'Next vitals due'],
          ['Pain score', '2 of 10 · chest tightness settled'],
          ['Allergy alert', 'Penicillin · skin rash (moderate)']
        ],
        care: [
          ['Assigned nurse', 'Andrea Santos, RN'],
          ['Shift', 'Day · 7:00 AM to 7:00 PM'],
          ['Care setting', 'Inpatient · Ward 3, Bed 12'],
          ['Next step', 'Vitals due 6:00 PM, then evening medicines']
        ],
        upd: 'Updated Aug 31, 2026 · 2:15 PM · A. Santos, RN'
      } },
    { id: 'PT-99214', name: 'Jose Dela Cruz', ini: 'JD', wk: 'Ward 2', ward: 'Ward 2', bed: 'Bed 07', next: '4:00 PM' },
    { id: 'PT-99220', name: 'Rosa Mendoza', ini: 'RM', wk: 'Ward 1', ward: 'Ward 1', bed: 'Bed 09', next: '5:00 PM' },
    { id: 'PT-99216', name: 'Ramon Bautista', ini: 'RB', wk: 'Ward 1', ward: 'Ward 1', bed: 'Bed 11', next: '6:00 PM' },
    { id: 'PT-99211', name: 'Eleanor Whitfield', ini: 'EW', wk: 'Neuro Ward', ward: 'Neuro Ward', bed: 'Bed N-04', next: '7:00 PM' },
    { id: 'PT-99218', name: 'Luis Garcia', ini: 'LG', wk: 'Ward 2', ward: 'Ward 2', bed: 'Bed 10', next: '8:00 PM' },
    { id: 'PT-99219', name: 'Nina Flores', ini: 'NF', wk: 'Ward 4', ward: 'Ward 4', bed: 'Bed 02', next: '9:00 PM' }
  ]
};
