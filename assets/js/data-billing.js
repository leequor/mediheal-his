// Billing data from Figma 351:847 (session 8). Only BL-8801 has line items in the main frame; the others come from the Recent Bills rows.
// `type` (Inpatient/Outpatient) is NOT in the main frame: ESTIMATED (8801 has room charges so Inpatient). Totals for the other bills are ESTIMATED (single summary row).
window.HIS = window.HIS || {};
HIS.billing = {
  stats: [['Total billed (Aug)', '\u20b1482K', ''], ['Collected', '\u20b1395K', 'g'], ['Outstanding', '\u20b187K', 'r'], ['Bills today', '12', '']],
  bills: [
    { id: 'BL-8801', name: 'Isabel Geliz Ramos', full: 'Isabel Geliz V. Ramos', pt: 'PT-99213', dept: 'Cardiology', date: 'Aug 29, 2026', status: 'Partial', amount: 17360, type: 'Inpatient',
      items: [['Consultation \u2014 Dr. L. Laureta \u00b7 from Consultation (M2)', 1, 1500, 1500], ['ECG \u00b7 from Lab / imaging order (M3)', 1, 600, 600], ['Echocardiogram \u00b7 from Lab / imaging order (M3)', 1, 3200, 3200], ['Room charges (3 days) \u00b7 from Ward / bed assignment (M3)', 3, 2800, 8400], ['Nursing charges \u00b7 from Nursing care (M3)', 3, 600, 1800]],
      subtotal: 15500, vat: 1860, paid: 10000 },
    { id: 'BL-8800', name: 'Maria Santos', full: 'Maria Santos', pt: 'PT-99215', dept: 'OB-GYN', date: 'Aug 29, 2026', status: 'Paid', amount: 4200, type: 'Outpatient' },
    { id: 'BL-8799', name: 'Rilaneh M. Acabal', full: 'Rilaneh Marie L. Acabal', pt: 'PT-99212', dept: 'Orthopedics', date: 'Aug 28, 2026', status: 'Paid', amount: 86500, type: 'Inpatient' },
    { id: 'BL-8798', name: 'Eleanor Whitfield', full: 'Eleanor Whitfield', pt: 'PT-99211', dept: 'Neurology', date: 'Aug 27, 2026', status: 'Pending', amount: 52800, type: 'Outpatient' }
  ]
};
