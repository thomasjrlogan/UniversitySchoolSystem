
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Student, Course, Enrollment, StudentResultInfo, AppSettings } from '../types';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, MagnifyingGlassIcon, PrinterIcon, ArrowLeftIcon, UserCircleIcon, HashtagIcon, IdentificationIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface StudentResultsPageProps {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  appSettings: AppSettings;
}

export const StudentResultsPage: React.FC<StudentResultsPageProps> = ({ students, courses, enrollments, appSettings }) => {
  const [studentIdInput, setStudentIdInput] = useState('');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [studentResults, setStudentResults] = useState<StudentResultInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  const {
    appName = DEFAULT_APP_SETTINGS.appName,
    collegeAddress = DEFAULT_APP_SETTINGS.collegeAddress,
    collegePhone = DEFAULT_APP_SETTINGS.collegePhone,
    collegeLogo,
    resultsPageHeading = DEFAULT_APP_SETTINGS.resultsPageHeading,
    resultsPageSubText = DEFAULT_APP_SETTINGS.resultsPageSubText,
    resultsPageSearchPrompt = DEFAULT_APP_SETTINGS.resultsPageSearchPrompt,
  } = appSettings;


  const handleSearch = () => {
    setIsLoading(true);
    setError(null);
    setCurrentStudent(null);
    setStudentResults([]);

    if (!studentIdInput.trim()) {
      setError("Please enter a Student ID, System ID, or Email.");
      setIsLoading(false);
      return;
    }

    const searchTermLower = studentIdInput.trim().toLowerCase();
    const foundStudent = students.find(s => 
        s.id.toLowerCase() === searchTermLower || 
        s.email.toLowerCase() === searchTermLower ||
        (s.studentIdNumber && s.studentIdNumber.toLowerCase() === searchTermLower)
    );

    if (!foundStudent) {
      setError(`No student found with ID, Email, or Student ID Number: ${studentIdInput}. Please check and try again.`);
      setIsLoading(false);
      return;
    }

    setCurrentStudent(foundStudent);
    const studentEnrollments = enrollments.filter(e => e.studentId === foundStudent.id);

    if (studentEnrollments.length === 0) {
      setError(`${foundStudent.firstName} ${foundStudent.lastName} has no enrollment records.`);
      setIsLoading(false);
      return;
    }

    const results: StudentResultInfo[] = studentEnrollments.map(enrollment => {
      const course = courses.find(c => c.id === enrollment.courseId);
      return {
        courseCode: course?.code || 'N/A',
        courseTitle: course?.title || 'Unknown Course',
        credits: course?.credits || 0,
        grade: enrollment.grade || 'Not Graded',
        enrollmentDate: enrollment.enrollmentDate,
      };
    }).sort((a,b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime());

    setStudentResults(results);
    setIsLoading(false);
  };

  const handlePrint = () => {
    if (!currentStudent || !resultsRef.current) return;

    let printContents = resultsRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    
    const logoHtml = collegeLogo 
      ? `<img src="${collegeLogo}" alt="University Logo" style="height: 60px; margin-bottom: 10px; max-width: 150px; object-fit: contain;" />`
      : `<div style="height: 60px; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold;">${appName.substring(0,3)}</div>`;

    let studentInfoHtml = `
      <p style="margin: 2px 0;"><strong>Student Name:</strong> ${currentStudent.firstName} ${currentStudent.lastName}</p>
      <p style="margin: 2px 0;"><strong>System ID:</strong> ${currentStudent.id}</p>
    `;
    if (currentStudent.studentIdNumber) {
        studentInfoHtml += `<p style="margin: 2px 0;"><strong>Student ID:</strong> ${currentStudent.studentIdNumber}</p>`;
    }
    studentInfoHtml += `<p style="margin: 2px 0;"><strong>Email:</strong> ${currentStudent.email}</p>`;
    studentInfoHtml += `<p style="font-size: 10px; margin-top: 5px;">Date Generated: ${new Date().toLocaleDateString()}</p>`;

    const headerHtml = `
      <div style="text-align: center; margin-bottom: 20px; font-family: Arial, sans-serif;">
        ${logoHtml}
        <h1 style="font-size: 24px; margin: 0;">${appName}</h1>
        <p style="font-size: 12px; margin: 2px 0;">${collegeAddress}</p>
        <p style="font-size: 12px; margin: 2px 0;">Tel: ${collegePhone}</p>
        <h2 style="font-size: 20px; margin-top: 15px; margin-bottom: 5px;">Student Academic Transcript</h2>
      </div>
      <div style="font-family: Arial, sans-serif; font-size: 11pt; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ccc;">
        ${studentInfoHtml}
      </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = printContents;
    const studentInfoDivInResults = tempDiv.querySelector('.student-info-for-print-only'); 
    if (studentInfoDivInResults) {
        studentInfoDivInResults.remove();
        printContents = tempDiv.innerHTML;
    }


    document.body.innerHTML = `<div class="printable-area-container">${headerHtml}${printContents}</div>`;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); 
  };


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 print:bg-white">
      <style>{`
        @media print {
          body {
            font-family: Arial, sans-serif !important; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          @page {
            margin: 0.75in; 
            size: auto; 
          }
          body * {
            visibility: hidden;
          }
          .printable-area-container, .printable-area-container * {
            visibility: visible;
          }
          .printable-area-container { 
            position: absolute;
            left: 0;
            top: 0;
            width: 100%; 
            margin: 0; 
            padding: 0;
            font-size: 10pt;
            color: #000 !important; 
          }
          .no-print {
            display: none !important;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px; 
          }
          th, td {
            border: 1px solid #888; 
            padding: 5px 8px; 
            text-align: left;
            word-break: break-word; 
          }
          th {
            background-color: #e0e0e0 !important; 
            font-weight: bold;
          }
          h1, h2, h3, p, span, div { 
            color: #000 !important;
            margin: 0 0 5px 0; 
          }
          img { 
            max-width: 100%;
            height: auto;
          }
          .student-info-for-print-only { display: none !important; }
        }
      `}</style>

      <header className="text-center mb-10 no-print">
        {collegeLogo ? (
            <img src={collegeLogo} alt={`${appName} Logo`} className="h-20 w-auto object-contain mx-auto mb-2 rounded-md" />
        ) : (
            <AcademicCapIcon className="h-16 w-16 text-sky-600 mx-auto mb-2" />
        )}
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{appName}</h1>
        <p className="text-xl text-slate-600 mt-1">{resultsPageHeading}</p>
      </header>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl no-print">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">{resultsPageSubText}</h2>
            <div className="flex items-end gap-3 mb-4">
              <Input
                id="studentIdInput"
                label={resultsPageSearchPrompt}
                placeholder="e.g., CUC2024001, student-xyz, name@example.com"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-grow"
                aria-describedby="studentIdHelp"
              />
              <Button onClick={handleSearch} isLoading={isLoading} leftIcon={<MagnifyingGlassIcon className="h-5 w-5"/>}>
                {isLoading ? 'Searching...' : 'View Results'}
              </Button>
            </div>
             <p id="studentIdHelp" className="text-xs text-slate-500">Your Student ID Number, unique system identifier, or registered email address.</p>

            {error && <p role="alert" className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          </div>
        </Card>

        {currentStudent && studentResults.length > 0 && (
          <div className="mt-8">
            <Card className="shadow-xl printable-card"> 
              <div className="p-6"> 
                <div className="mb-6 text-center no-print"> 
                    <h2 className="text-2xl font-bold text-sky-700">Academic Transcript</h2>
                    <hr className="my-3"/>
                </div>

                <div className="mb-6 space-y-1 student-info-for-print-only">
                  <p className="flex items-center">
                    <UserCircleIcon className="h-5 w-5 mr-2 text-slate-500"/>
                    <span className="font-medium text-slate-700">Student Name:</span>&nbsp;
                    {currentStudent.firstName} {currentStudent.lastName}
                  </p>
                  <p className="flex items-center">
                    <HashtagIcon className="h-5 w-5 mr-2 text-slate-500"/>
                    <span className="font-medium text-slate-700">System ID:</span>&nbsp;
                    {currentStudent.id}
                  </p>
                  {currentStudent.studentIdNumber && (
                    <p className="flex items-center">
                      <IdentificationIcon className="h-5 w-5 mr-2 text-slate-500"/>
                      <span className="font-medium text-slate-700">Student ID:</span>&nbsp;
                      {currentStudent.studentIdNumber}
                    </p>
                  )}
                   <p className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-slate-500"/>
                    <span className="font-medium text-slate-700">Email:</span>&nbsp;
                    {currentStudent.email}
                  </p>
                   <p className="text-xs text-slate-500 mt-1">Date Generated: {new Date().toLocaleDateString()}</p>
                </div>
                
                <div ref={resultsRef} className="printable-content">
                  <table className="min-w-full divide-y divide-gray-200 border">
                    <thead className="bg-slate-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Course Code</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Course Title</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Credits</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {studentResults.map((result, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{result.courseCode}</td>
                          <td className="px-4 py-3 text-sm text-slate-700">{result.courseTitle}</td> 
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-700">{result.credits}</td>
                          <td className={`px-4 py-3 whitespace-nowrap text-sm font-semibold 
                            ${result.grade && (result.grade.startsWith('A') || result.grade.startsWith('B')) ? 'text-green-600' : 
                              result.grade && (result.grade.startsWith('C') || result.grade.startsWith('D')) ? 'text-orange-600' : 
                              result.grade === 'Not Graded' ? 'text-slate-500' : 'text-red-600'
                            }`}>{result.grade}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-xs text-slate-500 mt-4 text-center">--- End of Transcript ---</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border-t flex justify-end space-x-3 no-print">
                <Button onClick={handlePrint} variant="secondary" leftIcon={<PrinterIcon className="h-5 w-5"/>}>
                  Print Results
                </Button>
              </div>
            </Card>
          </div>
        )}
        
        <div className="mt-8 text-center no-print">
          <Link to="/login" className="group inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-150">
            <ArrowLeftIcon className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </div>
      </div>
       <p className="text-center text-xs text-slate-500 mt-10 no-print">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default StudentResultsPage;
