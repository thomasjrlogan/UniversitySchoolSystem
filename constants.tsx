
import React from 'react';
import { Page, AppSettings, MobileMoneyOption } from './types';

// Default application settings, to be used if not found in localStorage
export const DEFAULT_APP_SETTINGS: AppSettings = {
  appName: "CHRISTIAN UNIVERSITY COLLEGE (CUC)",
  collegeAddress: "12 House Road Community, Paynesville City, Republic of Liberia",
  collegePhone: "0775909199",
  collegeLogo: "", // No default logo initially
  collegeWhatsApp: "0775909199", // Updated WhatsApp number
  applicationFee: 0,
  
  // Primary Bank
  bankName: "",
  bankAccountName: "",
  bankAccountNumber: "",
  bankSwiftCode: "",
  
  // Mobile Money
  mobileMoneyOptions: [
    { 
      id: 'momo_mtn_default', 
      providerName: 'MTN Mobile Money', 
      accountNumber: '', 
      instructions: 'Dial *156# and follow prompts. Use your Student ID or Application ID as payment reference.', 
      isEnabled: false 
    },
    { 
      id: 'momo_orange_default', 
      providerName: 'Orange Money', 
      accountNumber: '', 
      instructions: 'Dial *140# and follow prompts. Use your Student ID or Application ID as payment reference.', 
      isEnabled: false 
    },
  ] as MobileMoneyOption[],

  // UBA Bank
  ubaBankName: "UBA Bank",
  ubaBankAccountName: "",
  ubaBankAccountNumber: "",
  ubaBankSwiftCode: "",

  // LBDI Bank
  lbtiBankName: "LBDI Bank",
  lbtiBankAccountName: "",
  lbtiBankAccountNumber: "",
  lbtiBankSwiftCode: "",

  // Asset Bank / International Bank (Liberia) Limited
  assetBankName: "International Bank (Liberia) Limited",
  assetBankAccountName: "",
  assetBankAccountNumber: "",
  assetBankSwiftCode: "",

  // Theme & Appearance Defaults
  primaryColor: "sky-600", // Default primary theme color (Tailwind class)
  contentBackgroundTheme: "slate-100", // Default background for content area
  mainTextColor: "text-slate-700", // Default main text color
  headingTextColor: "text-slate-800", // Default heading text color
  fontFamily: "font-sans", // Default font family

  // Email Configuration Defaults
  smtpServer: "",
  smtpPort: 587, // Common default for TLS
  smtpUsername: "",
  smtpPassword: "",
  smtpFromEmail: "",

  // SMS Configuration Defaults
  smsApiUrl: "",
  smsApiKey: "",
  smsSenderId: "",

  // Admin Profile Defaults
  adminUsername: "admin",
  adminEmail: "thomasjrlogan@gmail.com", // Updated admin email
  adminPassword: "admin", // Default password - CHANGE THIS!
  adminDesignation: "System Administrator",
  adminNationalId: "",
  adminPhone: "0775909199",
  adminPresentAddress: "CUC Campus, Paynesville",
  adminPermanentAddress: "CUC Campus, Paynesville",
  adminGender: '',
  adminBloodGroup: "",
  adminReligion: "",
  adminDateOfBirth: "", 
  adminSalaryGrade: "",
  adminSalaryType: "",
  adminOtherInfo: "",
  adminResume: undefined,
  adminJoiningDate: "", 
  adminResignDate: "", 
  adminFacebookUrl: "",
  adminTwitterUrl: "",
  adminLinkedInUrl: "",

  // Public Home Page Content Defaults
  heroTagline: "Your gateway to quality education, innovation, and a brighter future.",
  aboutCardButtonText: "Read More About Us",
  exploreProgramsButtonText: "Explore Our Programs",
  whyChooseHeading: "Why Choose {appName}?",
  whyChooseDescription: "At {appName}, we are committed to providing a transformative educational experience. Our dedicated faculty, state-of-the-art facilities, and focus on practical learning prepare students for successful careers and impactful lives.",
  whyChooseFeature1: "Experienced & Qualified Faculty",
  whyChooseFeature2: "Modern Learning Environment",
  whyChooseFeature3: "Strong Industry Connections",
  whyChooseFeature4: "Focus on Holistic Development",
  publicHomeMobileMoneyCardTitle: "Mobile Money Payment",
  publicHomeMobileMoneyCardDesc: "Conveniently pay your fees using our Mobile Money service.",
  publicHomeMobileMoneyButtonText: "Make a Payment",
  publicHomeYouTubeSectionTitle: "Discover More on Our YouTube Channel",
  publicHomeYouTubeSectionDesc: "Watch our latest campus tours, student testimonials, and event highlights.",
  publicHomeYouTubeVideoUrl: "", // Example: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" - admin should fill this
  publicHomeYouTubeChannelUrl: "https://www.youtube.com/@thomaslogan2918", // Updated YouTube Channel URL
  publicHomeYouTubeButtonText: "Visit Our Channel",


  // Social Media / Chat Integration Defaults
  facebookPageId: "1234567890", // Placeholder - REPLACE WITH ACTUAL PAGE ID for Messenger
  facebookPageUrl: "https://web.facebook.com/thomas.logan.1460", // Updated Facebook Page URL
  facebookThemeColor: "", // Default to Facebook's theme or primaryColor if HEX

  // Contact Us Page Content Defaults
  contactUsPageHeading: "Get In Touch",
  contactUsIntroText: "We're here to help and answer any question you might have. We look forward to hearing from you.", // Default intro
  contactUsSpecificPhone: "0775909199",
  contactUsSpecificFax: "N/A", // Default if no fax
  contactUsSpecificEmail: "info@cuc.edu.lr", // Placeholder general email
  contactUsSpecificAddress: "PAYNESVILLE, LIBERIA",
  contactUsFormHeading: "Send Us a Message",
  contactUsMapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.789128509012!2d-10.741000000000001!3d6.294000000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xf09f64a590a0c69%3A0x8dd3f7893693e506!2sPaynesville%2C%20Liberia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",


  // Event Detail Page (Example Event Content) Defaults
  eventDetailExampleTitle: "Study Tour Example",
  eventDetailExampleCategory: "Academic Trip",
  eventDetailExampleDateRange: "Aug 5, 2024 To Aug 10, 2024",
  eventDetailExampleLocation: "Monrovia & Surroundings",
  eventDetailExampleOrganizer: "University Event Committee",
  eventDetailExamplePublishedDate: "Jul 15, 2024",
  eventDetailExampleDescriptionP1: "An enriching study tour designed to provide students with practical insights and hands-on experience related to their field of study. This tour aims to bridge the gap between theoretical knowledge and real-world applications.",
  eventDetailExampleDescriptionP2: "Participants will engage in site visits, workshops, and interactive sessions with industry experts. It's a fantastic opportunity for learning, networking, and personal development.",
  eventDetailExampleHighlightsHeading: "Event Highlights",
  eventDetailExampleHighlight1: "Visit to key industrial and research facilities.",
  eventDetailExampleHighlight2: "Interactive workshops with leading professionals.",
  eventDetailExampleHighlight3: "Cultural excursions and team-building activities.",
  eventDetailExampleHighlight4: "Networking opportunities with peers and experts.",
  eventDetailExampleDescriptionP3: "This study tour is highly recommended for students seeking to broaden their horizons and gain a competitive edge in their future careers. Don't miss out on this unique learning adventure!",
  eventDetailSidebarLatestEvent1Title: "Annual Sports Gala",
  eventDetailSidebarLatestEvent1Date: "Sep 15, 2024",
  eventDetailSidebarLatestEvent2Title: "Science Exhibition",
  eventDetailSidebarLatestEvent2Date: "Oct 02, 2024",
  eventDetailSidebarLatestEvent3Title: "Convocation Ceremony",
  eventDetailSidebarLatestEvent3Date: "Nov 10, 2024",
  eventDetailSidebarLatestEvent4Title: "Winter Break Activities",
  eventDetailSidebarLatestEvent4Date: "Dec 20, 2024",

  // Authentication Pages Content Defaults
  loginPageMainHeading: "Admin Login",
  signUpPageHeading: "Create New Account",
  signUpPageSubText: "Join our community. Sign up to get started.",
  forgotPasswordPageHeading: "Forgot Your Password?",
  forgotPasswordPageSubText: "No problem. Enter your email address below and we'll send you instructions to reset your password.",

  // Results Page Content Defaults
  resultsPageHeading: "Student Results Portal",
  resultsPageSubText: "Check Your Academic Results",
  resultsPageSearchPrompt: "Enter Your Student ID, System ID or Email",

  // Student Dashboard Page Content Defaults
  studentDashboardPageHeading: "Student Dashboard",
  studentDashboardWelcomeText: "Welcome to your personal dashboard. Manage your studies and stay updated.",
  studentDashboardMyCoursesTitle: "My Courses",
  studentDashboardMyCoursesDesc: "Access your enrolled courses, materials, and assignments.",
  studentDashboardMyCoursesButtonText: "Access My Courses",
  studentDashboardResultsPreviewTitle: "Results Preview",
  studentDashboardResultsPreviewDesc: "View your latest grades and academic performance.",
  studentDashboardResultsPreviewButtonText: "Access Results Preview",
  studentDashboardPaymentStatusTitle: "Payment Status",
  studentDashboardPaymentStatusDesc: "Check your fee payment history and outstanding balances.",
  studentDashboardPaymentStatusButtonText: "Access Payment Status",
  studentDashboardClassScheduleTitle: "Class Schedule",
  studentDashboardClassScheduleDesc: "View your timetable and upcoming classes.",
  studentDashboardClassScheduleButtonText: "Access Class Schedule",
  studentDashboardAdminMessagesTitle: "Admin Messages",
  studentDashboardAdminMessagesDesc: "Read important messages and announcements from the administration.",
  studentDashboardAdminMessagesButtonText: "Access Admin Messages",
  studentDashboardPlaceholderImageText: "Student placeholder",


  // Lecturer Dashboard Page Content Defaults
  lecturerDashboardPageHeading: "Lecturer Dashboard",
  lecturerDashboardWelcomeText: "This is your central hub for managing your academic activities.",
  lecturerDashboardMyCoursesTitle: "My Courses",
  lecturerDashboardMyCoursesDesc: "View and manage the courses you are teaching.",
  lecturerDashboardMyCoursesButtonText: "Go to My Courses",
  lecturerDashboardUploadGradesTitle: "Upload Grades",
  lecturerDashboardUploadGradesDesc: "Enter and update grades for students in your courses.",
  lecturerDashboardUploadGradesButtonText: "Go to Upload Grades",
  lecturerDashboardViewStudentsTitle: "View Enrolled Students",
  lecturerDashboardViewStudentsDesc: "See a list of students enrolled in your courses.",
  lecturerDashboardViewStudentsButtonText: "Go to View Enrolled Students",
  lecturerDashboardAnnouncementsTitle: "Announcements",
  lecturerDashboardAnnouncementsDesc: "Create and view announcements for your students.",
  lecturerDashboardAnnouncementsButtonText: "Go to Announcements",
  lecturerDashboardPlaceholderImageText: "Lecturer placeholder",

  // Application Page Content Defaults
  applicationPageMainHeading: "Online Application Portal",
  applicationPageSubText: "Start your journey with us by completing the application form below.",
  applicationPageStudentFormHeading: "Student Application Form",
  applicationPageTeacherFormHeading: "Teacher Application Form",
};

export const DashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

export const StudentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export const CoursesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a8.487 8.487 0 00-7.303-3.612 8.487 8.487 0 00-7.303 3.612M12 6.253a8.487 8.487 0 017.303-3.612 8.487 8.487 0 017.303 3.612m0-11.494v11.494m7.303-3.612a8.487 8.487 0 00-7.303-3.612M12 17.747v-11.494M4.697 14.135L12 17.747l7.303-3.612M4.697 14.135L12 10.523l7.303 3.612" />
  </svg>
);

export const EnrollmentsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const PhotoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);


export const SettingsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.897.15c.542.09.94.559.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-.897.149c-.424.07-.764.383-.93.78-.164.398-.142.854.108 1.204l.527.738c.32.447.27.96-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.78.93l-.15.897c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.149-.897c-.07-.424-.384-.764-.78-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-.96.27-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.807.108-1.204-.165-.397-.506-.71-.93-.78l-.897-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0 .55.398-1.019.94-1.11l.897-.149c.424-.07.764-.383.93-.78.164-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.149-.896Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const ProfileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.875 1.875 0 0118 22.5H6a1.875 1.875 0 01-1.499-2.382z" />
  </svg>
);


export const LecturerIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m10.116 0L12 12.75m0 0l-2.942 2.772M6.062 18.719a6.062 6.062 0 01-1.584-5.963A11.946 11.946 0 016 12.75c0-1.05.178-2.053.51-3H3a3 3 0 00-3 3v6a3 3 0 003 3h9.346A5.991 5.991 0 0112 18.75m6-6V9a3 3 0 00-3-3H9m6 3a3 3 0 00-3 3v.75m3-3h.008v.008H18V12.75zm0 0h.008v.008H18V12.75zm-3 0h.008v.008H15V12.75zm0 0h.008v.008H15V12.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a3 3 0 110-6 3 3 0 010 6z" />
  </svg>
); 

export const StudentDashboardIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A1.875 1.875 0 0118 22.5H6a1.875 1.875 0 01-1.499-2.382z" />
</svg> 
);

export const UserManagementIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg> 
);

export const CalendarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12v-.008zM12 18h.008v.008H12v-.008zM9 15h.008v.008H9v-.008zM9 18h.008v.008H9v-.008zM6 15h.008v.008H6v-.008zM6 18h.008v.008H6v-.008z" />
  </svg>
);

export const FeesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

export const NewspaperIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.875c0-.621.504-1.125 1.125-1.125H6.75M12 7.5V9m0 3V9m0 3v2.25m0 3v-2.25m0 0l1.5-1.5M12 9l-1.5-1.5m1.5 1.5V7.5M7.5 15h3.75M7.5 18h3.75" />
  </svg>
);

export const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12 7.611 3.75 12.375 3.75 21 7.444 21 12z" />
</svg>
);

export const PaintBrushIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
  </svg>
);

export const EnvelopeIconOutline: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
</svg>
);

export const ChatBubbleLeftRightIconOutline: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.697-3.697c-.020-.019-.040-.039-.059-.059H6.452c-1.136 0-2.1-.847-2.193-1.98A11.954 11.954 0 016 12.009v-4.286c0-.97.616-1.813 1.5-2.097C9.362 5.309 10.643 5 12 5c1.357 0 2.638.309 3.75.811zM10.875 10.875c0 .414.336.75.75.75h.008c.414 0 .75-.336.75-.75v-.008c0-.414-.336.75-.75-.75H11.625c-.414 0-.75.336-.75.75v.008zM10.875 13.125c0 .414.336.75.75.75h.008c.414 0 .75-.336.75-.75v-.008c0-.414-.336.75-.75-.75H11.625c-.414 0-.75.336-.75.75v.008zM13.125 10.875c0 .414.336.75.75.75h.008c.414 0 .75-.336.75-.75v-.008c0-.414-.336.75-.75-.75H13.875c-.414 0-.75.336-.75.75v.008zM13.125 13.125c0 .414.336.75.75.75h.008c.414 0 .75-.336.75-.75v-.008c0-.414-.336.75-.75-.75H13.875c-.414 0-.75.336-.75.75v.008z" />
</svg>
);

export const PresentationChartLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 14.25v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5m-15 0a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 16.5m-15 0vP-2.25A2.25 2.25 0 013.75 12h16.5M3.75 12h16.5m-16.5 0V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v5.25m-16.5 0v-1.5c0-.621.504-1.125 1.125-1.125h13.5c.621 0 1.125.504 1.125 1.125v1.5" />
  </svg>
);

export const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" {...props}>
    <path d="M14 13.5H16.5L17.5 9.5H14V7.5C14 6.47 14 5.5 16 5.5H17.5V2.14C17.174 2.097 15.943 2 14.643 2C11.928 2 10 3.657 10 6.7V9.5H7V13.5H10V22H14V13.5Z" />
  </svg>
);

export const WhatsAppIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" {...props}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.172.198-.296.297-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.47.074-.742.346-.272.272-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.206 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);


export interface NavItem {
  name: Page;
  path: string; // Path for react-router-dom Link
  icon: React.ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { name: Page.Dashboard, path: '/', icon: <DashboardIcon /> },
  { name: Page.Students, path: '/students', icon: <StudentsIcon /> },
  { name: Page.Courses, path: '/courses', icon: <CoursesIcon /> },
  { name: Page.Enrollments, path: '/enrollments', icon: <EnrollmentsIcon /> },
  { name: Page.Gallery, path: '/gallery', icon: <PhotoIcon /> },
  { name: Page.AdminProfile, path: '/admin/profile', icon: <ProfileIcon /> },
  { name: Page.Settings, path: '/admin/settings', icon: <SettingsIcon /> },
];

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
