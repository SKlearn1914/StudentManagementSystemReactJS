import { Student, Subject } from '../types/sms';

export function generateStudentPDF(student: Student, subjects: Subject[]) {
  // Create a printable HTML document
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate PDF');
    return;
  }

  const getSubject = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId);
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'F';
  };

  const totalMarks = student.subjects.reduce((sum, s) => sum + s.marks, 0);
  const average = student.subjects.length > 0 ? totalMarks / student.subjects.length : 0;
  const gpa = (average / 10).toFixed(2);
  const totalCredits = student.subjects.reduce((sum, s) => {
    const subject = getSubject(s.subjectId);
    return sum + (subject?.credits || 0);
  }, 0);
  const status = student.subjects.every(s => s.marks >= 40) ? 'PASSED' : 'FAILED';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Student Report Card - ${student.rollNumber}</title>
      <style>
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          padding: 20px;
          background: white;
          color: #1a1a1a;
        }
        
        .header {
          background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 32px;
          margin-bottom: 8px;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2563eb;
          border-bottom: 2px solid #2563eb;
          padding-bottom: 8px;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        
        .info-item {
          display: flex;
          padding: 8px 0;
        }
        
        .info-label {
          font-weight: bold;
          min-width: 140px;
          color: #4b5563;
        }
        
        .info-value {
          color: #1a1a1a;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        
        th {
          background: #f3f4f6;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }
        
        td {
          padding: 12px;
          border: 1px solid #e5e7eb;
        }
        
        tr:nth-child(even) {
          background: #f9fafb;
        }
        
        .grade {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
        }
        
        .grade-a { background: #dcfce7; color: #166534; }
        .grade-b { background: #dbeafe; color: #1e40af; }
        .grade-c { background: #fef3c7; color: #92400e; }
        .grade-f { background: #fee2e2; color: #991b1b; }
        
        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-weight: bold;
        }
        
        .status-pass { background: #dcfce7; color: #166534; }
        .status-fail { background: #fee2e2; color: #991b1b; }
        
        .summary {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          margin-top: 20px;
        }
        
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 15px;
        }
        
        .summary-item {
          text-align: center;
        }
        
        .summary-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        
        .summary-value {
          font-size: 24px;
          font-weight: bold;
          color: #2563eb;
        }
        
        .final-status {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          margin-top: 15px;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
        
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #2563eb;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .print-button:hover {
          background: #1d4ed8;
        }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">Print / Save as PDF</button>
      
      <div class="header">
        <h1>Student Report Card</h1>
        <p>Academic Performance Report</p>
      </div>
      
      <div class="section">
        <div class="section-title">Student Information</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">${student.name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Roll Number:</span>
            <span class="info-value">${student.rollNumber}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">${student.email}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Department:</span>
            <span class="info-value">${student.department}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Semester:</span>
            <span class="info-value">${student.semester}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Year:</span>
            <span class="info-value">${student.year}</span>
          </div>
          ${student.phoneNumber ? `
          <div class="info-item">
            <span class="info-label">Phone:</span>
            <span class="info-value">${student.phoneNumber}</span>
          </div>
          ` : ''}
          ${student.dateOfBirth ? `
          <div class="info-item">
            <span class="info-label">Date of Birth:</span>
            <span class="info-value">${new Date(student.dateOfBirth).toLocaleDateString()}</span>
          </div>
          ` : ''}
        </div>
        ${student.address ? `
        <div class="info-item">
          <span class="info-label">Address:</span>
          <span class="info-value">${student.address}</span>
        </div>
        ` : ''}
      </div>
      
      ${student.guardianName || student.guardianPhone ? `
      <div class="section">
        <div class="section-title">Guardian Information</div>
        <div class="info-grid">
          ${student.guardianName ? `
          <div class="info-item">
            <span class="info-label">Guardian Name:</span>
            <span class="info-value">${student.guardianName}</span>
          </div>
          ` : ''}
          ${student.guardianPhone ? `
          <div class="info-item">
            <span class="info-label">Guardian Phone:</span>
            <span class="info-value">${student.guardianPhone}</span>
          </div>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Academic Performance</div>
        <table>
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th style="text-align: center;">Credits</th>
              <th style="text-align: center;">Marks</th>
              <th style="text-align: center;">Grade</th>
              <th style="text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${student.subjects.map(studentSubject => {
              const subject = getSubject(studentSubject.subjectId);
              const grade = calculateGrade(studentSubject.marks);
              const isPassed = studentSubject.marks >= 40;
              const gradeClass = grade.includes('A') ? 'grade-a' : 
                                 grade.includes('B') ? 'grade-b' : 
                                 grade.includes('C') ? 'grade-c' : 'grade-f';
              
              return `
                <tr>
                  <td>${subject?.code || 'N/A'}</td>
                  <td>${subject?.name || 'Unknown Subject'}</td>
                  <td style="text-align: center;">${subject?.credits || 0}</td>
                  <td style="text-align: center;">${studentSubject.marks}</td>
                  <td style="text-align: center;">
                    <span class="grade ${gradeClass}">${grade}</span>
                  </td>
                  <td style="text-align: center;">
                    <span class="status ${isPassed ? 'status-pass' : 'status-fail'}">
                      ${isPassed ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="summary">
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-label">Total Credits</div>
            <div class="summary-value">${totalCredits}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">Average Marks</div>
            <div class="summary-value">${average.toFixed(2)}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">GPA</div>
            <div class="summary-value">${gpa}</div>
          </div>
        </div>
        <div class="final-status" style="color: ${status === 'PASSED' ? '#166534' : '#991b1b'};">
          Overall Status: ${status}
        </div>
      </div>
      
      <div class="footer">
        <p>Generated on: ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>Student Management System</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  
  // Auto-focus the print window
  printWindow.focus();
  
  // Trigger print dialog after a short delay to ensure content is loaded
  setTimeout(() => {
    printWindow.print();
  }, 250);
}
