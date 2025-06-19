
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD
  major?: string;
  studentIdNumber?: string; // Added Student ID Number
  adminProgressNotes?: string; // Added for admin-editable progress notes
  passportPhoto?: UploadedFile; // Added for student's passport photo
}

export interface Course {
  id: string;
  title: string;
  code: string; // e.g., CS101
  description: string;
  credits: number;
  department?: string;
  coverImageUrl?: string; // Optional: Base64 data URL or external URL
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string; // ISO date string
  grade?: string; // e.g., A, B+, C
}

export interface Lecturer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  coursesTaught?: string[]; // Array of course IDs
}

export enum Page {
  Dashboard = 'Dashboard',
  Students = 'Students',
  Courses = 'Courses',
  Enrollments = 'Enrollments',
  Gallery = 'Photo Gallery',
  Applications = 'Applications',
  Settings = 'Settings',
  Results = 'Results',
  LecturerDashboard = 'Lecturer Dashboard',
  StudentDashboard = 'Student Dashboard',
  UserManagement = 'User Management',
  ContactUs = 'Contact Us',
  PublicHome = 'Home',
  Events = 'Events', // Added for Events list page (or general event section)
  EventDetail = 'Event Detail', // Added for Event Detail page
  AdminProfile = 'My Profile', // Added for Admin Profile page
  // Lecturer Specific Functional Pages
  LecturerMyCourses = 'My Courses (Lecturer)',
  LecturerUploadGrades = 'Upload Grades (Lecturer)',
  LecturerViewStudents = 'View Enrolled Students (Lecturer)',
  LecturerAnnouncements = 'Announcements (Lecturer)',
  // Student Specific Functional Pages
  StudentMyCourses = 'My Courses (Student)',
  StudentPaymentStatus = 'Payment Status (Student)',
  StudentClassSchedule = 'Class Schedule (Student)',
  StudentAdminMessages = 'Admin Messages (Student)',
}

export interface UploadedFile {
  fileName: string;
  fileType: string;
  fileData: string; // Base64 data URL
}

export interface StudentApplication {
  id: string;
  fullName: string;
  email: string;
  alternativeEmail?: string; // Added alternative email
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  programOfInterest: string;
  selectedCourseId?: string; // Optional: For specific first course choice
  previousSchool: string;
  personalStatement: string;
  passportPhoto?: UploadedFile; 
  academicTranscripts?: UploadedFile;
  recommendationLetter?: UploadedFile; 
  applicationDate: string; // ISO date string
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}

export interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  alternativeEmail?: string; // Added alternative email
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  highestQualification: string;
  yearsOfExperience: number;
  subjectsSpecialization: string;
  coverLetter: string;
  passportPhoto?: UploadedFile; 
  cvResume?: UploadedFile;
  academicCertificates?: UploadedFile;
  applicationDate: string; // ISO date string
  status: 'Pending' | 'Reviewed' | 'Accepted' | 'Rejected';
}

export interface MobileMoneyOption {
  id: string;
  providerName: string;
  accountNumber: string;
  instructions?: string;
  isEnabled: boolean;
}

export interface AppSettings {
  appName: string;
  collegeAddress: string;
  collegePhone: string;
  collegeLogo?: string; // Base64 data URL for the logo
  collegeWhatsApp?: string; // WhatsApp number
  applicationFee?: number;
  
  // Primary Bank Details
  bankName?: string;
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankSwiftCode?: string;
  
  // Mobile Money Options
  mobileMoneyOptions: MobileMoneyOption[];

  // UBA Bank Details
  ubaBankName?: string;
  ubaBankAccountName?: string;
  ubaBankAccountNumber?: string;
  ubaBankSwiftCode?: string;

  // LBTI (LBDI) Bank Details
  lbtiBankName?: string;
  lbtiBankAccountName?: string;
  lbtiBankAccountNumber?: string;
  lbtiBankSwiftCode?: string;

  // Asset Bank (International Bank Liberia Limited) Details
  assetBankName?: string;
  assetBankAccountName?: string;
  assetBankAccountNumber?: string;
  assetBankSwiftCode?: string;

  // Theme & Appearance
  primaryColor?: string; // e.g., 'sky-600', 'indigo-500', '#RRGGBB'
  contentBackgroundTheme?: string; // e.g., 'slate-100', 'white'
  mainTextColor?: string; // e.g., 'text-slate-700', '#333333'
  headingTextColor?: string; // e.g., 'text-slate-800', '#111111'
  fontFamily?: string; // e.g., 'font-sans', 'font-serif'

  // Email Configuration
  smtpServer?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string; 
  smtpFromEmail?: string;

  // SMS Configuration
  smsApiUrl?: string;
  smsApiKey?: string; 
  smsSenderId?: string;

  // Admin Profile Settings
  adminUsername: string;
  adminEmail?: string;
  adminPassword?: string; // Stored in clear text in localStorage for demo - NOT SECURE
  adminDesignation?: string;
  adminNationalId?: string;
  adminPhone?: string;
  adminPresentAddress?: string;
  adminPermanentAddress?: string;
  adminGender?: 'Male' | 'Female' | 'Other' | '';
  adminBloodGroup?: string;
  adminReligion?: string;
  adminDateOfBirth?: string; // YYYY-MM-DD
  adminSalaryGrade?: string;
  adminSalaryType?: string;
  adminOtherInfo?: string;
  adminResume?: UploadedFile;
  adminJoiningDate?: string; // YYYY-MM-DD
  adminResignDate?: string; // YYYY-MM-DD
  adminFacebookUrl?: string;
  adminTwitterUrl?: string;
  adminLinkedInUrl?: string;


  // Public Home Page Content
  heroTagline?: string;
  aboutCardButtonText?: string;
  exploreProgramsButtonText?: string;
  whyChooseHeading?: string;
  whyChooseDescription?: string;
  whyChooseFeature1?: string;
  whyChooseFeature2?: string;
  whyChooseFeature3?: string;
  whyChooseFeature4?: string;
  publicHomeMobileMoneyCardTitle?: string;
  publicHomeMobileMoneyCardDesc?: string;
  publicHomeMobileMoneyButtonText?: string;
  publicHomeYouTubeSectionTitle?: string;
  publicHomeYouTubeSectionDesc?: string;
  publicHomeYouTubeVideoUrl?: string;
  publicHomeYouTubeChannelUrl?: string;
  publicHomeYouTubeButtonText?: string;


  // Social Media / Chat Integration
  facebookPageId?: string; // For Messenger Chat Plugin
  facebookPageUrl?: string; // For linking to the Facebook Page
  facebookThemeColor?: string; // Optional: Hex color for Messenger

  // Contact Us Page Content
  contactUsPageHeading?: string;
  contactUsIntroText?: string;
  contactUsSpecificPhone?: string;
  contactUsSpecificFax?: string;
  contactUsSpecificEmail?: string;
  contactUsSpecificAddress?: string;
  contactUsFormHeading?: string;
  contactUsMapEmbedUrl?: string;

  // Event Detail Page (Example Event Content)
  eventDetailExampleTitle?: string;
  eventDetailExampleCategory?: string;
  eventDetailExampleDateRange?: string;
  eventDetailExampleLocation?: string;
  eventDetailExampleOrganizer?: string;
  eventDetailExamplePublishedDate?: string;
  eventDetailExampleDescriptionP1?: string;
  eventDetailExampleDescriptionP2?: string;
  eventDetailExampleHighlightsHeading?: string;
  eventDetailExampleHighlight1?: string;
  eventDetailExampleHighlight2?: string;
  eventDetailExampleHighlight3?: string;
  eventDetailExampleHighlight4?: string;
  eventDetailExampleDescriptionP3?: string;
  eventDetailSidebarLatestEvent1Title?: string;
  eventDetailSidebarLatestEvent1Date?: string;
  eventDetailSidebarLatestEvent2Title?: string;
  eventDetailSidebarLatestEvent2Date?: string;
  eventDetailSidebarLatestEvent3Title?: string;
  eventDetailSidebarLatestEvent3Date?: string;
  eventDetailSidebarLatestEvent4Title?: string;
  eventDetailSidebarLatestEvent4Date?: string;


  // Authentication Pages Content
  loginPageMainHeading?: string; // Replaces "Admin Login"
  signUpPageHeading?: string;
  signUpPageSubText?: string;
  forgotPasswordPageHeading?: string;
  forgotPasswordPageSubText?: string;

  // Results Page Content
  resultsPageHeading?: string;
  resultsPageSubText?: string;
  resultsPageSearchPrompt?: string; // "Enter Your Student ID, System ID or Email"

  // Student Dashboard Page Content
  studentDashboardPageHeading?: string; // Replaces "Student Dashboard"
  studentDashboardWelcomeText?: string; // e.g. "Welcome to your personal dashboard..."
  studentDashboardMyCoursesTitle?: string;
  studentDashboardMyCoursesDesc?: string;
  studentDashboardMyCoursesButtonText?: string; 
  studentDashboardResultsPreviewTitle?: string;
  studentDashboardResultsPreviewDesc?: string;
  studentDashboardResultsPreviewButtonText?: string; 
  studentDashboardPaymentStatusTitle?: string;
  studentDashboardPaymentStatusDesc?: string;
  studentDashboardPaymentStatusButtonText?: string; 
  studentDashboardClassScheduleTitle?: string;
  studentDashboardClassScheduleDesc?: string;
  studentDashboardClassScheduleButtonText?: string; 
  studentDashboardAdminMessagesTitle?: string;
  studentDashboardAdminMessagesDesc?: string;
  studentDashboardAdminMessagesButtonText?: string; 
  studentDashboardPlaceholderImageText?: string;


  // Lecturer Dashboard Page Content
  lecturerDashboardPageHeading?: string; // Replaces "Lecturer Dashboard"
  lecturerDashboardWelcomeText?: string; // e.g. "This is your central hub..."
  lecturerDashboardMyCoursesTitle?: string;
  lecturerDashboardMyCoursesDesc?: string;
  lecturerDashboardMyCoursesButtonText?: string; 
  lecturerDashboardUploadGradesTitle?: string;
  lecturerDashboardUploadGradesDesc?: string;
  lecturerDashboardUploadGradesButtonText?: string; 
  lecturerDashboardViewStudentsTitle?: string;
  lecturerDashboardViewStudentsDesc?: string;
  lecturerDashboardViewStudentsButtonText?: string; 
  lecturerDashboardAnnouncementsTitle?: string;
  lecturerDashboardAnnouncementsDesc?: string;
  lecturerDashboardAnnouncementsButtonText?: string; 
  lecturerDashboardPlaceholderImageText?: string;

  // Application Page Content
  applicationPageMainHeading?: string; // Replaces "Online Application Portal"
  applicationPageSubText?: string; // Can be used for additional instructions
  applicationPageStudentFormHeading?: string;
  applicationPageTeacherFormHeading?: string;

}

export interface StudentResultInfo {
  courseCode: string;
  courseTitle: string;
  credits: number;
  grade?: string;
  enrollmentDate: string;
}

export type CalendarEventType = 'Holiday' | 'Exam' | 'Event' | 'Deadline' | 'Registration';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  description?: string;
  type: CalendarEventType;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string; // ISO date string
  author: string; // e.g., "Admin"
}

export interface Photo {
  id: string;
  title: string;
  description?: string;
  imageUrl: string; // Base64 data URL
  uploadDate: string; // ISO date string
  category?: string; // Added for gallery filtering
}
