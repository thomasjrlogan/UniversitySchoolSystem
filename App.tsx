
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import SideNavbar from './components/SideNavbar';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import EnrollmentsPage from './pages/EnrollmentsPage';
import PhotoGalleryPage from './pages/PhotoGalleryPage';
import LoginPage from './pages/LoginPage';
import ApplicationPage from './pages/ApplicationPage';
import { StudentResultsPage } from './pages/StudentResultsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminProfilePage from './pages/AdminProfilePage'; // Import AdminProfilePage
import LecturerDashboardPage from './pages/LecturerDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PublicHomePage from './pages/PublicHomePage';
import ContactUsPage from './pages/ContactUsPage';
import EventDetailPage from './pages/EventDetailPage'; // Added EventDetailPage import

// Lecturer placeholder pages
import LecturerMyCoursesPage from './pages/LecturerMyCoursesPage';
import LecturerUploadGradesPage from './pages/LecturerUploadGradesPage';
import LecturerViewStudentsPage from './pages/LecturerViewStudentsPage';
import LecturerAnnouncementsPage from './pages/LecturerAnnouncementsPage';

// Student placeholder pages
import StudentMyCoursesPage from './pages/StudentMyCoursesPage';
import StudentPaymentStatusPage from './pages/StudentPaymentStatusPage';
import StudentClassSchedulePage from './pages/StudentClassSchedulePage';
import StudentAdminMessagesPage from './pages/StudentAdminMessagesPage';


import { Student, Course, Enrollment, StudentApplication, TeacherApplication, AppSettings, Lecturer, CalendarEvent, NewsItem, Photo, Page } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { DEFAULT_APP_SETTINGS, NAV_ITEMS } from './constants';

// Helper to get date string for future dates
const getFutureDateString = (daysAhead: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const initialCalendarEvents: CalendarEvent[] = [
  { id: 'event1', title: 'Mid-term Exams Begin', date: getFutureDateString(10), type: 'Exam', description: 'Mid-term examinations for all departments.' },
  { id: 'event2', title: 'Course Registration Deadline', date: getFutureDateString(5), type: 'Deadline', description: 'Last day for course registration for the upcoming semester.' },
  { id: 'event3', title: 'University Open Day', date: getFutureDateString(20), type: 'Event', description: 'Prospective students and parents are welcome to visit the campus.' },
  { id: 'event4', title: 'National Holiday: Founder\'s Day', date: getFutureDateString(30), type: 'Holiday', description: 'University closed for Founder\'s Day.' },
  { id: 'event5', title: 'Final Project Submissions', date: getFutureDateString(45), type: 'Deadline', description: 'Deadline for final year project submissions.'},
  { id: 'event6', title: 'Semester Start', date: getFutureDateString(2), type: 'Event', description: 'New semester classes begin.'},
];

const initialPhotos: Photo[] = [
    {
        id: 'photo-sample-1',
        title: 'Campus Main Entrance',
        description: 'The iconic main entrance of Christian University College.',
        imageUrl: 'https://picsum.photos/seed/campus1/800/600',
        uploadDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        category: 'Campus Life',
    },
    {
        id: 'photo-sample-2',
        title: 'University Library',
        description: 'Students studying in the newly renovated library.',
        imageUrl: 'https://picsum.photos/seed/library/800/600',
        uploadDate: new Date(Date.now() - 86400000 * 3).toISOString(),
        category: 'Academics',
    },
    {
        id: 'photo-sample-3',
        title: 'Graduation Ceremony 2023',
        description: 'Highlights from the annual graduation ceremony.',
        imageUrl: 'https://picsum.photos/seed/graduation/800/600',
        uploadDate: new Date(Date.now() - 86400000 * 10).toISOString(),
        category: 'Events',
    },
     {
        id: 'photo-sample-4',
        title: 'Science Lab',
        description: 'State-of-the-art science laboratory facilities.',
        imageUrl: 'https://picsum.photos/seed/sciencelab/800/600',
        uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        category: 'Academics',
    },
    {
        id: 'photo-sample-5',
        title: 'Annual Sports Day',
        description: 'Students participating in the annual sports meet.',
        imageUrl: 'https://picsum.photos/seed/sportsday/800/600',
        uploadDate: new Date(Date.now() - 86400000 * 7).toISOString(),
        category: 'Sports',
    },
    {
        id: 'photo-sample-6',
        title: 'Student Achievements Award',
        description: 'Recognizing outstanding student achievements.',
        imageUrl: 'https://picsum.photos/seed/achievements/800/600',
        uploadDate: new Date(Date.now() - 86400000 * 4).toISOString(),
        category: 'Achievements',
    }
];

const initialBscCourses: Course[] = [
  {
    id: 'bsc-midw-001',
    title: "Midwifery",
    code: "BSCMIDW101",
    description: "This course provides comprehensive knowledge and skills in midwifery practice, focusing on women's health, pregnancy, childbirth, and postnatal care.",
    credits: 4,
    department: "School of Health Sciences",
    coverImageUrl: "https://picsum.photos/seed/BSCMIDW101/400/200"
  },
  {
    id: 'bsc-pubh-001',
    title: "Public Health",
    code: "BSCPUBH101",
    description: "An introduction to public health principles, including epidemiology, health promotion, disease prevention, and health policy analysis.",
    credits: 3,
    department: "School of Health Sciences",
    coverImageUrl: "https://picsum.photos/seed/BSCPUBH101/400/200"
  },
  {
    id: 'bsc-foodsci-001',
    title: "Food Science",
    code: "BSCFOOD101",
    description: "Explores the scientific principles underlying food processing, preservation, nutrition, and safety, from farm to table.",
    credits: 3,
    department: "School of Applied Sciences",
    coverImageUrl: "https://picsum.photos/seed/BSCFOOD101/400/200"
  },
  {
    id: 'bsc-waterres-001',
    title: "Water Resource Management",
    code: "BSCWATER101",
    description: "Focuses on the sustainable management of water resources, covering hydrology, water quality, policy, and conservation strategies.",
    credits: 3,
    department: "School of Environmental Sciences",
    coverImageUrl: "https://picsum.photos/seed/BSCWATER101/400/200"
  },
  {
    id: 'bsc-healthadm-001',
    title: "Health Administration & Management",
    code: "BSCHADM101",
    description: "Covers the principles of healthcare management, including organizational behavior, health economics, policy, and leadership in health systems.",
    credits: 4,
    department: "School of Health Sciences",
    coverImageUrl: "https://picsum.photos/seed/BSCHADM101/400/200"
  },
  {
    id: 'bsc-edu-ece-001',
    title: "Early Childhood Education",
    code: "BSCEDU_ECE101",
    description: "Focuses on the development, learning, and care of young children from birth through age eight, emphasizing play-based learning and early intervention strategies.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_ECE101/400/200"
  },
  {
    id: 'bsc-edu-pri-001',
    title: "Primary Education",
    code: "BSCEDU_PRI101",
    description: "Prepares educators to teach children in primary school grades (typically 1-6), covering curriculum development, classroom management, and pedagogical approaches for diverse learners.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_PRI101/400/200"
  },
  {
    id: 'bsc-edu-mths-001',
    title: "Mathematics Education (Secondary)",
    code: "BSCEDU_MTHS101",
    description: "Equips future teachers with advanced mathematical knowledge and pedagogical skills to effectively teach mathematics concepts at the secondary school level.",
    credits: 4,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_MTHS101/400/200"
  },
  {
    id: 'bsc-edu-phys-001',
    title: "Physics Education (Secondary)",
    code: "BSCEDU_PHYS101",
    description: "Focuses on teaching physics concepts, experimental methodologies, and critical thinking in physics to secondary school students.",
    credits: 4,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_PHYS101/400/200"
  },
  {
    id: 'bsc-edu-chem-001',
    title: "Chemistry Education (Secondary)",
    code: "BSCEDU_CHEM101",
    description: "Prepares educators to teach chemistry in secondary schools, covering core chemical principles, laboratory safety, and inquiry-based learning.",
    credits: 4,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_CHEM101/400/200"
  },
  {
    id: 'bsc-edu-bio-001',
    title: "Biology Education (Secondary)",
    code: "BSCEDU_BIO101",
    description: "Focuses on the principles of biology, ecological systems, and effective strategies for teaching biological sciences at the secondary level.",
    credits: 4,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_BIO101/400/200"
  },
  {
    id: 'bsc-edu-lang-001',
    title: "Language Arts Education (Secondary)",
    code: "BSCEDU_LANG101",
    description: "Covers theories and practices for teaching language, literature, composition, and communication skills in secondary education.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_LANG101/400/200"
  },
  {
    id: 'bsc-edu-geo-001',
    title: "Geography Education (Secondary)",
    code: "BSCEDU_GEO101",
    description: "Prepares educators to teach geography, including physical, human, and environmental aspects, as well as geospatial technologies, at the secondary level.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_GEO101/400/200"
  },
  {
    id: 'bsc-edu-econ-001',
    title: "Economics Education (Secondary)",
    code: "BSCEDU_ECON101",
    description: "Focuses on teaching economic principles, market dynamics, and financial literacy to secondary school students.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_ECON101/400/200"
  },
  {
    id: 'bsc-edu-hist-001',
    title: "History Education (Secondary)",
    code: "BSCEDU_HIST101",
    description: "Equips educators to teach history, historical analysis, critical thinking about sources, and diverse historical narratives at the secondary level.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/BSCEDU_HIST101/400/200"
  }
];

const initialAdvanceDiplomaCourses: Course[] = [
  {
    id: 'ad-edu-ece-001',
    title: "Early Childhood Education (Adv. Dip.)",
    code: "ADEDU_ECE201",
    description: "This nine-month Advance Diploma program provides specialized training in early childhood development, curriculum planning, and classroom management for preschool and kindergarten settings.",
    credits: 3,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/ADEDU_ECE201/400/200"
  },
  {
    id: 'ad-edu-slm-001',
    title: "School Leadership & Management (Adv. Dip.)",
    code: "ADEDU_SLM201",
    description: "A nine-month Advance Diploma designed for educators aspiring to leadership roles, focusing on school administration, policy development, financial management, and effective team leadership in educational institutions.",
    credits: 4,
    department: "School of Education",
    coverImageUrl: "https://picsum.photos/seed/ADEDU_SLM201/400/200"
  },
  {
    id: 'ad-pro-ppw-001',
    title: "Project Proposal Writing (Adv. Dip.)",
    code: "ADPRO_PPW201",
    description: "This intensive nine-month Advance Diploma equips participants with skills to develop compelling project proposals, covering needs assessment, logical framework design, budgeting, and presentation for various funding sources.",
    credits: 3,
    department: "School of Professional Studies",
    coverImageUrl: "https://picsum.photos/seed/ADPRO_PPW201/400/200"
  },
  {
    id: 'ad-pro-me-001',
    title: "Monitoring & Evaluation (Adv. Dip.)",
    code: "ADPRO_ME201",
    description: "A nine-month Advance Diploma program on M&E principles and practices, including framework design, data collection, analysis, and reporting for effective project and program management.",
    credits: 3,
    department: "School of Professional Studies",
    coverImageUrl: "https://picsum.photos/seed/ADPRO_ME201/400/200"
  },
  {
    id: 'ad-pro-ia-001',
    title: "Internal Auditing (Adv. Dip.)",
    code: "ADPRO_IA201",
    description: "This nine-month Advance Diploma provides comprehensive knowledge of internal auditing standards, risk assessment, control mechanisms, and reporting for corporate governance and compliance roles.",
    credits: 4,
    department: "School of Professional Studies",
    coverImageUrl: "https://picsum.photos/seed/ADPRO_IA201/400/200"
  },
  {
    id: 'ad-hs-ham-001',
    title: "Health Administration & Management (Adv. Dip.)",
    code: "ADHS_HAM201",
    description: "A nine-month Advance Diploma for healthcare professionals focusing on health systems management, policy, healthcare economics, and leadership within health organizations.",
    credits: 4,
    department: "School of Health Sciences",
    coverImageUrl: "https://picsum.photos/seed/ADHS_HAM201/400/200"
  },
  {
    id: 'ad-ass-ggs-001',
    title: "Geography & Government Studies (Adv. Dip.)",
    code: "ADASS_GGS201",
    description: "This nine-month Advance Diploma explores the interplay between geography and governmental structures, public policy, and political systems for public service or research roles.",
    credits: 3,
    department: "School of Arts and Social Sciences",
    coverImageUrl: "https://picsum.photos/seed/ADASS_GGS201/400/200"
  },
  {
    id: 'ad-ass-pj-001',
    title: "Professional Journalism (Adv. Dip.)",
    code: "ADASS_PJ201",
    description: "A nine-month Advance Diploma developing practical journalism skills: news writing, reporting, media ethics, digital journalism, and investigative techniques.",
    credits: 3,
    department: "School of Arts and Social Sciences",
    coverImageUrl: "https://picsum.photos/seed/ADASS_PJ201/400/200"
  },
  {
    id: 'ad-pro-pm-001',
    title: "Procurement Management (Adv. Dip.)",
    code: "ADPRO_PM201",
    description: "This nine-month Advance Diploma covers strategic procurement aspects: sourcing, contract management, negotiation, supply chain ethics, and public procurement regulations.",
    credits: 4,
    department: "School of Professional Studies",
    coverImageUrl: "https://picsum.photos/seed/ADPRO_PM201/400/200"
  },
  {
    id: 'ad-pro-lm-001',
    title: "Logistic Management (Adv. Dip.)",
    code: "ADPRO_LM201",
    description: "A nine-month Advance Diploma on logistics and supply chain management: transportation, warehousing, inventory control, and global logistics operations.",
    credits: 4,
    department: "School of Professional Studies",
    coverImageUrl: "https://picsum.photos/seed/ADPRO_LM201/400/200"
  }
];

const initialDefaultCourses: Course[] = [
  ...initialBscCourses,
  ...initialAdvanceDiplomaCourses,
];

const DynamicPageTitle: React.FC<{ appSettings: AppSettings, isAdminLoggedIn: boolean }> = ({ appSettings, isAdminLoggedIn }) => {
  const location = useLocation();
  const appName = appSettings.appName || DEFAULT_APP_SETTINGS.appName;

  useEffect(() => {
    let pageName = '';
    const currentPath = location.pathname;

    if (isAdminLoggedIn) {
        const navItem = NAV_ITEMS.find(item => {
        if (item.path === '/') return currentPath === '/';
        return currentPath === item.path || currentPath.startsWith(item.path + '/');
        });
        if (navItem) {
            pageName = navItem.name;
        } else if (currentPath === '/') { 
            pageName = Page.Dashboard;
        } else if (currentPath.startsWith('/admin/profile')) {
            pageName = Page.AdminProfile;
        }
    } else {
        // Public pages
        if (currentPath === '/') pageName = Page.PublicHome;
        else if (currentPath.startsWith('/login')) pageName = 'Login' as Page;
        else if (currentPath.startsWith('/apply')) pageName = Page.Applications;
        else if (currentPath.startsWith('/results')) pageName = Page.Results;
        else if (currentPath.startsWith('/lecturer-dashboard')) pageName = Page.LecturerDashboard;
        else if (currentPath.startsWith('/student-dashboard')) pageName = Page.StudentDashboard;
        else if (currentPath.startsWith('/signup')) pageName = 'Sign Up' as Page;
        else if (currentPath.startsWith('/forgot-password')) pageName = 'Forgot Password' as Page;
        else if (currentPath.startsWith('/gallery')) pageName = Page.Gallery;
        else if (currentPath.startsWith('/contact')) pageName = Page.ContactUs;
        else if (currentPath.startsWith('/event-detail')) pageName = Page.EventDetail;
        // Lecturer functional pages
        else if (currentPath.startsWith('/lecturer-my-courses')) pageName = Page.LecturerMyCourses;
        else if (currentPath.startsWith('/lecturer-upload-grades')) pageName = Page.LecturerUploadGrades;
        else if (currentPath.startsWith('/lecturer-view-students')) pageName = Page.LecturerViewStudents;
        else if (currentPath.startsWith('/lecturer-announcements')) pageName = Page.LecturerAnnouncements;
        // Student functional pages
        else if (currentPath.startsWith('/student-my-courses')) pageName = Page.StudentMyCourses;
        else if (currentPath.startsWith('/student-payment-status')) pageName = Page.StudentPaymentStatus;
        else if (currentPath.startsWith('/student-class-schedule')) pageName = Page.StudentClassSchedule;
        else if (currentPath.startsWith('/student-admin-messages')) pageName = Page.StudentAdminMessages;
    }


    if (pageName) {
      document.title = `${pageName} | ${appName}`;
    } else {
      document.title = appName;
    }
  }, [location.pathname, appName, isAdminLoggedIn]);

  return null;
};


const App: React.FC = () => {
  const [students, setStudents] = useLocalStorage<Student[]>('students', []);
  const [courses, setCourses] = useLocalStorage<Course[]>('courses', () => {
    const savedCourses = localStorage.getItem('courses');
    return savedCourses ? JSON.parse(savedCourses) : initialDefaultCourses;
  });
  const [enrollments, setEnrollments] = useLocalStorage<Enrollment[]>('enrollments', []);
  const [lecturers, setLecturers] = useLocalStorage<Lecturer[]>('lecturers', []);
  const [calendarEvents, setCalendarEvents] = useLocalStorage<CalendarEvent[]>('calendarEvents', initialCalendarEvents);
  const [newsItems, setNewsItems] = useLocalStorage<NewsItem[]>('newsItems', []);
  const [photos, setPhotos] = useLocalStorage<Photo[]>('photos', initialPhotos);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useLocalStorage<boolean>('isAdminLoggedIn', false);

  const [_studentApplications, _setStudentApplications] = useLocalStorage<StudentApplication[]>('studentApplications', []);
  const [_teacherApplications, _setTeacherApplications] = useLocalStorage<TeacherApplication[]>('teacherApplications', []);

  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('appSettings', DEFAULT_APP_SETTINGS);


  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const addStudent = (studentData: Omit<Student, 'id'>) => {
    const newStudent: Student = { ...studentData, id: `student-${Date.now().toString()}-${Math.random().toString(36).substring(2, 8)}` };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setEnrollments(prev => prev.filter(e => e.studentId !== studentId));
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = { ...courseData, id: `course-${Date.now().toString()}-${Math.random().toString(36).substring(2, 8)}` };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setEnrollments(prev => prev.filter(e => e.courseId !== courseId));
  };

  const addEnrollment = (enrollmentData: Omit<Enrollment, 'id'>) => {
    if (!students.find(s => s.id === enrollmentData.studentId) || !courses.find(c => c.id === enrollmentData.courseId)) {
      alert("Error: Invalid student or course ID for enrollment.");
      return false;
    }
    if (enrollments.find(e => e.studentId === enrollmentData.studentId && e.courseId === enrollmentData.courseId)) {
        alert("Error: Student is already enrolled in this course.");
        return false;
    }
    const newEnrollment: Enrollment = { ...enrollmentData, id: `enrollment-${Date.now().toString()}-${Math.random().toString(36).substring(2, 8)}` };
    setEnrollments(prev => [...prev, newEnrollment]);
    return true;
  };

  const deleteEnrollment = (enrollmentId: string) => {
    setEnrollments(prev => prev.filter(e => e.id !== enrollmentId));
  };

  const updateEnrollmentGrade = (enrollmentId: string, newGrade: string | undefined) => {
    setEnrollments(prevEnrollments =>
      prevEnrollments.map(enrollment =>
        enrollment.id === enrollmentId ? { ...enrollment, grade: newGrade } : enrollment
      )
    );
  };

  const addNewsItem = (newsData: Omit<NewsItem, 'id' | 'date' | 'author'>) => {
    const newNewsItem: NewsItem = {
      ...newsData,
      id: `news-${Date.now().toString()}-${Math.random().toString(36).substring(2, 8)}`,
      date: new Date().toISOString(),
      author: 'Admin',
    };
    setNewsItems(prev => [newNewsItem, ...prev.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())]);
  };

  const updateNewsItem = (updatedNews: NewsItem) => {
    setNewsItems(prev => prev.map(item => item.id === updatedNews.id ? { ...updatedNews, date: new Date().toISOString() } : item)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const deleteNewsItem = (newsId: string) => {
    setNewsItems(prev => prev.filter(item => item.id !== newsId));
  };

  const addPhoto = (photoData: Omit<Photo, 'id' | 'uploadDate'>) => {
    const newPhoto: Photo = {
      ...photoData,
      id: `photo-${Date.now().toString()}-${Math.random().toString(36).substring(2, 8)}`,
      uploadDate: new Date().toISOString(),
    };
    setPhotos(prev => [newPhoto, ...prev.sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())]);
  };

  const updatePhoto = (updatedPhotoData: Photo) => {
    setPhotos(prev => prev.map(p => p.id === updatedPhotoData.id ? {...updatedPhotoData, uploadDate: new Date().toISOString()} : p)
     .sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()));
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };


  if (!isAdminLoggedIn) {
    return (
      <HashRouter>
        <DynamicPageTitle appSettings={appSettings} isAdminLoggedIn={false} />
        <Routes>
          <Route path="/" element={<PublicHomePage appSettings={appSettings} />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} appSettings={appSettings} />} />
          <Route path="/apply" element={<ApplicationPage appSettings={appSettings} courses={courses} />} />
          <Route path="/results" element={<StudentResultsPage students={students} courses={courses} enrollments={enrollments} appSettings={appSettings} />} />
          <Route path="/lecturer-dashboard" element={<LecturerDashboardPage appSettings={appSettings} />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage appSettings={appSettings} students={students} courses={courses} enrollments={enrollments}/>} />
          <Route path="/signup" element={<SignUpPage appSettings={appSettings} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage appSettings={appSettings} />} />
          <Route path="/contact" element={<ContactUsPage appSettings={appSettings} />} />
          <Route path="/event-detail" element={<EventDetailPage appSettings={appSettings} />} /> 
          <Route
            path="/gallery"
            element={
              <PhotoGalleryPage
                photos={photos}
                headingTextColor={appSettings.headingTextColor}
                isPublicView={true}
                appSettings={appSettings}
              />
            }
          />
          {/* Lecturer Functional Page Routes */}
          <Route path="/lecturer-my-courses" element={<LecturerMyCoursesPage appSettings={appSettings} />} />
          <Route 
            path="/lecturer-upload-grades" 
            element={
              <LecturerUploadGradesPage 
                appSettings={appSettings} 
                students={students}
                courses={courses}
                enrollments={enrollments}
                updateEnrollmentGrade={updateEnrollmentGrade}
              />
            } 
          />
          <Route path="/lecturer-view-students" element={<LecturerViewStudentsPage appSettings={appSettings} />} />
          <Route path="/lecturer-announcements" element={<LecturerAnnouncementsPage appSettings={appSettings} />} />

          {/* Student Functional Page Routes */}
          <Route path="/student-my-courses" element={<StudentMyCoursesPage appSettings={appSettings} />} />
          <Route path="/student-payment-status" element={<StudentPaymentStatusPage appSettings={appSettings} />} />
          <Route path="/student-class-schedule" element={<StudentClassSchedulePage appSettings={appSettings} />} />
          <Route path="/student-admin-messages" element={<StudentAdminMessagesPage appSettings={appSettings} />} />


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    );
  }

  const contentBgClass = appSettings.contentBackgroundTheme || DEFAULT_APP_SETTINGS.contentBackgroundTheme || 'slate-100';
  const mainFontClass = appSettings.fontFamily || DEFAULT_APP_SETTINGS.fontFamily || 'font-sans';
  const mainTextColorClass = appSettings.mainTextColor?.startsWith('#') ? '' : (appSettings.mainTextColor || DEFAULT_APP_SETTINGS.mainTextColor || 'text-slate-700');
  const mainTextColorStyle = appSettings.mainTextColor?.startsWith('#') ? { color: appSettings.mainTextColor } : {};
  const headingTextColor = appSettings.headingTextColor || DEFAULT_APP_SETTINGS.headingTextColor || 'text-slate-800';


  return (
    <HashRouter>
      <DynamicPageTitle appSettings={appSettings} isAdminLoggedIn={true} />
      <div className={`flex h-screen bg-slate-100 ${mainFontClass}`}>
        <SideNavbar appSettings={appSettings} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onLogout={handleLogout} appSettings={appSettings} />
          <main
            className={`flex-1 overflow-x-hidden overflow-y-auto bg-${contentBgClass} p-6 ${mainTextColorClass}`}
            style={mainTextColorStyle}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardPage
                    students={students}
                    courses={courses}
                    enrollments={enrollments}
                    lecturers={lecturers}
                    calendarEvents={calendarEvents}
                    newsItems={newsItems}
                    addNewsItem={addNewsItem}
                    updateNewsItem={updateNewsItem}
                    deleteNewsItem={deleteNewsItem}
                    updateStudent={updateStudent}
                    updateEnrollmentGrade={updateEnrollmentGrade}
                    headingTextColor={headingTextColor}
                  />
                }
              />
              <Route path="/students" element={<StudentsPage students={students} addStudent={addStudent} updateStudent={updateStudent} deleteStudent={deleteStudent} headingTextColor={headingTextColor} />} />
              <Route path="/courses" element={<CoursesPage courses={courses} addCourse={addCourse} updateCourse={updateCourse} deleteCourse={deleteCourse} headingTextColor={headingTextColor} />} />
              <Route path="/enrollments" element={<EnrollmentsPage enrollments={enrollments} students={students} courses={courses} addEnrollment={addEnrollment} deleteEnrollment={deleteEnrollment} headingTextColor={headingTextColor} />} />
              <Route
                path="/gallery"
                element={
                  <PhotoGalleryPage
                    photos={photos}
                    addPhoto={addPhoto}
                    updatePhoto={updatePhoto}
                    deletePhoto={deletePhoto}
                    headingTextColor={headingTextColor}
                    isPublicView={false}
                    appSettings={appSettings}
                  />
                }
              />
              <Route path="/admin/profile" element={<AdminProfilePage appSettings={appSettings} setAppSettings={setAppSettings} headingTextColor={headingTextColor} />} />
              <Route path="/admin/settings" element={<AdminSettingsPage appSettings={appSettings} setAppSettings={setAppSettings} headingTextColor={headingTextColor} />} />
              
              {/* Lecturer Functional Page Routes (for admin context, could be different if lecturer auth was separate) */}
              <Route path="/lecturer-my-courses" element={<LecturerMyCoursesPage appSettings={appSettings} />} />
              <Route 
                path="/lecturer-upload-grades" 
                element={
                  <LecturerUploadGradesPage 
                    appSettings={appSettings} 
                    students={students}
                    courses={courses}
                    enrollments={enrollments}
                    updateEnrollmentGrade={updateEnrollmentGrade}
                  />
                } 
              />
              <Route path="/lecturer-view-students" element={<LecturerViewStudentsPage appSettings={appSettings} />} />
              <Route path="/lecturer-announcements" element={<LecturerAnnouncementsPage appSettings={appSettings} />} />

               {/* Student Functional Page Routes (for admin context, might differ for actual student login) */}
              <Route path="/student-my-courses" element={<StudentMyCoursesPage appSettings={appSettings} />} />
              <Route path="/student-payment-status" element={<StudentPaymentStatusPage appSettings={appSettings} />} />
              <Route path="/student-class-schedule" element={<StudentClassSchedulePage appSettings={appSettings} />} />
              <Route path="/student-admin-messages" element={<StudentAdminMessagesPage appSettings={appSettings} />} />


              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
