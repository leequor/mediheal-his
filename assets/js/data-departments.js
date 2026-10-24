// Departments data (Figma 351:501 list, detail frames 351:733, 4001:5402, 4001:5513, 4001:5764, 4030:8995, 4030:9129, 4030:9263, 4030:9397).
// Read from Figma with scan_text_nodes in session 7. `tags` = list-card tags, `dtags` = tags on the detail frame (they differ for General Medicine order and Nursing's 5th tag).
// node = list card id, dnode = detail frame id. Figma detail title for Orthopaedics reads "Orthopedics" (dname) while the list says "Orthopaedics".
window.HIS = window.HIS || {};
HIS.departments = (function () {
  const P = '\u20b1';
  const mk = (o) => o;
  return [
    mk({ slug: 'cardiology', name: 'Cardiology', dname: 'Cardiology', node: '351:565', dnode: '351:733', head: 'Dr. Laurice Laureta', role: 'Head doctor', rev: P + '1.42M', doctors: 4, nurses: 12, opd: 42, occ: 34, beds: 40, pct: 85,
      tags: ['ECG', 'Echocardiogram', 'Cardiac catheterization', 'Holter monitoring', 'Stress test'], duty: 'Doctors on duty', add: 'Add doctor',
      rows: [['LL', 'Dr. Laurice Laureta', 'Head doctor \u00b7 Cardiology \u00b7 Senior consultant, ' + P + '1,500/consult'], ['CS', 'Dr. Carmela Santos', 'Interventional cardiologist \u00b7 Cardiology \u00b7 Consultant, ' + P + '1,500/consult'], ['PR', 'Dr. Paolo Reyes', 'Cardiologist \u00b7 Cardiology \u00b7 Consultant, ' + P + '1,500/consult'], ['LM', 'Dr. Lea Mendoza', 'Cardiology fellow \u00b7 Cardiology \u00b7 Resident, ' + P + '1,200/consult']] }),
    mk({ slug: 'neurology', name: 'Neurology', dname: 'Neurology', node: '351:607', dnode: '4001:5402', head: 'Dr. Jeremias Esperanza', role: 'Head doctor', rev: P + '980K', doctors: 3, nurses: 9, opd: 28, occ: 21, beds: 24, pct: 88,
      tags: ['MRI brain', 'EEG', 'Nerve conduction study', 'Lumbar puncture', 'EMG'], duty: 'Doctors on duty', add: 'Add doctor',
      rows: [['JE', 'Dr. Jeremias Esperanza', 'Head doctor \u00b7 Neurology \u00b7 Senior consultant, ' + P + '1,600/consult'], ['AM', 'Dr. Arvin Mendoza', 'Consultant \u00b7 Neurology \u00b7 Stroke and epilepsy, ' + P + '1,500/consult'], ['NB', 'Dr. Nina Bautista', 'Fellow \u00b7 Neurology \u00b7 Neurophysiology, ' + P + '1,200/consult']] }),
    mk({ slug: 'orthopaedics', name: 'Orthopaedics', dname: 'Orthopedics', node: '351:649', dnode: '4001:5513', head: 'Dr. Marc Laureta', role: 'Head doctor', rev: P + '1.16M', doctors: 3, nurses: 8, opd: 35, occ: 22, beds: 30, pct: 73,
      tags: ['Joint replacement', 'Fracture care', 'Arthroscopy', 'Physiotherapy', 'Spine surgery'], duty: 'Doctors on duty', add: 'Add doctor',
      rows: [['ML', 'Dr. Marc Laureta', 'Head doctor \u00b7 Orthopaedics \u00b7 Senior consultant, ' + P + '1,700/consult'], ['JD', 'Dr. Jose Dizon', 'Consultant \u00b7 Orthopaedics \u00b7 Joint replacement, ' + P + '1,500/consult'], ['RV', 'Dr. Rina Villanueva', 'Fellow \u00b7 Orthopaedics \u00b7 Sports medicine, ' + P + '1,200/consult']] }),
    mk({ slug: 'ob-gyn', name: 'OB-GYN', dname: 'OB-GYN', node: '351:691', dnode: '4001:5764', head: 'Dr. Maria Lopez', role: 'Head doctor', rev: P + '840K', doctors: 4, nurses: 14, opd: 51, occ: 28, beds: 36, pct: 78,
      tags: ['Prenatal care', 'Ultrasound', 'Laparoscopy', 'C-section', 'Fertility treatment'], duty: 'Doctors on duty', add: 'Add doctor',
      rows: [['ML', 'Dr. Maria Lopez', 'Head doctor \u00b7 OB-GYN \u00b7 Senior consultant, ' + P + '1,600/consult'], ['CR', 'Dr. Carla Reyes', 'Consultant \u00b7 OB-GYN \u00b7 Obstetrics, ' + P + '1,500/consult'], ['AC', 'Dr. Anna Cruz', 'Consultant \u00b7 OB-GYN \u00b7 Fertility specialist, ' + P + '1,400/consult'], ['EG', 'Dr. Elena Garcia', 'Fellow \u00b7 OB-GYN \u00b7 Minimally invasive surgery, ' + P + '1,200/consult']] }),
    mk({ slug: 'general-medicine', name: 'General Medicine', dname: 'General Medicine', node: '4028:8827', dnode: '4030:8995', head: 'Dr. Yumie Pasiol', role: 'Head doctor', rev: P + '720K', doctors: 4, nurses: 10, opd: 46, occ: 20, beds: 30, pct: 67,
      tags: ['Internal medicine', 'Health exams', 'Check-ups', 'Vaccination', 'Referrals'], dtags: ['Health exams', 'Check-ups', 'Vaccination', 'Referrals', 'Internal medicine'], duty: 'Doctors on duty', add: 'Add doctor',
      rows: [['YP', 'Dr. Yumie Pasiol', 'Head doctor \u00b7 General Medicine \u00b7 Senior consultant, ' + P + '1,600/consult'], ['PR', 'Dr. Paolo Ramirez', 'Consultant \u00b7 General Medicine \u00b7 Internal medicine, ' + P + '1,400/consult'], ['LT', 'Dr. Lena Torres', 'Consultant \u00b7 General Medicine \u00b7 Preventive care, ' + P + '1,300/consult'], ['RN', 'Dr. Rico Navarro', 'Fellow \u00b7 General Medicine \u00b7 Primary care, ' + P + '1,200/consult']] }),
    mk({ slug: 'nursing', name: 'Nursing', dname: 'Nursing', node: '4028:8869', dnode: '4030:9129', head: 'Andrea Santos, RN', role: 'Head nurse', rev: P + '310K', doctors: 0, nurses: 6, opd: 18, occ: 8, beds: 12, pct: 67,
      tags: ['Ward nursing', 'Wound care', 'IV therapy', 'Triage', 'Bedside care'], dtags: ['Ward nursing', 'Wound care', 'IV therapy', 'Triage', 'Patient education'], duty: 'Staff on duty', add: 'Add staff',
      rows: [['AS', 'Andrea Santos, RN', 'Head nurse \u00b7 Nursing \u00b7 Ward supervisor']] }),
    mk({ slug: 'laboratory', name: 'Laboratory', dname: 'Laboratory', node: '4028:8911', dnode: '4030:9263', head: 'Miguel Reyes, MedTech', role: 'Head medtech', rev: P + '540K', doctors: 1, nurses: 4, opd: 64, occ: 0, beds: 0, pct: 0,
      tags: ['Hematology', 'Chemistry', 'Urinalysis', 'Microbiology', 'Blood bank'], duty: 'Staff on duty', add: 'Add staff',
      rows: [['MR', 'Miguel Reyes, MedTech', 'Head medtech \u00b7 Laboratory \u00b7 Chief laboratory scientist']] }),
    mk({ slug: 'pharmacy', name: 'Pharmacy', dname: 'Pharmacy', node: '4028:8953', dnode: '4030:9397', head: 'Sofia Mendoza, RPh', role: 'Head pharmacist', rev: P + '890K', doctors: 0, nurses: 2, opd: 72, occ: 0, beds: 0, pct: 0,
      tags: ['Dispensing', 'Inventory', 'Compounding', 'Drug info', 'IV admixture'], duty: 'Staff on duty', add: 'Add staff',
      rows: [['SM', 'Sofia Mendoza, RPh', 'Head pharmacist \u00b7 Pharmacy \u00b7 Chief pharmacist']] })
  ];
})();
