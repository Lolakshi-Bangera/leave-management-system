export function calculateDays(a,b){const s=new Date(a),e=new Date(b);s.setHours(0,0,0,0);e.setHours(0,0,0,0);return Math.floor((e-s)/86400000)+1;}
