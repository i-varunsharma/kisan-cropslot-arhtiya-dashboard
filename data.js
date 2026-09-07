/* Kisan CropSlot — sample data
   All records below are illustrative demo data, not real farmer records. */

const RATES = { Wheat: 50.75, Paddy: 50.61 };   // ₹ per quintal, notified 2026-27

const SEASON = { quintal: 6743, farmers: 118 };  // season-to-date, for commission screen

const CHECKS = [
  { id:'token',    t:'Token matches farmer at gate',
    d:'Scanned at gate 2 — name and phone verified.', done:true },
  { id:'gross',    t:'Gross weight recorded',
    d:'Includes trolley. Recorded at weighbridge 1.', done:true, input:{ unit:'qtl', value:'64.8' } },
  { id:'moisture', t:'Moisture reading logged',
    d:'Entered from the meter and shared with the farmer. Permissible limit for wheat is 12%.',
    done:false, input:{ unit:'%', value:'' } },
  { id:'tare',     t:'Tare weight after unloading',
    d:'Net quantity is calculated automatically — no manual entry.',
    done:false, input:{ unit:'qtl', value:'' } }
];

const FARMERS = [
  { id:'f1', name:'Jaspreet Singh',      token:'MM-KH-242417', slot:'2:00–4:00 PM',
    crop:'Wheat', qty:62, status:'arrived', bookedVia:'SMS', gate:'2:14 PM',
    jform:null,      hours:2,  block:null },
  { id:'f2', name:'Baldev Kaur',         token:'MM-KH-242418', slot:'2:00–4:00 PM',
    crop:'Wheat', qty:41, status:'weighed', bookedVia:'IVR call', gate:'2:02 PM',
    jform:'JF-4483', hours:44, block:'Awaiting agency verification' },
  { id:'f3', name:'Harpal Singh Gill',   token:'MM-KH-242421', slot:'4:00–6:00 PM',
    crop:'Wheat', qty:78, status:'booked', bookedVia:'App', gate:null,
    jform:null,      hours:0,  block:null },
  { id:'f4', name:'Manjit Singh',        token:'MM-KH-242423', slot:'4:00–6:00 PM',
    crop:'Wheat', qty:35, status:'booked', bookedVia:'SMS', gate:null,
    jform:null,      hours:0,  block:null },
  { id:'f5', name:'Amrik Singh Sandhu',  token:'MM-KH-242455', slot:'8:00–10:00 AM',
    crop:'Wheat', qty:69, status:'weighed', bookedVia:'Assisted', gate:'8:20 AM',
    jform:'JF-4455', hours:61, block:'Bank account not Aadhaar-seeded' },
  { id:'f6', name:'Sukhwinder Kaur',     token:'MM-KH-242409', slot:'10:00–12:00 PM',
    crop:'Wheat', qty:54, status:'paid', bookedVia:'SMS', gate:'10:11 AM',
    jform:'JF-4471', hours:31, block:null },
  { id:'f7', name:'Rachhpal Singh',      token:'MM-KH-242404', slot:'8:00–10:00 AM',
    crop:'Wheat', qty:47, status:'paid', bookedVia:'Assisted', gate:'8:05 AM',
    jform:'JF-4468', hours:40, block:null }
];

const YARD = { inside:31, capacity:40 };
