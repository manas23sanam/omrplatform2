const fs = require('fs');

const BATCH_LIST = ['Batch A1 - NEET 2026', 'Batch A2 - NEET 2026', 'Batch B1 - JEE 2026'];

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Ananya', 'Diya', 'Advika', 'Aadhya', 'Anvi', 'Anushka', 'Avni', 'Bhavya', 'Charu', 'Chhavi', 'Dhruv', 'Darsh', 'Devansh', 'Divyansh', 'Eshaan', 'Faisal', 'Gaurav', 'Gaurangi', 'Hari', 'Harsh'];
const lastNames = ['Sharma', 'Patel', 'Iyer', 'Malhotra', 'Nair', 'Mehta', 'Reddy', 'Joshi', 'Singh', 'Verma', 'Kumar', 'Gupta', 'Yadav', 'Rao', 'Desai'];

let studentIdCounter = 1;
const mockStudents = [];

for (const batch of BATCH_LIST) {
  for (let i = 0; i < 10; i++) {
    const id = `s-${studentIdCounter.toString().padStart(2, '0')}`;
    const name = `${firstNames[studentIdCounter - 1]} ${lastNames[studentIdCounter % lastNames.length]}`;
    const email = `${firstNames[studentIdCounter - 1].toLowerCase()}.${lastNames[studentIdCounter % lastNames.length].toLowerCase()}@abccoaching.edu`;
    const rollNumber = `ABC-2026-${1000 + studentIdCounter}`;
    
    // Some random varied mastery percentages
    const mP = 60 + Math.floor(Math.random() * 35);
    const mC = 60 + Math.floor(Math.random() * 35);
    const mB = 60 + Math.floor(Math.random() * 35);

    const isJEE = batch.includes('JEE');

    const student = `  {
    id: '${id}',
    name: '${name}',
    email: '${email}',
    rollNumber: '${rollNumber}',
    batch: '${batch}',
    grade: 'Class 11 (Advanced)',
    avatarUrl: 'https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random',
    overallRank: ${studentIdCounter},
    totalTests: 18,
    averageScore: ${150 + Math.floor(Math.random() * 100)},
    averageAccuracy: ${(60 + Math.random() * 30).toFixed(1)},
    xp: 0,
    streak: 0,
    subjectMastery: [
      { subject: 'Physics', masteryPercentage: ${mP}, color: '#4f46e5', bgLight: '#eef2ff', weakTopicsCount: ${Math.floor(Math.random()*4)}, totalQuestionsAttempted: 300, accuracy: ${mP} },
      { subject: 'Chemistry', masteryPercentage: ${mC}, color: '#4f46e5', bgLight: '#eef2ff', weakTopicsCount: ${Math.floor(Math.random()*4)}, totalQuestionsAttempted: 300, accuracy: ${mC} },
      { subject: '${isJEE ? 'Mathematics' : 'Biology'}', masteryPercentage: ${mB}, color: '#4f46e5', bgLight: '#eef2ff', weakTopicsCount: ${Math.floor(Math.random()*4)}, totalQuestionsAttempted: 300, accuracy: ${mB} },
    ],
    scoreHistory: [],
    mistakes: [],
    badges: [],
  },`;
    mockStudents.push(student);
    studentIdCounter++;
  }
}

const fileContent = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Replace BATCH_LIST
let newContent = fileContent.replace(/export const BATCH_LIST: string\[\] = \[.*?\];/s, `export const BATCH_LIST: string[] = [\n  'Batch A1 - NEET 2026',\n  'Batch A2 - NEET 2026',\n  'Batch B1 - JEE 2026',\n];`);

// Replace MOCK_STUDENTS
newContent = newContent.replace(/export const MOCK_STUDENTS: StudentRecord\[\] = \[.*?\];/s, `export const MOCK_STUDENTS: StudentRecord[] = [\n${mockStudents.join('\n')}\n];`);

// Replace Brothers Academy references to ABC Coaching just in case
newContent = newContent.replace(/Brothers Academy/g, 'ABC Coaching');

fs.writeFileSync('src/data/mockData.ts', newContent);
console.log('mockData updated!');
