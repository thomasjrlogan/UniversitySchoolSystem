
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings, Student, Course, Enrollment } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, PencilSquareIcon, DocumentArrowDownIcon, DocumentArrowUpIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input'; // Import Input component
import LoadingSpinner from '../components/LoadingSpinner';

// It's highly recommended to add "xlsx": "https://esm.sh/xlsx@^0.18.5" to your importmap in index.html
// import * as XLSX from 'xlsx'; // Uncomment this if you add xlsx to your importmap or install it

interface LecturerUploadGradesPageProps {
  appSettings: AppSettings;
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  updateEnrollmentGrade: (enrollmentId: string, newGrade: string | undefined) => void;
}

// Placeholder for XLSX module if not globally available or through import map
declare var XLSX: any;


const LecturerUploadGradesPage: React.FC<LecturerUploadGradesPageProps> = ({ 
    appSettings, 
    students,
    courses,
    enrollments,
    updateEnrollmentGrade
}) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo 
  } = appSettings;

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [courseStudents, setCourseStudents] = useState<Student[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'success' | 'error' | 'info', text: string} | null>(null);

  useEffect(() => {
    if (selectedCourseId) {
      const enrolledStudentIds = enrollments
        .filter(e => e.courseId === selectedCourseId)
        .map(e => e.studentId);
      const studentsInCourse = students.filter(s => enrolledStudentIds.includes(s.id));
      setCourseStudents(studentsInCourse);
    } else {
      setCourseStudents([]);
    }
  }, [selectedCourseId, enrollments, students]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourseId(e.target.value);
    setFeedbackMessage(null);
  };

  const handleDownloadTemplate = () => {
    if (!selectedCourseId) {
      setFeedbackMessage({type: 'error', text: "Please select a course first."});
      return;
    }
    if (courseStudents.length === 0) {
      setFeedbackMessage({type: 'info', text: "No students enrolled in this course to generate a template."});
      return;
    }

    if (typeof XLSX === 'undefined') {
        setFeedbackMessage({type: 'error', text: "Excel library (XLSX) is not loaded. Cannot download template."});
        alert("Excel library (XLSX) is not loaded. Please ensure it's included in your project (e.g., via importmap in index.html) to use Excel features.");
        return;
    }

    setProcessing(true);
    setFeedbackMessage(null);
    const selectedCourse = courses.find(c => c.id === selectedCourseId);

    const dataForExcel = [
      ["Student System ID", "Student Name", "Current Grade", "New Grade (Enter A, B, C, D, F, or leave blank to keep current)"]
    ];
    
    courseStudents.forEach(student => {
      const enrollment = enrollments.find(e => e.studentId === student.id && e.courseId === selectedCourseId);
      dataForExcel.push([
        student.id,
        `${student.firstName} ${student.lastName}`,
        enrollment?.grade || 'Not Graded',
        '' // Empty cell for new grade
      ]);
    });

    try {
      const worksheet = XLSX.utils.aoa_to_sheet(dataForExcel);
      // Set column widths (optional, but good for readability)
      worksheet['!cols'] = [ {wch:20}, {wch:30}, {wch:15}, {wch:50} ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
      XLSX.writeFile(workbook, `Grade_Template_${selectedCourse?.code || 'Course'}.xlsx`);
      setFeedbackMessage({type: 'success', text: "Grade template downloaded successfully."});
    } catch (error) {
        console.error("Error generating Excel template:", error);
        setFeedbackMessage({type: 'error', text: "Error generating Excel template. See console for details."});
    } finally {
        setProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      setFeedbackMessage(null);
    } else {
      setUploadedFile(null);
    }
  };

  const handleProcessUpload = () => {
    if (!uploadedFile) {
      setFeedbackMessage({type: 'error', text: "Please select a file to upload."});
      return;
    }
    if (!selectedCourseId) {
        setFeedbackMessage({type: 'error', text: "Please select a course before processing grades."});
        return;
    }
    if (typeof XLSX === 'undefined') {
        setFeedbackMessage({type: 'error', text: "Excel library (XLSX) is not loaded. Cannot process file."});
        alert("Excel library (XLSX) is not loaded. Please ensure it's included in your project to use Excel features.");
        return;
    }

    setProcessing(true);
    setFeedbackMessage(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Array<Record<string, any>>;
        
        let updatedCount = 0;
        let errorCount = 0;
        const errorMessages: string[] = [];

        jsonData.forEach((row, index) => {
          const studentSystemId = row["Student System ID"]?.toString().trim();
          let newGrade = row["New Grade (Enter A, B, C, D, F, or leave blank to keep current)"]?.toString().trim().toUpperCase();

          if (!studentSystemId) {
            errorMessages.push(`Row ${index + 2}: Missing Student System ID.`);
            errorCount++;
            return;
          }
          
          if (newGrade === undefined || newGrade === null || newGrade === '') {
            // If New Grade is blank, skip updating this student's grade
            return;
          }

          const validGrades = ["A", "B", "C", "D", "F"];
          if (!validGrades.includes(newGrade)) {
            errorMessages.push(`Row ${index + 2}: Invalid grade "${newGrade}" for Student ID ${studentSystemId}. Grade must be A, B, C, D, or F.`);
            errorCount++;
            return;
          }

          const enrollmentToUpdate = enrollments.find(e => e.studentId === studentSystemId && e.courseId === selectedCourseId);

          if (enrollmentToUpdate) {
            updateEnrollmentGrade(enrollmentToUpdate.id, newGrade);
            updatedCount++;
          } else {
            errorMessages.push(`Row ${index + 2}: No enrollment found for Student System ID ${studentSystemId} in the selected course.`);
            errorCount++;
          }
        });

        let summaryMessage = `Processed ${jsonData.length} rows. Successfully updated ${updatedCount} grades.`;
        if (errorCount > 0) {
          summaryMessage += ` Encountered ${errorCount} errors.`;
          setFeedbackMessage({type: 'error', text: `${summaryMessage} Errors: ${errorMessages.slice(0,5).join(' ')} ${errorMessages.length > 5 ? '... (see console for all errors)' : ''}` });
          if (errorMessages.length > 0) console.error("Grade Upload Errors:", errorMessages);
        } else {
          setFeedbackMessage({type: 'success', text: summaryMessage});
        }

      } catch (error) {
        console.error("Error processing Excel file:", error);
        setFeedbackMessage({type: 'error', text: "Error processing Excel file. Make sure it's a valid .xlsx file and matches the template format."});
      } finally {
        setProcessing(false);
        setUploadedFile(null); 
        // Reset file input visually
        const fileInput = document.getElementById('grade-file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      }
    };
    reader.onerror = () => {
      setFeedbackMessage({type: 'error', text: "Failed to read the uploaded file."});
      setProcessing(false);
    };
    reader.readAsBinaryString(uploadedFile);
  };


  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-10">
        {collegeLogo ? (
            <img src={collegeLogo} alt={`${appName} Logo`} className="h-20 w-auto object-contain mx-auto mb-2 rounded-md" />
        ) : (
            <AcademicCapIcon className="h-16 w-16 text-sky-600 mx-auto mb-2" />
        )}
        <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{appName}</h1>
        <p className="text-2xl text-slate-600 mt-2 flex items-center justify-center">
          <PencilSquareIcon className="h-8 w-8 mr-2 text-slate-500" /> Upload Grades
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
            <div className="p-6 space-y-6">
                <div>
                    <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Course
                    </label>
                    <select
                    id="course-select"
                    value={selectedCourseId}
                    onChange={handleCourseChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    >
                    <option value="">-- Select a Course --</option>
                    {courses.sort((a,b) => a.title.localeCompare(b.title)).map(course => (
                        <option key={course.id} value={course.id}>{course.title} ({course.code})</option>
                    ))}
                    </select>
                </div>

                <Button
                    onClick={handleDownloadTemplate}
                    variant="secondary"
                    leftIcon={<DocumentArrowDownIcon className="h-5 w-5" />}
                    disabled={!selectedCourseId || processing}
                    className="w-full"
                >
                    Download Grade Template for Selected Course
                </Button>

                <hr className="my-4"/>
                
                <div>
                    <label htmlFor="grade-file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Filled Grade Sheet (.xlsx)
                    </label>
                    <Input
                        id="grade-file-upload"
                        type="file"
                        accept=".xlsx"
                        onChange={handleFileChange}
                        className="w-full"
                    />
                    {uploadedFile && <p className="text-xs text-slate-500 mt-1">Selected file: {uploadedFile.name}</p>}
                </div>
                
                <Button
                    onClick={handleProcessUpload}
                    variant="primary"
                    leftIcon={<DocumentCheckIcon className="h-5 w-5" />}
                    disabled={!uploadedFile || processing || !selectedCourseId}
                    isLoading={processing}
                    className="w-full"
                >
                    {processing ? 'Processing...' : 'Process Uploaded Grades'}
                </Button>

                {feedbackMessage && (
                    <div 
                        role="alert" 
                        className={`p-3 rounded-md text-sm mt-4 ${
                            feedbackMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
                            feedbackMessage.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' :
                            'bg-sky-100 text-sky-700 border border-sky-300'
                        }`}
                    >
                        {feedbackMessage.text}
                    </div>
                )}
            </div>
        </Card>
        
        {processing && <LoadingSpinner className="mt-6" />}

        <div className="mt-10 text-center">
            <Link to="/lecturer-dashboard">
            <Button variant="ghost" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
                Back to Lecturer Dashboard
            </Button>
            </Link>
        </div>
      </div>
      <p className="text-center text-xs text-slate-500 mt-12">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default LecturerUploadGradesPage;
