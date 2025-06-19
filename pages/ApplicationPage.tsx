
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { StudentApplication, TeacherApplication, UploadedFile, AppSettings, Course, MobileMoneyOption } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import {
    AcademicCapIcon, UserPlusIcon, BriefcaseIcon, DocumentArrowUpIcon,
    CheckCircleIcon, XCircleIcon, InformationCircleIcon, CreditCardIcon,
    DevicePhoneMobileIcon, CurrencyDollarIcon, UserCircleIcon as UserPhotoIcon,
    PrinterIcon, EnvelopeIcon, PhoneIcon, CalendarDaysIcon, MapPinIcon,
    IdentificationIcon, BuildingLibraryIcon, DocumentTextIcon, BuildingStorefrontIcon,
    BookOpenIcon, SparklesIcon, ClockIcon, LightBulbIcon, HomeIcon
} from '@heroicons/react/24/outline';

type ApplicationType = 'student' | 'teacher';

interface ApplicationPageProps {
  appSettings: AppSettings;
  courses: Course[];
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const ApplicationPage: React.FC<ApplicationPageProps> = ({ appSettings, courses }) => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState<ApplicationType>('student');

  const [studentApplications, setStudentApplications] = useLocalStorage<StudentApplication[]>('studentApplications', []);
  const [teacherApplications, setTeacherApplications] = useLocalStorage<TeacherApplication[]>('teacherApplications', []);

  const initialStudentData: Omit<StudentApplication, 'id' | 'applicationDate' | 'status'> = {
    fullName: '', email: '', alternativeEmail: '', dateOfBirth: '', phoneNumber: '', address: '',
    programOfInterest: '', selectedCourseId: '',
    previousSchool: '', personalStatement: '',
    passportPhoto: undefined,
    academicTranscripts: undefined, recommendationLetter: undefined,
  };
  const [studentFormData, setStudentFormData] = useState(initialStudentData);
  const [studentFiles, setStudentFiles] = useState<{ passportPhoto?: File, academicTranscripts?: File, recommendationLetter?: File }>({});

  const initialTeacherData: Omit<TeacherApplication, 'id' | 'applicationDate' | 'status'> = {
    fullName: '', email: '', alternativeEmail: '', dateOfBirth: '', phoneNumber: '', address: '',
    highestQualification: '', yearsOfExperience: 0, subjectsSpecialization: '', coverLetter: '',
    passportPhoto: undefined,
    cvResume: undefined, academicCertificates: undefined,
  };
  const [teacherFormData, setTeacherFormData] = useState(initialTeacherData);
  const [teacherFiles, setTeacherFiles] = useState<{ passportPhoto?: File, cvResume?: File, academicCertificates?: File }>({});

  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error', message: string, applicationId?: string, applicationType?: ApplicationType } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo, 
    applicationFee, 
    // Primary Bank
    bankName, bankAccountName, bankAccountNumber, bankSwiftCode, 
    // Mobile Money
    mobileMoneyOptions = [],
    // UBA Bank
    ubaBankName, ubaBankAccountName, ubaBankAccountNumber, ubaBankSwiftCode,
    // LBTI Bank
    lbtiBankName, lbtiBankAccountName, lbtiBankAccountNumber, lbtiBankSwiftCode,
    // Asset Bank
    assetBankName, assetBankAccountName, assetBankAccountNumber, assetBankSwiftCode,
    adminEmail = DEFAULT_APP_SETTINGS.adminEmail,
    applicationPageMainHeading = DEFAULT_APP_SETTINGS.applicationPageMainHeading,
    applicationPageSubText = DEFAULT_APP_SETTINGS.applicationPageSubText,
    applicationPageStudentFormHeading = DEFAULT_APP_SETTINGS.applicationPageStudentFormHeading,
    applicationPageTeacherFormHeading = DEFAULT_APP_SETTINGS.applicationPageTeacherFormHeading,
  } = appSettings;

  const handleStudentInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeacherInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeacherFormData(prev => ({ ...prev, [name]: name === 'yearsOfExperience' ? parseInt(value) || 0 : value }));
  };

  const handleStudentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setStudentFiles(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setStudentFiles(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTeacherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setTeacherFiles(prev => ({ ...prev, [name]: files[0] }));
    } else {
       setTeacherFiles(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const processFileUploads = async (files: Record<string, File | undefined>): Promise<Record<string, UploadedFile | undefined>> => {
    const uploadedFiles: Record<string, UploadedFile | undefined> = {};
    for (const key in files) {
      if (files[key]) {
        const file = files[key] as File;
        const base64Data = await fileToBase64(file);
        uploadedFiles[key] = {
          fileName: file.name,
          fileType: file.type,
          fileData: base64Data,
        };
      }
    }
    return uploadedFiles;
  };

  const validateStudentForm = () => {
    const { fullName, email, dateOfBirth, phoneNumber, address, programOfInterest, previousSchool, personalStatement } = studentFormData;
    if (!fullName || !email || !dateOfBirth || !phoneNumber || !address || !programOfInterest || !previousSchool || !personalStatement) return "All fields marked with * are required.";
    if (!studentFiles.passportPhoto) return "Passport Size Photo is required.";
    if (!studentFiles.academicTranscripts) return "Academic Transcripts are required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format for Primary Email.";
    if (studentFormData.alternativeEmail && !/^\S+@\S+\.\S+$/.test(studentFormData.alternativeEmail)) return "Invalid email format for Alternative Email.";
    return null;
  };

  const validateTeacherForm = () => {
    const { fullName, email, dateOfBirth, phoneNumber, address, highestQualification, subjectsSpecialization, coverLetter } = teacherFormData;
    if (!fullName || !email || !dateOfBirth || !phoneNumber || !address || !highestQualification || !subjectsSpecialization || !coverLetter ) return "All fields are required.";
    if (teacherFormData.yearsOfExperience < 0) return "Years of experience cannot be negative.";
    if (!teacherFiles.passportPhoto) return "Passport Size Photo is required.";
    if (!teacherFiles.cvResume) return "CV/Resume is required.";
    if (!teacherFiles.academicCertificates) return "Academic Certificates are required.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format for Primary Email.";
    if (teacherFormData.alternativeEmail && !/^\S+@\S+\.\S+$/.test(teacherFormData.alternativeEmail)) return "Invalid email format for Alternative Email.";
    return null;
  };

  const sendAdminNotificationEmail = (application: StudentApplication | TeacherApplication, type: 'student' | 'teacher') => {
    const recipient = adminEmail || 'admin@example.com';
    const subject = type === 'student' 
      ? `New Student Application: ${application.fullName}`
      : `New Teacher Application: ${application.fullName}`;
    
    let body = `A new ${type} application has been submitted.\n\n`;
    body += `Applicant Name: ${application.fullName}\n`;
    body += `Email: ${application.email}\n`;
    if (type === 'student') {
      const app = application as StudentApplication;
      body += `Program of Interest: ${app.programOfInterest}\n`;
    } else {
      const app = application as TeacherApplication;
      body += `Highest Qualification: ${app.highestQualification}\n`;
      body += `Specialization: ${app.subjectsSpecialization}\n`;
    }
    body += `Application ID: ${application.id}\n`;
    body += `Date Submitted: ${new Date(application.applicationDate).toLocaleString()}\n\n`;
    body += `--- Please review the full application in the system. ---`;

    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink, '_blank');
  };


  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);
    const validationError = validateStudentForm();
    if (validationError) {
      setSubmissionStatus({ type: 'error', message: validationError });
      return;
    }
    setIsLoading(true);
    const newApplicationId = `stu-app-${Date.now()}`;
    try {
      const uploadedFiles = await processFileUploads(studentFiles) as { passportPhoto?: UploadedFile, academicTranscripts?: UploadedFile, recommendationLetter?: UploadedFile };
      const newApplication: StudentApplication = {
        ...studentFormData,
        id: newApplicationId,
        passportPhoto: uploadedFiles.passportPhoto,
        academicTranscripts: uploadedFiles.academicTranscripts,
        recommendationLetter: uploadedFiles.recommendationLetter,
        applicationDate: new Date().toISOString(),
        status: 'Pending',
      };
      setStudentApplications(prev => [...prev, newApplication]);
      setSubmissionStatus({ type: 'success', message: 'Student application submitted successfully! We will review your application and contact you soon. An email draft to notify the admin should open in your email client.', applicationId: newApplicationId, applicationType: 'student' });
      sendAdminNotificationEmail(newApplication, 'student');
      setStudentFormData(initialStudentData);
      setStudentFiles({});
      (document.getElementById("student-application-form") as HTMLFormElement)?.reset();
    } catch (error) {
      console.error("Error submitting student application:", error);
      setSubmissionStatus({ type: 'error', message: 'Failed to submit application. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);
    const validationError = validateTeacherForm();
    if (validationError) {
      setSubmissionStatus({ type: 'error', message: validationError });
      return;
    }
    setIsLoading(true);
    const newApplicationId = `tea-app-${Date.now()}`;
    try {
      const uploadedFiles = await processFileUploads(teacherFiles) as { passportPhoto?: UploadedFile, cvResume?: UploadedFile, academicCertificates?: UploadedFile };
      const newApplication: TeacherApplication = {
        ...teacherFormData,
        id: newApplicationId,
        passportPhoto: uploadedFiles.passportPhoto,
        cvResume: uploadedFiles.cvResume,
        academicCertificates: uploadedFiles.academicCertificates,
        applicationDate: new Date().toISOString(),
        status: 'Pending',
      };
      setTeacherApplications(prev => [...prev, newApplication]);
      setSubmissionStatus({ type: 'success', message: 'Teacher application submitted successfully! We will review your application and contact you soon. An email draft to notify the admin should open in your email client.', applicationId: newApplicationId, applicationType: 'teacher' });
      sendAdminNotificationEmail(newApplication, 'teacher');
      setTeacherFormData(initialTeacherData);
      setTeacherFiles({});
      (document.getElementById("teacher-application-form") as HTMLFormElement)?.reset();
    } catch (error) {
      console.error("Error submitting teacher application:", error);
      setSubmissionStatus({ type: 'error', message: 'Failed to submit application. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintApplication = useCallback((appId?: string, appType?: ApplicationType) => {
    if (!appId || !appType) {
        alert("Application ID or Type is missing. Cannot print.");
        return;
    }

    let applicationData: StudentApplication | TeacherApplication | undefined;
    let applicationTitleText = '';

    if (appType === 'student') {
        applicationData = studentApplications.find(app => app.id === appId);
        applicationTitleText = "Student Application Summary";
    } else {
        applicationData = teacherApplications.find(app => app.id === appId);
        applicationTitleText = "Teacher Application Summary";
    }

    if (!applicationData) {
        alert("Application data not found. Cannot print.");
        return;
    }

    const { 
        collegeLogo: currentLogo, appName: currentAppName, collegeAddress: currentAddress, collegePhone: currentPhone,
        applicationFee: currentAppFee,
        bankName: primaryBankName, bankAccountName: primaryBankAccountName, bankAccountNumber: primaryBankAccountNumber, bankSwiftCode: primaryBankSwiftCode,
        ubaBankName: currentUbaBankName, ubaBankAccountName: currentUbaAccName, ubaBankAccountNumber: currentUbaAccNum, ubaBankSwiftCode: currentUbaSwift,
        lbtiBankName: currentLbtiBankName, lbtiBankAccountName: currentLbtiAccName, lbtiBankAccountNumber: currentLbtiAccNum, lbtiBankSwiftCode: currentLbtiSwift,
        assetBankName: currentAssetBankName, assetBankAccountName: currentAssetAccName, assetBankAccountNumber: currentAssetAccNum, assetBankSwiftCode: currentAssetSwift,
        mobileMoneyOptions: currentMobileMoneyOptions = []
    } = appSettings;

    const logoHtml = currentLogo
        ? `<img src="${currentLogo}" alt="Logo" style="max-height: 70px; margin-bottom: 10px; object-fit: contain;" />`
        : `<div style="font-size: 24px; font-weight: bold; margin-bottom: 10px;">${currentAppName}</div>`;

    let detailsHtml = '<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">';
    const addRow = (label: string, value: string | number | undefined) => {
        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) return;
        detailsHtml += `<tr><td style="padding: 6px; border: 1px solid #e0e0e0; font-weight: bold; width: 30%; background-color: #f9f9f9; vertical-align: top;">${label}:</td><td style="padding: 6px; border: 1px solid #e0e0e0; vertical-align: top; white-space: pre-wrap;">${value}</td></tr>`;
    };

    addRow("Application ID", applicationData.id);
    addRow("Full Name", applicationData.fullName);
    addRow("Primary Email", applicationData.email);
    if (applicationData.alternativeEmail) {
        addRow("Alternative Email", applicationData.alternativeEmail);
    }
    addRow("Date of Birth", applicationData.dateOfBirth);
    addRow("Phone Number", applicationData.phoneNumber);
    addRow("Address", applicationData.address);

    if (appType === 'student') {
        const app = applicationData as StudentApplication;
        addRow("Program of Interest", app.programOfInterest);
        if (app.selectedCourseId) {
            const selectedCourse = courses.find(c => c.id === app.selectedCourseId);
            if (selectedCourse) {
                addRow("Selected First Course", `${selectedCourse.title} (${selectedCourse.code})`);
            }
        }
        addRow("Previous School", app.previousSchool);
        addRow("Personal Statement", app.personalStatement);
        if (app.passportPhoto) addRow("Passport Photo", `${app.passportPhoto.fileName} (Uploaded)`);
        if (app.academicTranscripts) addRow("Academic Transcripts", `${app.academicTranscripts.fileName} (Uploaded)`);
        if (app.recommendationLetter) addRow("Recommendation Letter", `${app.recommendationLetter.fileName} (Uploaded)`);
    } else {
        const app = applicationData as TeacherApplication;
        addRow("Highest Qualification", app.highestQualification);
        addRow("Years of Experience", app.yearsOfExperience);
        addRow("Subjects Specialization", app.subjectsSpecialization);
        addRow("Cover Letter", app.coverLetter);
        if (app.passportPhoto) addRow("Passport Photo", `${app.passportPhoto.fileName} (Uploaded)`);
        if (app.cvResume) addRow("CV/Resume", `${app.cvResume.fileName} (Uploaded)`);
        if (app.academicCertificates) addRow("Academic Certificates", `${app.academicCertificates.fileName} (Uploaded)`);
    }
    addRow("Application Date", new Date(applicationData.applicationDate).toLocaleDateString());
    addRow("Status", applicationData.status);
    detailsHtml += '</table>';

    let paymentInstructionsHtmlForPrint = '';
    const fee = currentAppFee;
    if (fee && fee > 0) {
        paymentInstructionsHtmlForPrint += `<div style="margin-top: 25px; padding-top: 20px; border-top: 1px dashed #ccc;">`;
        paymentInstructionsHtmlForPrint += `<h3 style="font-size: 16px; font-weight: bold; margin-bottom: 12px; color: #333;">Payment Instructions</h3>`;
        paymentInstructionsHtmlForPrint += `<p style="font-size: 11pt; margin-bottom: 8px;">To complete your application, please pay the non-refundable application fee of <strong>$${fee.toFixed(2)}</strong>.</p>`;
        paymentInstructionsHtmlForPrint += `<p style="font-size: 11pt; margin-bottom: 15px;">Use your <strong>Full Name</strong> or Application ID: <strong>${applicationData.id}</strong> as the payment reference.</p>`;

        const bankDetailsBlock = (title: string, name?: string, accName?: string, accNum?: string, swift?: string) => {
            if (name && accNum && accName) {
                let block = `<div style="margin-bottom: 12px; padding: 12px; border: 1px solid #eee; background-color: #fdfdfd; border-radius: 4px;">`;
                block += `<h4 style="font-size: 12pt; font-weight: bold; margin-top:0; margin-bottom: 8px; color: #444;">${title}:</h4>`;
                block += `<p style="font-size: 10pt; margin-bottom: 3px;"><strong>Bank Name:</strong> ${name}</p>`;
                block += `<p style="font-size: 10pt; margin-bottom: 3px;"><strong>Account Name:</strong> ${accName}</p>`;
                block += `<p style="font-size: 10pt; margin-bottom: 3px;"><strong>Account Number:</strong> ${accNum}</p>`;
                if (swift) block += `<p style="font-size: 10pt; margin-bottom: 3px;"><strong>SWIFT/BIC Code:</strong> ${swift}</p>`;
                block += `</div>`;
                return block;
            }
            return '';
        };
        
        paymentInstructionsHtmlForPrint += bankDetailsBlock('Primary Bank Deposit / Transfer', primaryBankName, primaryBankAccountName, primaryBankAccountNumber, primaryBankSwiftCode);
        paymentInstructionsHtmlForPrint += bankDetailsBlock(currentUbaBankName || 'UBA Bank', currentUbaBankName, currentUbaAccName, currentUbaAccNum, currentUbaSwift);
        paymentInstructionsHtmlForPrint += bankDetailsBlock(currentLbtiBankName || 'LBDI Bank', currentLbtiBankName, currentLbtiAccName, currentLbtiAccNum, currentLbtiSwift);
        paymentInstructionsHtmlForPrint += bankDetailsBlock(currentAssetBankName || 'International Bank', currentAssetBankName, currentAssetAccName, currentAssetAccNum, currentAssetSwift);

        const enabledMobileMoney = currentMobileMoneyOptions.filter(opt => opt.isEnabled && opt.providerName && opt.accountNumber);
        if (enabledMobileMoney.length > 0) {
             enabledMobileMoney.forEach(option => {
                paymentInstructionsHtmlForPrint += `<div style="margin-bottom: 12px; padding: 12px; border: 1px solid #eee; background-color: #fdfdfd; border-radius: 4px;">`;
                paymentInstructionsHtmlForPrint += `<h4 style="font-size: 12pt; font-weight: bold; margin-top:0; margin-bottom: 8px; color: #444;">Mobile Money (${option.providerName}):</h4>`;
                paymentInstructionsHtmlForPrint += `<p style="font-size: 10pt; margin-bottom: 3px;"><strong>Provider:</strong> ${option.providerName}</p>`;
                paymentInstructionsHtmlForPrint += `<p style="font-size: 10pt; margin-bottom: 3px;"><strong>Number:</strong> ${option.accountNumber}</p>`;
                if (option.instructions) {
                    paymentInstructionsHtmlForPrint += `<p style="font-size: 9pt; color: #555; margin-top: 5px;"><strong>Instructions:</strong> ${option.instructions}</p>`;
                } else {
                    paymentInstructionsHtmlForPrint += `<p style="font-size: 9pt; color: #555; margin-top: 5px;">Follow your provider's instructions to send money, using the details above.</p>`;
                }
                paymentInstructionsHtmlForPrint += `</div>`;
            });
        }
        paymentInstructionsHtmlForPrint += `<p style="font-size: 9pt; color: #666; margin-top: 15px;">After payment, please keep your transaction ID and receipt. You may need to inform the accounts office or follow institution's procedure for payment confirmation.</p>`;
        paymentInstructionsHtmlForPrint += `</div>`;
    }

    const printContent = `
        <html>
            <head>
                <title>Application Summary - ${currentAppName}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 25px; color: #222; line-height: 1.5; }
                    .print-header { text-align: center; margin-bottom: 25px; }
                    .print-header img { max-height: 70px; margin-bottom: 10px; object-fit: contain; }
                    .print-header h1 { font-size: 24px; margin: 0; color: #000; }
                    .print-header p.address-phone { font-size: 11px; margin: 3px 0; color: #444; }
                    .print-header h2.app-title { font-size: 20px; margin-top: 20px; margin-bottom: 8px; color: #000; text-transform: uppercase; letter-spacing: 0.5px;}
                    hr.divider { border: none; border-top: 1px solid #ccc; margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; font-size: 10pt; }
                    td { padding: 8px; border: 1px solid #ddd; text-align: left; vertical-align: top; word-break: break-word; }
                    td:first-child { font-weight: bold; width: 30%; background-color: #f7f7f7; }
                </style>
            </head>
            <body>
                <div class="print-header">
                    ${logoHtml}
                    <h1>${currentAppName}</h1>
                    ${currentAddress ? `<p class="address-phone">${currentAddress}</p>` : ''}
                    ${currentPhone ? `<p class="address-phone">Tel: ${currentPhone}</p>` : ''}
                    <h2 class="app-title">${applicationTitleText}</h2>
                    <hr class="divider" />
                </div>
                ${detailsHtml}
                ${paymentInstructionsHtmlForPrint}
                <p style="text-align: center; margin-top: 30px; font-size: 9pt; color: #888;">Printed on: ${new Date().toLocaleString()}</p>
            </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    } else {
        alert("Failed to open print window. Please check your browser's pop-up settings.");
    }
  }, [studentApplications, teacherApplications, appSettings, courses]);

  const renderFileInput = (id: string, label: string, currentFile: File | undefined, accept: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required: boolean = false, icon?: React.ReactNode) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        <span className="flex items-center">
            {icon || <DocumentArrowUpIcon className="h-5 w-5 mr-1.5 text-slate-400" />}
            {label} {required && <span className="text-red-500 ml-1">*</span>}
        </span>
      </label>
      <div className="mt-1 flex items-center">
        <label
          htmlFor={id}
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 flex items-center"
        >
          <DocumentArrowUpIcon className="h-5 w-5 inline-block mr-2 text-slate-500" />
          Choose file
        </label>
        <input id={id} name={id} type="file" className="sr-only" onChange={onChange} accept={accept} aria-describedby={`${id}-filename`} />
        {currentFile && <span id={`${id}-filename`} className="ml-3 text-sm text-gray-500 truncate max-w-xs">{currentFile.name}</span>}
        {!currentFile && !required && <span id={`${id}-filename`} className="ml-3 text-sm text-gray-400">Optional</span>}
         {!currentFile && required && <span id={`${id}-filename`} className="ml-3 text-sm text-red-400">Required</span>}
      </div>
    </div>
  );

  const showPaymentInstructions = submissionStatus?.type === 'success' && applicationFee && applicationFee > 0;

  const FormInputLabel: React.FC<{ htmlFor: string, text: string, icon?: React.ReactNode, required?: boolean }> = ({ htmlFor, text, icon, required }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      <span className="flex items-center">
        {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<React.SVGProps<SVGSVGElement>>, { className: "h-5 w-5 mr-1.5 text-slate-400" }) : icon}
        {text} {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </label>
  );

  const renderBankDetails = (bName?: string, bAccName?: string, bAccNum?: string, bSwift?: string, defaultTitle?: string) => {
    if (bAccNum && bName && bAccName) {
      return (
        <div className="mb-4 p-3 border rounded-md bg-white">
          <h4 className="font-semibold text-sky-600 mb-1 flex items-center"><CreditCardIcon className="h-5 w-5 mr-2"/>{bName || defaultTitle}:</h4>
          <p className="text-xs"><strong>Account Name:</strong> {bAccName}</p>
          <p className="text-xs"><strong>Account Number:</strong> {bAccNum}</p>
          {bSwift && <p className="text-xs"><strong>SWIFT/BIC Code:</strong> {bSwift}</p>}
        </div>
      );
    }
    return null;
  };
  
  const renderMobileMoneyOptionDetails = (option: MobileMoneyOption) => {
    return (
      <div key={option.id} className="mb-3 p-3 border rounded-md bg-white">
          <h4 className="font-semibold text-sky-600 mb-1 flex items-center">
            <DevicePhoneMobileIcon className="h-5 w-5 mr-2"/>{option.providerName}:
          </h4>
          <p className="text-xs"><strong>Account Number:</strong> {option.accountNumber}</p>
          {option.instructions && <p className="text-xs italic text-slate-500 mt-1">{option.instructions}</p>}
      </div>
    );
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
        <p className="text-xl text-slate-600 mt-1">{applicationPageMainHeading}</p>
        {applicationPageSubText && <p className="text-sm text-slate-500 mt-1">{applicationPageSubText}</p>}
      </header>

      <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-0 sm:space-x-4" aria-label="Tabs">
            <button
              onClick={() => { setActiveForm('student'); setSubmissionStatus(null);}}
              className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base flex items-center
                ${activeForm === 'student' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={activeForm === 'student' ? 'page' : undefined}
            >
              <UserPlusIcon className={`h-5 w-5 mr-2 ${activeForm === 'student' ? 'text-sky-500' : 'text-gray-400'}`} />
              Apply as Student
            </button>
            <button
              onClick={() => { setActiveForm('teacher'); setSubmissionStatus(null); }}
              className={`whitespace-nowrap py-3 px-2 sm:px-4 border-b-2 font-medium text-sm sm:text-base flex items-center
                ${activeForm === 'teacher' ? 'border-sky-500 text-sky-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              aria-current={activeForm === 'teacher' ? 'page' : undefined}
            >
              <BriefcaseIcon className={`h-5 w-5 mr-2 ${activeForm === 'teacher' ? 'text-sky-500' : 'text-gray-400'}`} />
              Apply as Teacher
            </button>
          </nav>
        </div>

        {submissionStatus && (
          <div
            role="alert"
            className={`p-4 mb-6 rounded-md text-sm ${submissionStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            <div className="flex items-start">
                {submissionStatus.type === 'success' ?
                <CheckCircleIcon className="h-5 w-5 inline mr-2 mt-0.5 flex-shrink-0" /> :
                <XCircleIcon className="h-5 w-5 inline mr-2 mt-0.5 flex-shrink-0" />
                }
                <div>
                    {submissionStatus.message}
                    {submissionStatus.applicationId && <p className="mt-1 text-xs">Your Application ID: <strong className="font-semibold">{submissionStatus.applicationId}</strong>. Please save this for your records.</p>}
                </div>
            </div>
            {submissionStatus.type === 'success' && submissionStatus.applicationId && (
                 <Button
                    variant="secondary"
                    onClick={() => handlePrintApplication(submissionStatus.applicationId, submissionStatus.applicationType)}
                    leftIcon={<PrinterIcon className="h-5 w-5" />}
                    className="mt-3 w-full sm:w-auto"
                >
                    Print Application Summary
                </Button>
            )}
          </div>
        )}

        {showPaymentInstructions && submissionStatus?.applicationId && (
            <div id="payment-instructions-section" className="p-4 mb-6 rounded-md border border-sky-300 bg-sky-50 text-slate-700">
                <h3 className="text-lg font-semibold text-sky-700 mb-3 flex items-center">
                    <CurrencyDollarIcon className="h-6 w-6 mr-2"/> Application Fee Payment
                </h3>
                <p className="text-sm mb-2">
                    To complete your application, please pay the non-refundable application fee of <strong>${applicationFee?.toFixed(2)}</strong>.
                </p>
                <p className="text-sm mb-3">
                    Use your <strong>Full Name</strong> or Application ID: <strong>{submissionStatus.applicationId}</strong> as the payment reference.
                </p>

                {renderBankDetails(bankName, bankAccountName, bankAccountNumber, bankSwiftCode, "Primary Bank")}
                {renderBankDetails(ubaBankName, ubaBankAccountName, ubaBankAccountNumber, ubaBankSwiftCode, "UBA Bank")}
                {renderBankDetails(lbtiBankName, lbtiBankAccountName, lbtiBankAccountNumber, lbtiBankSwiftCode, "LBDI Bank")}
                {renderBankDetails(assetBankName, assetBankAccountName, assetBankAccountNumber, assetBankSwiftCode, "International Bank (Liberia) Ltd")}
                
                {mobileMoneyOptions.filter(opt => opt.isEnabled).map(renderMobileMoneyOptionDetails)}
                
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm flex items-start">
                    <InformationCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"/>
                    <div>
                    <strong>Important:</strong> All payments are manual. After completing the transaction, please keep your transaction ID and receipt. You may need to inform the accounts office or follow your institution's specific procedure for payment confirmation.
                    </div>
                </div>
            </div>
        )}


        {!submissionStatus || submissionStatus.type === 'error' || !showPaymentInstructions ? (
          <>
            {activeForm === 'student' && (
              <form id="student-application-form" onSubmit={handleStudentSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">{applicationPageStudentFormHeading}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInputLabel htmlFor="s-fullName" text="Full Name" icon={<UserPhotoIcon />} required />
                    <Input id="s-fullName" name="fullName" value={studentFormData.fullName} onChange={handleStudentInputChange} required />
                  </div>
                  <div>
                    <FormInputLabel htmlFor="s-email" text="Primary Email Address" icon={<EnvelopeIcon />} required />
                    <Input id="s-email" name="email" type="email" value={studentFormData.email} onChange={handleStudentInputChange} required />
                  </div>
                </div>
                <div>
                  <FormInputLabel htmlFor="s-alternativeEmail" text="Alternative Email Address (Optional)" icon={<EnvelopeIcon />} />
                  <Input id="s-alternativeEmail" name="alternativeEmail" type="email" value={studentFormData.alternativeEmail || ''} onChange={handleStudentInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInputLabel htmlFor="s-dateOfBirth" text="Date of Birth" icon={<CalendarDaysIcon />} required />
                    <Input id="s-dateOfBirth" name="dateOfBirth" type="date" value={studentFormData.dateOfBirth} onChange={handleStudentInputChange} required />
                  </div>
                  <div>
                    <FormInputLabel htmlFor="s-phoneNumber" text="Phone Number" icon={<PhoneIcon />} required />
                    <Input id="s-phoneNumber" name="phoneNumber" type="tel" value={studentFormData.phoneNumber} onChange={handleStudentInputChange} required />
                  </div>
                </div>
                <div>
                  <FormInputLabel htmlFor="s-address" text="Full Address" icon={<HomeIcon />} required />
                  <Textarea id="s-address" name="address" value={studentFormData.address} onChange={handleStudentInputChange} required />
                </div>
                <div>
                  <FormInputLabel htmlFor="s-programOfInterest" text="Program of Interest" icon={<AcademicCapIcon />} required />
                  <Input id="s-programOfInterest" name="programOfInterest" value={studentFormData.programOfInterest} onChange={handleStudentInputChange} required placeholder="e.g., Bachelor of Business Administration, Diploma in IT"/>
                </div>
                <div>
                  <FormInputLabel htmlFor="s-selectedCourseId" text="Specific First Course Choice (Optional)" icon={<BookOpenIcon />} />
                  <select
                    id="s-selectedCourseId"
                    name="selectedCourseId"
                    value={studentFormData.selectedCourseId}
                    onChange={handleStudentInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  >
                    <option value="">-- Select a Course (Optional) --</option>
                    {courses.sort((a,b) => a.title.localeCompare(b.title)).map(course => (
                      <option key={course.id} value={course.id}>{course.title} ({course.code})</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">If you have a specific first course in mind, select it here. Otherwise, your 'Program of Interest' will guide placement.</p>
                </div>
                <div>
                  <FormInputLabel htmlFor="s-previousSchool" text="Previous School/College" icon={<BuildingStorefrontIcon />} required />
                  <Input id="s-previousSchool" name="previousSchool" value={studentFormData.previousSchool} onChange={handleStudentInputChange} required />
                </div>
                <div>
                    <FormInputLabel htmlFor="s-personalStatement" text="Personal Statement" icon={<SparklesIcon />} required />
                    <Textarea id="s-personalStatement" name="personalStatement" rows={5} value={studentFormData.personalStatement} onChange={handleStudentInputChange} required />
                </div>

                <h3 className="text-lg font-medium text-slate-600 pt-2 border-t mt-6">Upload Documents</h3>
                {renderFileInput('passportPhoto', 'Passport Size Photo (.jpg, .png)', studentFiles.passportPhoto, ".jpg,.jpeg,.png,image/jpeg,image/png", handleStudentFileChange, true, <UserPhotoIcon />)}
                {renderFileInput('academicTranscripts', 'Academic Transcripts (.pdf, .doc, .docx, .jpg, .png)', studentFiles.academicTranscripts, ".pdf,.doc,.docx,.jpg,.png,image/*", handleStudentFileChange, true, <DocumentTextIcon />)}
                {renderFileInput('recommendationLetter', 'Letter of Recommendation (Optional)', studentFiles.recommendationLetter, ".pdf,.doc,.docx,.jpg,.png,image/*", handleStudentFileChange, false, <DocumentTextIcon />)}

                <div className="pt-6 flex justify-end space-x-3 border-t">
                  <Button type="button" variant="ghost" onClick={() => navigate('/login')}>Back to Login</Button>
                  <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Student Application'}
                  </Button>
                </div>
              </form>
            )}

            {activeForm === 'teacher' && (
              <form id="teacher-application-form" onSubmit={handleTeacherSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-700 mb-4">{applicationPageTeacherFormHeading}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                    <FormInputLabel htmlFor="t-fullName" text="Full Name" icon={<UserPhotoIcon />} required />
                    <Input id="t-fullName" name="fullName" value={teacherFormData.fullName} onChange={handleTeacherInputChange} required />
                  </div>
                  <div>
                    <FormInputLabel htmlFor="t-email" text="Primary Email Address" icon={<EnvelopeIcon />} required />
                    <Input id="t-email" name="email" type="email" value={teacherFormData.email} onChange={handleTeacherInputChange} required />
                  </div>
                </div>
                <div>
                 <FormInputLabel htmlFor="t-alternativeEmail" text="Alternative Email Address (Optional)" icon={<EnvelopeIcon />} />
                 <Input id="t-alternativeEmail" name="alternativeEmail" type="email" value={teacherFormData.alternativeEmail || ''} onChange={handleTeacherInputChange} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormInputLabel htmlFor="t-dateOfBirth" text="Date of Birth" icon={<CalendarDaysIcon />} required />
                    <Input id="t-dateOfBirth" name="dateOfBirth" type="date" value={teacherFormData.dateOfBirth} onChange={handleTeacherInputChange} required />
                  </div>
                  <div>
                    <FormInputLabel htmlFor="t-phoneNumber" text="Phone Number" icon={<PhoneIcon />} required />
                    <Input id="t-phoneNumber" name="phoneNumber" type="tel" value={teacherFormData.phoneNumber} onChange={handleTeacherInputChange} required />
                  </div>
                </div>
                <div>
                  <FormInputLabel htmlFor="t-address" text="Full Address" icon={<HomeIcon />} required />
                  <Textarea id="t-address" name="address" value={teacherFormData.address} onChange={handleTeacherInputChange} required />
                </div>
                <div>
                  <FormInputLabel htmlFor="t-highestQualification" text="Highest Qualification" icon={<AcademicCapIcon />} required />
                  <Input id="t-highestQualification" name="highestQualification" value={teacherFormData.highestQualification} onChange={handleTeacherInputChange} required />
                </div>
                <div>
                  <FormInputLabel htmlFor="t-yearsOfExperience" text="Years of Experience" icon={<ClockIcon />} required />
                  <Input id="t-yearsOfExperience" name="yearsOfExperience" type="number" min="0" value={teacherFormData.yearsOfExperience.toString()} onChange={handleTeacherInputChange} required />
                </div>
                <div>
                  <FormInputLabel htmlFor="t-subjectsSpecialization" text="Subject(s) of Specialization" icon={<LightBulbIcon />} required />
                  <Input id="t-subjectsSpecialization" name="subjectsSpecialization" value={teacherFormData.subjectsSpecialization} onChange={handleTeacherInputChange} required />
                </div>
                <div>
                  <FormInputLabel htmlFor="t-coverLetter" text="Cover Letter" icon={<SparklesIcon />} required />
                  <Textarea id="t-coverLetter" name="coverLetter" rows={5} value={teacherFormData.coverLetter} onChange={handleTeacherInputChange} required />
                </div>

                <h3 className="text-lg font-medium text-slate-600 pt-2 border-t mt-6">Upload Documents</h3>
                {renderFileInput('passportPhoto', 'Passport Size Photo (.jpg, .png)', teacherFiles.passportPhoto, ".jpg,.jpeg,.png,image/jpeg,image/png", handleTeacherFileChange, true, <UserPhotoIcon />)}
                {renderFileInput('cvResume', 'CV/Resume (.pdf, .doc, .docx)', teacherFiles.cvResume, ".pdf,.doc,.docx", handleTeacherFileChange, true, <DocumentTextIcon />)}
                {renderFileInput('academicCertificates', 'Academic Certificates (.pdf, .jpg, .png)', teacherFiles.academicCertificates, ".pdf,.jpg,.png,image/*", handleTeacherFileChange, true, <DocumentTextIcon />)}

                <div className="pt-6 flex justify-end space-x-3 border-t">
                  <Button type="button" variant="ghost" onClick={() => navigate('/login')}>Back to Login</Button>
                  <Button type="submit" variant="primary" isLoading={isLoading} disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Teacher Application'}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="pt-6 flex justify-center border-t">
             <Button variant="primary" onClick={() => {
                 setSubmissionStatus(null);
                 if (activeForm === 'student') {
                     setStudentFormData(initialStudentData);
                     setStudentFiles({});
                 } else {
                     setTeacherFormData(initialTeacherData);
                     setTeacherFiles({});
                 }
                 const studentForm = document.getElementById("student-application-form") as HTMLFormElement;
                 if (studentForm) studentForm.reset();
                 const teacherForm = document.getElementById("teacher-application-form") as HTMLFormElement;
                 if (teacherForm) teacherForm.reset();

             }}>
                Submit Another Application
            </Button>
          </div>
        )}
      </div>
       <p className="text-center text-xs text-slate-500 mt-10">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
    </div>
  );
};

export default ApplicationPage;
