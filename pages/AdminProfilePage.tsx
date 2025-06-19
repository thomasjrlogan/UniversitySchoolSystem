
import React, { useState, useEffect } from 'react';
import { AppSettings, UploadedFile } from '../types';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import { 
    UserCircleIcon, IdentificationIcon, EnvelopeIcon, PhoneIcon, HomeIcon, BriefcaseIcon, CalendarDaysIcon, 
    CurrencyDollarIcon, LinkIcon, DocumentTextIcon, PencilIcon, SparklesIcon, TrashIcon, PhotoIcon as PhotoPlaceholderIcon,
    ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { DEFAULT_APP_SETTINGS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

interface AdminProfilePageProps {
  appSettings: AppSettings;
  setAppSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  headingTextColor?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const AdminProfilePage: React.FC<AdminProfilePageProps> = ({ appSettings, setAppSettings, headingTextColor: pageHeadingColor }) => {
  const [formData, setFormData] = useState<Partial<AppSettings>>(appSettings);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | undefined>(appSettings.adminResume?.fileData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    setFormData(appSettings);
    setResumePreview(appSettings.adminResume?.fileData);
  }, [appSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResumeFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file); // Store the file object
      // For preview, if it's an image, show it. Otherwise, maybe just filename or a generic icon.
      // For simplicity, we won't try to preview non-image resumes here.
      if (file.type.startsWith('image/')) {
        const base64 = await fileToBase64(file);
        setResumePreview(base64);
      } else {
        setResumePreview(`File: ${file.name} (preview not available)`);
      }
    } else {
      setResumeFile(null);
      setResumePreview(appSettings.adminResume?.fileData); // Revert to original if cancelled
    }
  };
  
  const handleRemoveResume = () => {
    setResumeFile(null);
    setResumePreview(undefined);
    setFormData(prev => ({...prev, adminResume: undefined}));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    let updatedAppSettings = { ...formData };

    if (resumeFile) {
      try {
        const base64Data = await fileToBase64(resumeFile);
        updatedAppSettings.adminResume = {
          fileName: resumeFile.name,
          fileType: resumeFile.type,
          fileData: base64Data,
        };
      } catch (error) {
        console.error("Error processing resume file:", error);
        setSaveStatus({ type: 'error', message: "Failed to process resume file. Profile not saved." });
        setIsSaving(false);
        return;
      }
    } else if (!resumePreview && appSettings.adminResume) { 
      // This means the resume was explicitly removed and not replaced
      updatedAppSettings.adminResume = undefined;
    }


    // Ensure appName is not accidentally cleared if not on this form explicitly
    updatedAppSettings.appName = appSettings.appName; 
    updatedAppSettings.adminUsername = appSettings.adminUsername; // Username is not editable here

    setTimeout(() => { // Simulate API call
      setAppSettings(prev => ({ ...prev, ...updatedAppSettings }));
      setIsSaving(false);
      setSaveStatus({ type: 'success', message: 'Profile updated successfully.' });
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };
  
  const currentPrimaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-600';
   const getHoverColor = (color: string) => {
    if (color.includes('-')) { 
        const parts = color.split('-');
        const shade = parseInt(parts[1]);
        if (!isNaN(shade) && shade < 900) return `${parts[0]}-${Math.min(900, shade + 100)}`;
    }
    return color; 
  };
  const saveButtonCustomStyle = {
      backgroundColor: currentPrimaryColor.startsWith('#') ? currentPrimaryColor : undefined,
  };
   const saveButtonClassName = currentPrimaryColor.startsWith('#') 
    ? `text-white focus:ring-2 focus:ring-offset-2 focus:ring-[${currentPrimaryColor}]` 
    : `bg-${currentPrimaryColor} hover:bg-${getHoverColor(currentPrimaryColor)} text-white focus:ring-${currentPrimaryColor.split('-')[0]}-500`;


  const dynamicHeadingStyle = pageHeadingColor?.startsWith('#') ? { color: pageHeadingColor } : {};
  const dynamicHeadingClass = pageHeadingColor?.startsWith('#') ? '' : pageHeadingColor;


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>My Profile</h2>
        <Button 
            onClick={handleSaveProfile} 
            isLoading={isSaving} 
            disabled={isSaving}
            leftIcon={<ArrowDownTrayIcon className="h-5 w-5"/>}
            className={`w-full sm:w-auto ${saveButtonClassName}`}
            style={saveButtonCustomStyle}
        >
          {isSaving ? 'Saving Profile...' : 'Update Profile'}
        </Button>
      </div>

      {saveStatus && (
        <div role="alert" className={`border-l-4 p-4 rounded-md ${saveStatus.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
          <p className="font-bold">{saveStatus.type === 'success' ? 'Success!' : 'Error!'}</p>
          <p>{saveStatus.message}</p>
        </div>
      )}

      {/* Personal Details Card */}
      <Card title="Personal Details" className="shadow-lg">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input label="Full Name (Username)" id="adminUsername" name="adminUsername" value={formData.adminUsername || ''} readOnly disabled icon={<UserCircleIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Email" id="adminEmail" name="adminEmail" value={formData.adminEmail || ''} readOnly disabled icon={<EnvelopeIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Designation" id="adminDesignation" name="adminDesignation" value={formData.adminDesignation || ''} onChange={handleInputChange} placeholder="e.g., Office Management" icon={<BriefcaseIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="National ID" id="adminNationalId" name="adminNationalId" value={formData.adminNationalId || ''} onChange={handleInputChange} placeholder="e.g., 3740505931861" icon={<IdentificationIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Phone Number" id="adminPhone" name="adminPhone" type="tel" value={formData.adminPhone || ''} onChange={handleInputChange} placeholder="e.g., 03235210704" icon={<PhoneIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Date of Birth" id="adminDateOfBirth" name="adminDateOfBirth" type="date" value={formData.adminDateOfBirth || ''} onChange={handleInputChange} icon={<CalendarDaysIcon className="h-5 w-5 text-slate-400"/>} />
          <div>
            <label htmlFor="adminGender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select id="adminGender" name="adminGender" value={formData.adminGender || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <Input label="Blood Group" id="adminBloodGroup" name="adminBloodGroup" value={formData.adminBloodGroup || ''} onChange={handleInputChange} placeholder="e.g., O+" />
          <Input label="Religion" id="adminReligion" name="adminReligion" value={formData.adminReligion || ''} onChange={handleInputChange} placeholder="e.g., Islam" />
          <Textarea label="Present Address" id="adminPresentAddress" name="adminPresentAddress" value={formData.adminPresentAddress || ''} onChange={handleInputChange} rows={2} placeholder="Current residential address" className="md:col-span-2" />
          <Textarea label="Permanent Address" id="adminPermanentAddress" name="adminPermanentAddress" value={formData.adminPermanentAddress || ''} onChange={handleInputChange} rows={2} placeholder="Permanent home address" className="md:col-span-2" />
        </div>
      </Card>

      {/* Professional Information Card */}
      <Card title="Professional Information" className="shadow-lg">
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input label="Joining Date" id="adminJoiningDate" name="adminJoiningDate" type="date" value={formData.adminJoiningDate || ''} onChange={handleInputChange} icon={<CalendarDaysIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Resign Date (if applicable)" id="adminResignDate" name="adminResignDate" type="date" value={formData.adminResignDate || ''} onChange={handleInputChange} icon={<CalendarDaysIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Salary Grade" id="adminSalaryGrade" name="adminSalaryGrade" value={formData.adminSalaryGrade || ''} onChange={handleInputChange} placeholder="e.g., Grade 5" icon={<CurrencyDollarIcon className="h-5 w-5 text-slate-400"/>} />
          <Input label="Salary Type" id="adminSalaryType" name="adminSalaryType" value={formData.adminSalaryType || ''} onChange={handleInputChange} placeholder="e.g., Monthly, Contractual" />
        </div>
      </Card>
      
      {/* Social Information Card */}
      <Card title="Social Information" className="shadow-lg">
         <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input label="Facebook Profile URL" id="adminFacebookUrl" name="adminFacebookUrl" type="url" value={formData.adminFacebookUrl || ''} onChange={handleInputChange} placeholder="https://facebook.com/yourprofile" icon={<LinkIcon className="h-5 w-5 text-slate-400"/>} />
            <Input label="Twitter (X) Profile URL" id="adminTwitterUrl" name="adminTwitterUrl" type="url" value={formData.adminTwitterUrl || ''} onChange={handleInputChange} placeholder="https://x.com/yourprofile" icon={<LinkIcon className="h-5 w-5 text-slate-400"/>} />
            <Input label="LinkedIn Profile URL" id="adminLinkedInUrl" name="adminLinkedInUrl" type="url" value={formData.adminLinkedInUrl || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/yourprofile" icon={<LinkIcon className="h-5 w-5 text-slate-400"/>} />
         </div>
      </Card>

      {/* Other Information & Resume Card */}
      <Card title="Other Information & Resume" className="shadow-lg">
        <div className="p-5 space-y-4">
          <Textarea label="Other Information" id="adminOtherInfo" name="adminOtherInfo" value={formData.adminOtherInfo || ''} onChange={handleInputChange} rows={3} placeholder="Any other relevant information..." icon={<SparklesIcon className="h-5 w-5 text-slate-400"/>} />
          <div>
            <label htmlFor="adminResume" className="block text-sm font-medium text-gray-700 mb-1">Resume/CV</label>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              {resumePreview && resumePreview.startsWith('data:image/') && (
                <img src={resumePreview} alt="Resume Preview" className="h-20 w-auto object-contain bg-slate-100 p-1 rounded border"/>
              )}
              {resumePreview && !resumePreview.startsWith('data:image/') && resumePreview.startsWith('File:') && (
                <span className="text-sm text-slate-600 bg-slate-100 p-2 rounded border">{resumePreview}</span>
              )}
              {!resumePreview && !appSettings.adminResume?.fileName && (
                 <div className="h-20 w-28 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 border">
                  <PhotoPlaceholderIcon className="h-8 w-8" />
                </div>
              )}
               {appSettings.adminResume?.fileName && !resumePreview && (
                 <span className="text-sm text-slate-600 bg-slate-100 p-2 rounded border">Current: {appSettings.adminResume.fileName}</span>
               )}

              <input
                type="file"
                id="adminResume"
                name="adminResume"
                accept=".pdf,.doc,.docx,image/*"
                onChange={handleResumeFileChange}
                className="block w-full max-w-xs text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100"
              />
              {(resumePreview || appSettings.adminResume) && (
                 <Button variant="ghost" size="sm" onClick={handleRemoveResume} leftIcon={<TrashIcon className="h-4 w-4"/>} className="!text-red-600 hover:!bg-red-50">
                    Remove Resume
                 </Button>
              )}
            </div>
             {resumeFile && <p className="text-xs text-slate-500 mt-1">New file selected: {resumeFile.name}</p>}
             <p className="text-xs text-slate-500 mt-1">Upload PDF, DOC, DOCX, or image file.</p>
          </div>
        </div>
      </Card>
       <div className="mt-6 flex justify-end">
        <Button 
            onClick={handleSaveProfile} 
            isLoading={isSaving} 
            disabled={isSaving}
            leftIcon={<ArrowDownTrayIcon className="h-5 w-5"/>}
            className={`w-full sm:w-auto ${saveButtonClassName}`}
            style={saveButtonCustomStyle}
        >
          {isSaving ? 'Saving Profile...' : 'Update Profile'}
        </Button>
      </div>
    </div>
  );
};

export default AdminProfilePage;