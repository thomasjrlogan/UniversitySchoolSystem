
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { AppSettings, MobileMoneyOption } from '../types';
import { isGeminiApiKeyConfigured } from '../services/geminiService';
import { 
    InformationCircleIcon, PhoneIcon, BuildingOffice2Icon, KeyIcon, 
    CheckCircleIcon, XCircleIcon, PhotoIcon, LinkIcon, ArrowDownTrayIcon, 
    CreditCardIcon, DevicePhoneMobileIcon, CurrencyDollarIcon, PaintBrushIcon, 
    EnvelopeIcon as EnvelopeOutlineIcon, ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconOutline,
    UserCircleIcon, AdjustmentsHorizontalIcon, PencilSquareIcon, SparklesIcon, ShareIcon,
    GlobeAltIcon, ChatBubbleBottomCenterTextIcon as PageContentIcon, CalendarIcon as EventContentIcon, LockClosedIcon as AuthContentIcon, ComputerDesktopIcon as PortalContentIcon,
    BanknotesIcon, PlusCircleIcon, TrashIcon, VideoCameraIcon 
} from '@heroicons/react/24/outline'; 
import Input from '../components/Input';
import Button from '../components/Button';
import { DEFAULT_APP_SETTINGS } from '../constants'; 
import Textarea from '../components/Textarea'; 

interface AdminSettingsPageProps {
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

const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ appSettings, setAppSettings, headingTextColor: pageHeadingColor }) => {
  const geminiConfigured = isGeminiApiKeyConfigured();
  const [currentSettings, setCurrentSettings] = useState<AppSettings>(appSettings);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(appSettings.collegeLogo);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // States for password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  useEffect(() => {
    setCurrentSettings(appSettings);
    setLogoPreview(appSettings.collegeLogo);
  }, [appSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { 
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number' && e.target instanceof HTMLInputElement) { 
        processedValue = parseFloat(value) || 0;
        if (name === 'smtpPort' && processedValue < 0) processedValue = 0;
        if (name === 'applicationFee' && processedValue < 0) processedValue = 0;
    }
    
    setCurrentSettings(prev => ({
       ...prev, 
       [name]: processedValue
    }));
  };

  const handleMobileMoneyOptionChange = (index: number, field: keyof MobileMoneyOption, value: string | boolean) => {
    const updatedOptions = [...currentSettings.mobileMoneyOptions];
    updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    setCurrentSettings(prev => ({ ...prev, mobileMoneyOptions: updatedOptions }));
  };

  const addMobileMoneyOption = () => {
    const newOption: MobileMoneyOption = {
      id: `momo_${Date.now()}`,
      providerName: '',
      accountNumber: '',
      instructions: '',
      isEnabled: false,
    };
    setCurrentSettings(prev => ({
      ...prev,
      mobileMoneyOptions: [...(prev.mobileMoneyOptions || []), newOption]
    }));
  };

  const removeMobileMoneyOption = (index: number) => {
    if (window.confirm("Are you sure you want to remove this mobile money option?")) {
      const updatedOptions = currentSettings.mobileMoneyOptions.filter((_, i) => i !== index);
      setCurrentSettings(prev => ({ ...prev, mobileMoneyOptions: updatedOptions }));
    }
  };


  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        setLogoPreview(base64);
        setCurrentSettings(prev => ({ ...prev, collegeLogo: base64 }));
      } catch (error) {
        console.error("Error converting logo to Base64:", error);
        alert("Error processing logo file. Please try another image.");
        setLogoPreview(currentSettings.collegeLogo); 
         if (e.target) e.target.value = ''; 
      }
    }
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview(undefined);
    setCurrentSettings(prev => ({...prev, collegeLogo: undefined}));
  }

  const handleSaveSettings = () => {
    setIsSaving(true);
    setSaveStatus(null);

    let finalSettings = { ...currentSettings };

    // Password change logic
    if (newPassword) { // Attempting password change
        if (currentPassword !== appSettings.adminPassword) {
            setSaveStatus({ type: 'error', message: "Current password does not match. Profile changes not saved." });
            setIsSaving(false);
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setSaveStatus({ type: 'error', message: "New passwords do not match. Profile changes not saved." });
            setIsSaving(false);
            return;
        }
        if (newPassword.length < 6) { // Basic length validation
            setSaveStatus({ type: 'error', message: "New password must be at least 6 characters long. Profile changes not saved." });
            setIsSaving(false);
            return;
        }
        finalSettings.adminPassword = newPassword;
    }

    setTimeout(() => {
      setAppSettings(finalSettings);
      setIsSaving(false);
      setSaveStatus({ type: 'success', message: "Settings saved successfully." });
      // Clear password fields after successful save
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSaveStatus(null), 3000); 
    }, 1000);
  };
  
  const currentPrimaryColor = currentSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor || 'sky-600';
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Admin Settings</h2>
        <Button 
            onClick={handleSaveSettings} 
            isLoading={isSaving} 
            disabled={isSaving} 
            leftIcon={<ArrowDownTrayIcon className="h-5 w-5"/>} 
            className={`w-full sm:w-auto ${saveButtonClassName}`}
            style={saveButtonCustomStyle}
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      {saveStatus && (
        <div role="alert" className={`border-l-4 p-4 rounded-md ${saveStatus.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
          <p className="font-bold">{saveStatus.type === 'success' ? 'Success!' : 'Error!'}</p>
          <p>{saveStatus.message}</p>
        </div>
      )}
      
      {/* Admin Profile Settings Card */}
      <Card title="Admin Profile Settings" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <UserCircleIcon className="h-6 w-6 text-indigo-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Admin Profile Settings</h3>
        </div>
        <div className="p-5 space-y-6">
          <div>
            <label htmlFor="adminUsername" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <Input
              id="adminUsername"
              name="adminUsername"
              value={currentSettings.adminUsername || 'admin'} // Default to 'admin' if not set
              readOnly
              disabled 
              className="bg-slate-100 cursor-not-allowed"
            />
             <p className="text-xs text-slate-500 mt-1">Username is fixed as 'admin' in this version.</p>
          </div>
          <Input
            label="Admin Email"
            id="adminEmail"
            name="adminEmail"
            type="email"
            value={currentSettings.adminEmail || ''}
            onChange={handleInputChange}
            placeholder="e.g., admin@example.com"
          />
          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700">Change Password</h4>
          <Input
            label="Current Password"
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
          />
          <Input
            label="New Password"
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password (min. 6 characters)"
          />
          <Input
            label="Confirm New Password"
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </div>
        <div className="p-4 bg-red-50 border-t border-red-200">
          <p className="text-xs text-red-700 flex items-start">
            <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-red-600 flex-shrink-0"/>
            <strong>Security Warning:</strong> For demonstration purposes, the admin password is saved in your browser's local storage. This is <strong>NOT SECURE</strong> for a real application. In a production environment, passwords must be handled by a secure backend system with proper hashing and storage.
          </p>
        </div>
      </Card>

      {/* Application Information Card */}
      <Card title="Application Information" className="shadow-lg">
         <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <BuildingOffice2Icon className="h-6 w-6 text-sky-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Application Information</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Application Name"
            id="appName"
            name="appName"
            value={currentSettings.appName}
            onChange={handleInputChange}
            placeholder="e.g., Christian University College"
          />
          <Input
            label="College Address"
            id="collegeAddress"
            name="collegeAddress"
            value={currentSettings.collegeAddress}
            onChange={handleInputChange}
            placeholder="e.g., 123 University Ave, City, Country"
          />
          <Input
            label="Contact Phone (General Info)"
            id="collegePhone"
            name="collegePhone"
            type="tel"
            value={currentSettings.collegePhone}
            onChange={handleInputChange}
            placeholder="e.g., +1-555-123-4567"
          />
          <Input
            label="WhatsApp Number (Optional)"
            id="collegeWhatsApp"
            name="collegeWhatsApp"
            type="tel"
            value={currentSettings.collegeWhatsApp || ''}
            onChange={handleInputChange}
            placeholder="e.g., +15551234567 (include country code)"
          />
          <div>
            <label htmlFor="collegeLogo" className="block text-sm font-medium text-gray-700 mb-1">
              College Logo (Optional)
            </label>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="h-16 w-auto object-contain bg-slate-200 p-1 rounded-md" />
              ) : (
                <div className="h-16 w-28 bg-slate-200 rounded-md flex items-center justify-center text-slate-400">
                  <PhotoIcon className="h-8 w-8" />
                </div>
              )}
              <input
                type="file"
                id="collegeLogo"
                name="collegeLogo"
                accept="image/png, image/jpeg, image/gif, image/svg+xml"
                onChange={handleLogoChange}
                className="block w-full max-w-xs text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100"
              />
              {logoPreview && <Button variant='ghost' size='sm' onClick={handleRemoveLogo}>Remove Logo</Button>}
            </div>
            <p className="text-xs text-slate-500 mt-1">Recommended: PNG, JPG, GIF, or SVG. Max 2MB.</p>
          </div>
        </div>
      </Card>

      {/* Public Home Page Content Settings Card */}
      <Card title="Public Home Page Content" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <PencilSquareIcon className="h-6 w-6 text-cyan-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Public Home Page Sections</h3>
        </div>
        <div className="p-5 space-y-6">
          <Textarea
            label="Hero Section Tagline"
            id="heroTagline"
            name="heroTagline"
            value={currentSettings.heroTagline || ''}
            onChange={handleInputChange}
            rows={2}
            placeholder="e.g., Your gateway to quality education..."
          />
           <p className="text-xs text-slate-500 -mt-3">The main tagline displayed in the hero section of the public home page.</p>
          
          <Input
            label="'About Us' Card Button Text"
            id="aboutCardButtonText"
            name="aboutCardButtonText"
            value={currentSettings.aboutCardButtonText || ''}
            onChange={handleInputChange}
            placeholder="e.g., Read More, Learn About Us"
          />
          <p className="text-xs text-slate-500 -mt-3">Text for the button in the 'About {currentSettings.appName}' card.</p>
          
          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700 flex items-center"><DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-cyan-500"/> Mobile Money Payment Card</h4>
          <Input
            label="Mobile Money Card Title"
            id="publicHomeMobileMoneyCardTitle"
            name="publicHomeMobileMoneyCardTitle"
            value={currentSettings.publicHomeMobileMoneyCardTitle || ''}
            onChange={handleInputChange}
            placeholder="e.g., Mobile Money Payment"
          />
          <Textarea
            label="Mobile Money Card Description"
            id="publicHomeMobileMoneyCardDesc"
            name="publicHomeMobileMoneyCardDesc"
            value={currentSettings.publicHomeMobileMoneyCardDesc || ''}
            onChange={handleInputChange}
            rows={2}
            placeholder="e.g., Conveniently pay your fees..."
          />
          <Input
            label="Mobile Money Card Button Text"
            id="publicHomeMobileMoneyButtonText"
            name="publicHomeMobileMoneyButtonText"
            value={currentSettings.publicHomeMobileMoneyButtonText || ''}
            onChange={handleInputChange}
            placeholder="e.g., Make a Payment"
          />

          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700 flex items-center"><SparklesIcon className="h-5 w-5 mr-2 text-cyan-500"/> "Why Choose Us?" Section</h4>

          <Input
            label="Section Heading"
            id="whyChooseHeading"
            name="whyChooseHeading"
            value={currentSettings.whyChooseHeading || ''}
            onChange={handleInputChange}
            placeholder="e.g., Why Choose {appName}?"
          />
          <p className="text-xs text-slate-500 -mt-3">Use <code>{'{appName}'}</code> to dynamically insert the Application Name. Default: "Why Choose {'{appName}'}?"</p>

          <Textarea
            label="Section Description"
            id="whyChooseDescription"
            name="whyChooseDescription"
            value={currentSettings.whyChooseDescription || ''}
            onChange={handleInputChange}
            rows={3}
            placeholder="e.g., At {appName}, we are committed..."
          />
          <p className="text-xs text-slate-500 -mt-3">Use <code>{'{appName}'}</code> to dynamically insert the Application Name.</p>
          
          <Input
            label="Feature 1 Text"
            id="whyChooseFeature1"
            name="whyChooseFeature1"
            value={currentSettings.whyChooseFeature1 || ''}
            onChange={handleInputChange}
            placeholder="e.g., Experienced & Qualified Faculty"
          />
          <Input
            label="Feature 2 Text"
            id="whyChooseFeature2"
            name="whyChooseFeature2"
            value={currentSettings.whyChooseFeature2 || ''}
            onChange={handleInputChange}
            placeholder="e.g., Modern Learning Environment"
          />
          <Input
            label="Feature 3 Text"
            id="whyChooseFeature3"
            name="whyChooseFeature3"
            value={currentSettings.whyChooseFeature3 || ''}
            onChange={handleInputChange}
            placeholder="e.g., Strong Industry Connections"
          />
          <Input
            label="Feature 4 Text"
            id="whyChooseFeature4"
            name="whyChooseFeature4"
            value={currentSettings.whyChooseFeature4 || ''}
            onChange={handleInputChange}
            placeholder="e.g., Focus on Holistic Development"
          />
          <Input
            label="Section Button Text (Explore Programs)"
            id="exploreProgramsButtonText"
            name="exploreProgramsButtonText"
            value={currentSettings.exploreProgramsButtonText || ''}
            onChange={handleInputChange}
            placeholder="e.g., Explore Programs, Discover Courses"
          />
           <p className="text-xs text-slate-500 -mt-3">Text for the button in this section.</p>

          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700 flex items-center"><VideoCameraIcon className="h-5 w-5 mr-2 text-cyan-500"/> YouTube Video Section</h4>
          <Input
            label="YouTube Section Title"
            id="publicHomeYouTubeSectionTitle"
            name="publicHomeYouTubeSectionTitle"
            value={currentSettings.publicHomeYouTubeSectionTitle || ''}
            onChange={handleInputChange}
            placeholder="e.g., Discover More on Our YouTube"
          />
          <Textarea
            label="YouTube Section Description"
            id="publicHomeYouTubeSectionDesc"
            name="publicHomeYouTubeSectionDesc"
            value={currentSettings.publicHomeYouTubeSectionDesc || ''}
            onChange={handleInputChange}
            rows={2}
            placeholder="e.g., Watch our latest campus tours..."
          />
          <Input
            label="YouTube Video URL"
            id="publicHomeYouTubeVideoUrl"
            name="publicHomeYouTubeVideoUrl"
            type="url"
            value={currentSettings.publicHomeYouTubeVideoUrl || ''}
            onChange={handleInputChange}
            placeholder="e.g., https://www.youtube.com/watch?v=VIDEO_ID"
          />
          <p className="text-xs text-slate-500 -mt-3">Paste the full YouTube video URL (e.g., from share button or browser address bar). The system will convert it to an embeddable format.</p>
          <Input
            label="YouTube Channel URL (Optional)"
            id="publicHomeYouTubeChannelUrl"
            name="publicHomeYouTubeChannelUrl"
            type="url"
            value={currentSettings.publicHomeYouTubeChannelUrl || ''}
            onChange={handleInputChange}
            placeholder="e.g., https://www.youtube.com/YourChannel"
          />
          <Input
            label="Visit Channel Button Text"
            id="publicHomeYouTubeButtonText"
            name="publicHomeYouTubeButtonText"
            value={currentSettings.publicHomeYouTubeButtonText || ''}
            onChange={handleInputChange}
            placeholder="e.g., Visit Our Channel"
          />

        </div>
        <div className="p-4 bg-slate-50 border-t">
             <p className="text-xs text-slate-500 flex items-start">
                <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
                Customize key text elements on your public-facing home page.
            </p>
        </div>
      </Card>

      {/* Contact Us Page Content Card */}
      <Card title="Contact Us Page Content" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <PageContentIcon className="h-6 w-6 text-orange-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Contact Us Page</h3>
        </div>
        <div className="p-5 space-y-6">
            <Input label="Page Heading" id="contactUsPageHeading" name="contactUsPageHeading" value={currentSettings.contactUsPageHeading || ''} onChange={handleInputChange} />
            <Textarea label="Introductory Text" id="contactUsIntroText" name="contactUsIntroText" value={currentSettings.contactUsIntroText || ''} onChange={handleInputChange} rows={2} />
            <Input label="Specific Contact Phone" id="contactUsSpecificPhone" name="contactUsSpecificPhone" value={currentSettings.contactUsSpecificPhone || ''} onChange={handleInputChange} />
            <Input label="Specific Contact Fax" id="contactUsSpecificFax" name="contactUsSpecificFax" value={currentSettings.contactUsSpecificFax || ''} onChange={handleInputChange} />
            <Input label="Specific Contact Email" id="contactUsSpecificEmail" name="contactUsSpecificEmail" type="email" value={currentSettings.contactUsSpecificEmail || ''} onChange={handleInputChange} />
            <Textarea label="Specific Contact Address" id="contactUsSpecificAddress" name="contactUsSpecificAddress" value={currentSettings.contactUsSpecificAddress || ''} onChange={handleInputChange} rows={2} />
            <Input label="Contact Form Heading" id="contactUsFormHeading" name="contactUsFormHeading" value={currentSettings.contactUsFormHeading || ''} onChange={handleInputChange} />
            <Textarea label="Google Maps Embed URL" id="contactUsMapEmbedUrl" name="contactUsMapEmbedUrl" value={currentSettings.contactUsMapEmbedUrl || ''} onChange={handleInputChange} rows={3} placeholder="Paste Google Maps embed iframe URL here" />
        </div>
      </Card>
      
      {/* Example Event Detail Page Content Card */}
      <Card title="Example Event Detail Page Content" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <EventContentIcon className="h-6 w-6 text-red-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Example Event Details</h3>
        </div>
        <div className="p-5 space-y-6">
            <Input label="Event Title" id="eventDetailExampleTitle" name="eventDetailExampleTitle" value={currentSettings.eventDetailExampleTitle || ''} onChange={handleInputChange} />
            <Input label="Event Category" id="eventDetailExampleCategory" name="eventDetailExampleCategory" value={currentSettings.eventDetailExampleCategory || ''} onChange={handleInputChange} />
            <Input label="Date Range" id="eventDetailExampleDateRange" name="eventDetailExampleDateRange" value={currentSettings.eventDetailExampleDateRange || ''} onChange={handleInputChange} />
            <Input label="Location" id="eventDetailExampleLocation" name="eventDetailExampleLocation" value={currentSettings.eventDetailExampleLocation || ''} onChange={handleInputChange} />
            <Input label="Organizer" id="eventDetailExampleOrganizer" name="eventDetailExampleOrganizer" value={currentSettings.eventDetailExampleOrganizer || ''} onChange={handleInputChange} />
            <Input label="Published Date" id="eventDetailExamplePublishedDate" name="eventDetailExamplePublishedDate" value={currentSettings.eventDetailExamplePublishedDate || ''} onChange={handleInputChange} />
            <Textarea label="Description Paragraph 1" id="eventDetailExampleDescriptionP1" name="eventDetailExampleDescriptionP1" value={currentSettings.eventDetailExampleDescriptionP1 || ''} onChange={handleInputChange} rows={3} />
            <Textarea label="Description Paragraph 2" id="eventDetailExampleDescriptionP2" name="eventDetailExampleDescriptionP2" value={currentSettings.eventDetailExampleDescriptionP2 || ''} onChange={handleInputChange} rows={3} />
            <Input label="Highlights Heading" id="eventDetailExampleHighlightsHeading" name="eventDetailExampleHighlightsHeading" value={currentSettings.eventDetailExampleHighlightsHeading || ''} onChange={handleInputChange} />
            <Input label="Highlight 1" id="eventDetailExampleHighlight1" name="eventDetailExampleHighlight1" value={currentSettings.eventDetailExampleHighlight1 || ''} onChange={handleInputChange} />
            <Input label="Highlight 2" id="eventDetailExampleHighlight2" name="eventDetailExampleHighlight2" value={currentSettings.eventDetailExampleHighlight2 || ''} onChange={handleInputChange} />
            <Input label="Highlight 3" id="eventDetailExampleHighlight3" name="eventDetailExampleHighlight3" value={currentSettings.eventDetailExampleHighlight3 || ''} onChange={handleInputChange} />
            <Input label="Highlight 4" id="eventDetailExampleHighlight4" name="eventDetailExampleHighlight4" value={currentSettings.eventDetailExampleHighlight4 || ''} onChange={handleInputChange} />
            <Textarea label="Description Paragraph 3" id="eventDetailExampleDescriptionP3" name="eventDetailExampleDescriptionP3" value={currentSettings.eventDetailExampleDescriptionP3 || ''} onChange={handleInputChange} rows={3} />
            <h4 className="text-md font-medium text-slate-700 pt-2 border-t mt-4">Sidebar Latest Events (Example)</h4>
            <Input label="Latest Event 1 Title" id="eventDetailSidebarLatestEvent1Title" name="eventDetailSidebarLatestEvent1Title" value={currentSettings.eventDetailSidebarLatestEvent1Title || ''} onChange={handleInputChange} />
            <Input label="Latest Event 1 Date" id="eventDetailSidebarLatestEvent1Date" name="eventDetailSidebarLatestEvent1Date" value={currentSettings.eventDetailSidebarLatestEvent1Date || ''} onChange={handleInputChange} />
            <Input label="Latest Event 2 Title" id="eventDetailSidebarLatestEvent2Title" name="eventDetailSidebarLatestEvent2Title" value={currentSettings.eventDetailSidebarLatestEvent2Title || ''} onChange={handleInputChange} />
            <Input label="Latest Event 2 Date" id="eventDetailSidebarLatestEvent2Date" name="eventDetailSidebarLatestEvent2Date" value={currentSettings.eventDetailSidebarLatestEvent2Date || ''} onChange={handleInputChange} />
            <Input label="Latest Event 3 Title" id="eventDetailSidebarLatestEvent3Title" name="eventDetailSidebarLatestEvent3Title" value={currentSettings.eventDetailSidebarLatestEvent3Title || ''} onChange={handleInputChange} />
            <Input label="Latest Event 3 Date" id="eventDetailSidebarLatestEvent3Date" name="eventDetailSidebarLatestEvent3Date" value={currentSettings.eventDetailSidebarLatestEvent3Date || ''} onChange={handleInputChange} />
            <Input label="Latest Event 4 Title" id="eventDetailSidebarLatestEvent4Title" name="eventDetailSidebarLatestEvent4Title" value={currentSettings.eventDetailSidebarLatestEvent4Title || ''} onChange={handleInputChange} />
            <Input label="Latest Event 4 Date" id="eventDetailSidebarLatestEvent4Date" name="eventDetailSidebarLatestEvent4Date" value={currentSettings.eventDetailSidebarLatestEvent4Date || ''} onChange={handleInputChange} />
        </div>
      </Card>

      {/* Authentication Pages Content Card */}
      <Card title="Authentication Pages Content" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <AuthContentIcon className="h-6 w-6 text-purple-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Authentication Pages</h3>
        </div>
        <div className="p-5 space-y-6">
            <Input label="Login Page Heading" id="loginPageMainHeading" name="loginPageMainHeading" value={currentSettings.loginPageMainHeading || ''} onChange={handleInputChange} />
            <Input label="Sign Up Page Heading" id="signUpPageHeading" name="signUpPageHeading" value={currentSettings.signUpPageHeading || ''} onChange={handleInputChange} />
            <Textarea label="Sign Up Page Sub-text" id="signUpPageSubText" name="signUpPageSubText" value={currentSettings.signUpPageSubText || ''} onChange={handleInputChange} rows={2} />
            <Input label="Forgot Password Page Heading" id="forgotPasswordPageHeading" name="forgotPasswordPageHeading" value={currentSettings.forgotPasswordPageHeading || ''} onChange={handleInputChange} />
            <Textarea label="Forgot Password Page Sub-text" id="forgotPasswordPageSubText" name="forgotPasswordPageSubText" value={currentSettings.forgotPasswordPageSubText || ''} onChange={handleInputChange} rows={2} />
        </div>
      </Card>

      {/* Portal Pages Content Card */}
      <Card title="Portal Pages Content" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <PortalContentIcon className="h-6 w-6 text-green-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Key Portal Pages</h3>
        </div>
        <div className="p-5 space-y-6">
            <h4 className="text-md font-medium text-slate-700 border-b pb-2">Results Page</h4>
            <Input label="Results Page Heading (e.g., Student Results Portal)" id="resultsPageHeading" name="resultsPageHeading" value={currentSettings.resultsPageHeading || ''} onChange={handleInputChange} />
            <Input label="Results Page Sub-text (e.g., Check Your Academic Results)" id="resultsPageSubText" name="resultsPageSubText" value={currentSettings.resultsPageSubText || ''} onChange={handleInputChange} />
            <Input label="Results Page Search Prompt" id="resultsPageSearchPrompt" name="resultsPageSearchPrompt" value={currentSettings.resultsPageSearchPrompt || ''} onChange={handleInputChange} />
            
            <h4 className="text-md font-medium text-slate-700 border-b pb-2 pt-4">Student Dashboard</h4>
            <Input label="Student Dashboard Heading" id="studentDashboardPageHeading" name="studentDashboardPageHeading" value={currentSettings.studentDashboardPageHeading || ''} onChange={handleInputChange} />
            <Textarea label="Student Dashboard Welcome Text" id="studentDashboardWelcomeText" name="studentDashboardWelcomeText" value={currentSettings.studentDashboardWelcomeText || ''} onChange={handleInputChange} rows={2} />
            
            <Input label="My Courses Card Title" id="studentDashboardMyCoursesTitle" name="studentDashboardMyCoursesTitle" value={currentSettings.studentDashboardMyCoursesTitle || ''} onChange={handleInputChange} />
            <Textarea label="My Courses Card Description" id="studentDashboardMyCoursesDesc" name="studentDashboardMyCoursesDesc" value={currentSettings.studentDashboardMyCoursesDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="My Courses Card Button Text" id="studentDashboardMyCoursesButtonText" name="studentDashboardMyCoursesButtonText" value={currentSettings.studentDashboardMyCoursesButtonText || ''} onChange={handleInputChange} />

            <Input label="Results Preview Card Title" id="studentDashboardResultsPreviewTitle" name="studentDashboardResultsPreviewTitle" value={currentSettings.studentDashboardResultsPreviewTitle || ''} onChange={handleInputChange} />
            <Textarea label="Results Preview Card Description" id="studentDashboardResultsPreviewDesc" name="studentDashboardResultsPreviewDesc" value={currentSettings.studentDashboardResultsPreviewDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="Results Preview Card Button Text" id="studentDashboardResultsPreviewButtonText" name="studentDashboardResultsPreviewButtonText" value={currentSettings.studentDashboardResultsPreviewButtonText || ''} onChange={handleInputChange} />

            <Input label="Payment Status Card Title" id="studentDashboardPaymentStatusTitle" name="studentDashboardPaymentStatusTitle" value={currentSettings.studentDashboardPaymentStatusTitle || ''} onChange={handleInputChange} />
            <Textarea label="Payment Status Card Description" id="studentDashboardPaymentStatusDesc" name="studentDashboardPaymentStatusDesc" value={currentSettings.studentDashboardPaymentStatusDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="Payment Status Card Button Text" id="studentDashboardPaymentStatusButtonText" name="studentDashboardPaymentStatusButtonText" value={currentSettings.studentDashboardPaymentStatusButtonText || ''} onChange={handleInputChange} />

            <Input label="Class Schedule Card Title" id="studentDashboardClassScheduleTitle" name="studentDashboardClassScheduleTitle" value={currentSettings.studentDashboardClassScheduleTitle || ''} onChange={handleInputChange} />
            <Textarea label="Class Schedule Card Description" id="studentDashboardClassScheduleDesc" name="studentDashboardClassScheduleDesc" value={currentSettings.studentDashboardClassScheduleDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="Class Schedule Card Button Text" id="studentDashboardClassScheduleButtonText" name="studentDashboardClassScheduleButtonText" value={currentSettings.studentDashboardClassScheduleButtonText || ''} onChange={handleInputChange} />

            <Input label="Admin Messages Card Title" id="studentDashboardAdminMessagesTitle" name="studentDashboardAdminMessagesTitle" value={currentSettings.studentDashboardAdminMessagesTitle || ''} onChange={handleInputChange} />
            <Textarea label="Admin Messages Card Description" id="studentDashboardAdminMessagesDesc" name="studentDashboardAdminMessagesDesc" value={currentSettings.studentDashboardAdminMessagesDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="Admin Messages Card Button Text" id="studentDashboardAdminMessagesButtonText" name="studentDashboardAdminMessagesButtonText" value={currentSettings.studentDashboardAdminMessagesButtonText || ''} onChange={handleInputChange} />
            
            <Input label="Student Dashboard Placeholder Image Text" id="studentDashboardPlaceholderImageText" name="studentDashboardPlaceholderImageText" value={currentSettings.studentDashboardPlaceholderImageText || ''} onChange={handleInputChange} />


            <h4 className="text-md font-medium text-slate-700 border-b pb-2 pt-4">Lecturer Dashboard</h4>
            <Input label="Lecturer Dashboard Heading" id="lecturerDashboardPageHeading" name="lecturerDashboardPageHeading" value={currentSettings.lecturerDashboardPageHeading || ''} onChange={handleInputChange} />
            <Textarea label="Lecturer Dashboard Welcome Text" id="lecturerDashboardWelcomeText" name="lecturerDashboardWelcomeText" value={currentSettings.lecturerDashboardWelcomeText || ''} onChange={handleInputChange} rows={2} />
            <Input label="My Courses Card Title (Lecturer)" id="lecturerDashboardMyCoursesTitle" name="lecturerDashboardMyCoursesTitle" value={currentSettings.lecturerDashboardMyCoursesTitle || ''} onChange={handleInputChange} />
            <Textarea label="My Courses Card Description (Lecturer)" id="lecturerDashboardMyCoursesDesc" name="lecturerDashboardMyCoursesDesc" value={currentSettings.lecturerDashboardMyCoursesDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="My Courses Card Button Text" id="lecturerDashboardMyCoursesButtonText" name="lecturerDashboardMyCoursesButtonText" value={currentSettings.lecturerDashboardMyCoursesButtonText || ''} onChange={handleInputChange} />
            
            <Input label="Upload Grades Card Title" id="lecturerDashboardUploadGradesTitle" name="lecturerDashboardUploadGradesTitle" value={currentSettings.lecturerDashboardUploadGradesTitle || ''} onChange={handleInputChange} />
            <Textarea label="Upload Grades Card Description" id="lecturerDashboardUploadGradesDesc" name="lecturerDashboardUploadGradesDesc" value={currentSettings.lecturerDashboardUploadGradesDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="Upload Grades Card Button Text" id="lecturerDashboardUploadGradesButtonText" name="lecturerDashboardUploadGradesButtonText" value={currentSettings.lecturerDashboardUploadGradesButtonText || ''} onChange={handleInputChange} />

            <Input label="View Enrolled Students Card Title" id="lecturerDashboardViewStudentsTitle" name="lecturerDashboardViewStudentsTitle" value={currentSettings.lecturerDashboardViewStudentsTitle || ''} onChange={handleInputChange} />
            <Textarea label="View Enrolled Students Card Description" id="lecturerDashboardViewStudentsDesc" name="lecturerDashboardViewStudentsDesc" value={currentSettings.lecturerDashboardViewStudentsDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="View Students Card Button Text" id="lecturerDashboardViewStudentsButtonText" name="lecturerDashboardViewStudentsButtonText" value={currentSettings.lecturerDashboardViewStudentsButtonText || ''} onChange={handleInputChange} />
            
            <Input label="Announcements Card Title" id="lecturerDashboardAnnouncementsTitle" name="lecturerDashboardAnnouncementsTitle" value={currentSettings.lecturerDashboardAnnouncementsTitle || ''} onChange={handleInputChange} />
            <Textarea label="Announcements Card Description" id="lecturerDashboardAnnouncementsDesc" name="lecturerDashboardAnnouncementsDesc" value={currentSettings.lecturerDashboardAnnouncementsDesc || ''} onChange={handleInputChange} rows={2} />
            <Input label="Announcements Card Button Text" id="lecturerDashboardAnnouncementsButtonText" name="lecturerDashboardAnnouncementsButtonText" value={currentSettings.lecturerDashboardAnnouncementsButtonText || ''} onChange={handleInputChange} />
            
            <Input label="Lecturer Dashboard Placeholder Image Text" id="lecturerDashboardPlaceholderImageText" name="lecturerDashboardPlaceholderImageText" value={currentSettings.lecturerDashboardPlaceholderImageText || ''} onChange={handleInputChange} />
            
            <h4 className="text-md font-medium text-slate-700 border-b pb-2 pt-4">Application Page</h4>
            <Input label="Application Page Main Heading" id="applicationPageMainHeading" name="applicationPageMainHeading" value={currentSettings.applicationPageMainHeading || ''} onChange={handleInputChange} />
            <Textarea label="Application Page Sub-text" id="applicationPageSubText" name="applicationPageSubText" value={currentSettings.applicationPageSubText || ''} onChange={handleInputChange} rows={2} />
            <Input label="Student Application Form Heading" id="applicationPageStudentFormHeading" name="applicationPageStudentFormHeading" value={currentSettings.applicationPageStudentFormHeading || ''} onChange={handleInputChange} />
            <Input label="Teacher Application Form Heading" id="applicationPageTeacherFormHeading" name="applicationPageTeacherFormHeading" value={currentSettings.applicationPageTeacherFormHeading || ''} onChange={handleInputChange} />
        </div>
      </Card>


      {/* Theme & Appearance Card */}
      <Card title="Theme & Appearance" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <PaintBrushIcon className="h-6 w-6 text-purple-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Theme & Appearance</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Primary Color (Tailwind Class or Hex)"
            id="primaryColor"
            name="primaryColor"
            value={currentSettings.primaryColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., sky-600, indigo-500, or #0EA5E9"
          />
           <p className="text-xs text-slate-500 -mt-3">
              Used for main buttons, active links, etc. Examples: <code>sky-600</code>, <code>green-500</code>, <code>#FF5733</code>.
              Changes to app name, sidebar active item, and avatar will apply immediately after save.
            </p>

          <div>
            <label htmlFor="contentBackgroundTheme" className="block text-sm font-medium text-gray-700 mb-1">Content Area Background</label>
            <select
              id="contentBackgroundTheme"
              name="contentBackgroundTheme"
              value={currentSettings.contentBackgroundTheme || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="slate-100">Slate 100 (Default Light)</option>
              <option value="white">White</option>
              <option value="gray-100">Gray 100</option>
              <option value="slate-200">Slate 200 (Darker Light)</option>
              <option value="gray-200">Gray 200</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Select a background color for the main content area of the admin panel.</p>
          </div>
          
          <hr className="my-4"/>
          <h4 className="text-md font-medium text-slate-700 flex items-center"><AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-purple-500"/> Text & Font Settings</h4>
          
          <Input
            label="Main Text Color (Tailwind Class or Hex)"
            id="mainTextColor"
            name="mainTextColor"
            value={currentSettings.mainTextColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., text-slate-700 or #334155"
          />
          <p className="text-xs text-slate-500 -mt-3">Default color for paragraphs and general text content.</p>

          <Input
            label="Heading Text Color (Tailwind Class or Hex)"
            id="headingTextColor"
            name="headingTextColor"
            value={currentSettings.headingTextColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., text-slate-800 or #1E293B"
          />
          <p className="text-xs text-slate-500 -mt-3">Color for main page titles and card titles.</p>

           <div>
            <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-1">Application Font Family</label>
            <select
              id="fontFamily"
              name="fontFamily"
              value={currentSettings.fontFamily || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
            >
              <option value="font-sans">Sans-Serif (Default - Inter)</option>
              <option value="font-serif">Serif (e.g., Times New Roman)</option>
              <option value="font-mono">Monospace (e.g., Courier New)</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Changes the global font style for the application.</p>
          </div>
        </div>
      </Card>

      {/* Social Media & Chat Integration Card */}
      <Card title="Social Media & Chat Integration" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <ShareIcon className="h-6 w-6 text-lime-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Social Media & Chat</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Facebook Page URL (Optional)"
            id="facebookPageUrl"
            name="facebookPageUrl"
            value={currentSettings.facebookPageUrl || ''}
            onChange={handleInputChange}
            placeholder="e.g., https://www.facebook.com/YourPageName"
          />
          <p className="text-xs text-slate-500 -mt-3">Link to your official Facebook page for the footer icon.</p>

          <Input
            label="Facebook Page ID (for Messenger Chat)"
            id="facebookPageId"
            name="facebookPageId"
            value={currentSettings.facebookPageId || ''}
            onChange={handleInputChange}
            placeholder="Enter your Facebook Page ID"
          />
          <p className="text-xs text-slate-500 -mt-3">Required for the Facebook Messenger chat widget on the public home page. Use '1234567890' as placeholder if none.</p>
          
          <Input
            label="Facebook Messenger Theme Color (Hex, Optional)"
            id="facebookThemeColor"
            name="facebookThemeColor"
            value={currentSettings.facebookThemeColor || ''}
            onChange={handleInputChange}
            placeholder="e.g., #0EA5E9"
          />
          <p className="text-xs text-slate-500 -mt-3">Overrides the default theme color of the Messenger widget. If empty and Primary Color is HEX, Primary Color is used. Otherwise, defaults to Facebook blue.</p>
        </div>
        <div className="p-4 bg-slate-50 border-t">
             <p className="text-xs text-slate-500 flex items-start">
                <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
                Configure integration with social media platforms and chat services. The WhatsApp number is set in "Application Information".
            </p>
        </div>
      </Card>


      <Card title="Payment Configuration" className="shadow-lg">
         <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <CurrencyDollarIcon className="h-6 w-6 text-green-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Payment Configuration</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input
            label="Application Fee (Optional, e.g., 25.00)"
            id="applicationFee"
            name="applicationFee"
            type="number"
            value={currentSettings.applicationFee?.toString() || '0'}
            onChange={handleInputChange}
            placeholder="Enter amount (e.g., 25.00)"
            min="0"
            step="0.01"
          />
          
          <h3 className="text-lg font-medium text-slate-700 pt-2 border-t mt-4 flex items-center"><BanknotesIcon className="h-5 w-5 mr-2 text-green-500"/>Primary/Default Bank Account</h3>
          <Input
            label="Bank Name"
            id="bankName"
            name="bankName"
            value={currentSettings.bankName || ''}
            onChange={handleInputChange}
            placeholder="e.g., Ecobank Liberia Limited"
          />
          <Input
            label="Account Name"
            id="bankAccountName"
            name="bankAccountName"
            value={currentSettings.bankAccountName || ''}
            onChange={handleInputChange}
            placeholder="e.g., Christian University College"
          />
          <Input
            label="Account Number"
            id="bankAccountNumber"
            name="bankAccountNumber"
            value={currentSettings.bankAccountNumber || ''}
            onChange={handleInputChange}
            placeholder="e.g., 001122334455"
          />
          <Input
            label="SWIFT Code (Optional)"
            id="bankSwiftCode"
            name="bankSwiftCode"
            value={currentSettings.bankSwiftCode || ''}
            onChange={handleInputChange}
            placeholder="e.g., ECOCLRLM"
          />

          <h3 className="text-lg font-medium text-slate-700 pt-2 border-t mt-4 flex items-center"><BanknotesIcon className="h-5 w-5 mr-2 text-green-500"/>UBA Bank Details</h3>
          <Input label="UBA Bank - Display Name" id="ubaBankName" name="ubaBankName" value={currentSettings.ubaBankName || 'UBA Bank'} onChange={handleInputChange} />
          <Input label="UBA Bank - Account Name" id="ubaBankAccountName" name="ubaBankAccountName" value={currentSettings.ubaBankAccountName || ''} onChange={handleInputChange} />
          <Input label="UBA Bank - Account Number" id="ubaBankAccountNumber" name="ubaBankAccountNumber" value={currentSettings.ubaBankAccountNumber || ''} onChange={handleInputChange} />
          <Input label="UBA Bank - SWIFT Code (Optional)" id="ubaBankSwiftCode" name="ubaBankSwiftCode" value={currentSettings.ubaBankSwiftCode || ''} onChange={handleInputChange} />
          
          <h3 className="text-lg font-medium text-slate-700 pt-2 border-t mt-4 flex items-center"><BanknotesIcon className="h-5 w-5 mr-2 text-green-500"/>LBDI Bank Details</h3>
          <Input label="LBDI Bank - Display Name" id="lbtiBankName" name="lbtiBankName" value={currentSettings.lbtiBankName || 'LBDI Bank'} onChange={handleInputChange} />
          <Input label="LBDI Bank - Account Name" id="lbtiBankAccountName" name="lbtiBankAccountName" value={currentSettings.lbtiBankAccountName || ''} onChange={handleInputChange} />
          <Input label="LBDI Bank - Account Number" id="lbtiBankAccountNumber" name="lbtiBankAccountNumber" value={currentSettings.lbtiBankAccountNumber || ''} onChange={handleInputChange} />
          <Input label="LBDI Bank - SWIFT Code (Optional)" id="lbtiBankSwiftCode" name="lbtiBankSwiftCode" value={currentSettings.lbtiBankSwiftCode || ''} onChange={handleInputChange} />

          <h3 className="text-lg font-medium text-slate-700 pt-2 border-t mt-4 flex items-center"><BanknotesIcon className="h-5 w-5 mr-2 text-green-500"/>International Bank (Liberia) Limited Details</h3>
          <Input label="Intl. Bank - Display Name" id="assetBankName" name="assetBankName" value={currentSettings.assetBankName || 'International Bank (Liberia) Limited'} onChange={handleInputChange} />
          <Input label="Intl. Bank - Account Name" id="assetBankAccountName" name="assetBankAccountName" value={currentSettings.assetBankAccountName || ''} onChange={handleInputChange} />
          <Input label="Intl. Bank - Account Number" id="assetBankAccountNumber" name="assetBankAccountNumber" value={currentSettings.assetBankAccountNumber || ''} onChange={handleInputChange} />
          <Input label="Intl. Bank - SWIFT Code (Optional)" id="assetBankSwiftCode" name="assetBankSwiftCode" value={currentSettings.assetBankSwiftCode || ''} onChange={handleInputChange} />
          
          <h3 className="text-lg font-medium text-slate-700 pt-4 border-t mt-4 flex items-center">
            <DevicePhoneMobileIcon className="h-5 w-5 mr-2 text-green-500"/>Mobile Money Options
          </h3>
          {(currentSettings.mobileMoneyOptions || []).map((option, index) => (
            <Card key={option.id} className="bg-slate-50 border border-slate-200 shadow-sm">
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-slate-600">Option {index + 1}</h4>
                    <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeMobileMoneyOption(index)}
                        leftIcon={<TrashIcon className="h-4 w-4" />}
                        className="!p-1.5"
                    >
                       Remove
                    </Button>
                </div>
                <Input
                  label="Provider Name"
                  id={`momoName-${option.id}`}
                  value={option.providerName}
                  onChange={(e) => handleMobileMoneyOptionChange(index, 'providerName', e.target.value)}
                  placeholder="e.g., MTN Mobile Money"
                />
                <Input
                  label="Account Number"
                  id={`momoNumber-${option.id}`}
                  type="tel"
                  value={option.accountNumber}
                  onChange={(e) => handleMobileMoneyOptionChange(index, 'accountNumber', e.target.value)}
                  placeholder="e.g., 0770123456"
                />
                <Textarea
                  label="Instructions (Optional)"
                  id={`momoInstructions-${option.id}`}
                  value={option.instructions || ''}
                  onChange={(e) => handleMobileMoneyOptionChange(index, 'instructions', e.target.value)}
                  rows={2}
                  placeholder="e.g., Dial *156# and follow prompts. Use Student ID as reference."
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`momoEnabled-${option.id}`}
                    checked={option.isEnabled}
                    onChange={(e) => handleMobileMoneyOptionChange(index, 'isEnabled', e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                  />
                  <label htmlFor={`momoEnabled-${option.id}`} className="ml-2 block text-sm text-gray-900">
                    Enable this Mobile Money option
                  </label>
                </div>
              </div>
            </Card>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={addMobileMoneyOption}
            leftIcon={<PlusCircleIcon className="h-5 w-5" />}
            className="w-full sm:w-auto"
          >
            Add Another Mobile Money Option
          </Button>
        </div>
        <div className="p-4 bg-slate-50 border-t">
             <p className="text-xs text-slate-500 flex items-start">
                <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
                This information will be displayed to applicants for manual payment of application fees, if an Application Fee is set.
            </p>
        </div>
      </Card>
      
      {/* Email Configuration Card */}
      <Card title="Email Configuration (SMTP)" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <EnvelopeOutlineIcon className="h-6 w-6 text-blue-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">Email Configuration (SMTP)</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input label="SMTP Server" id="smtpServer" name="smtpServer" value={currentSettings.smtpServer || ''} onChange={handleInputChange} placeholder="e.g., smtp.example.com" />
          <Input label="SMTP Port" id="smtpPort" name="smtpPort" type="number" value={currentSettings.smtpPort?.toString() || ''} onChange={handleInputChange} placeholder="e.g., 587 or 465" />
          <Input label="SMTP Username" id="smtpUsername" name="smtpUsername" value={currentSettings.smtpUsername || ''} onChange={handleInputChange} placeholder="e.g., user@example.com" />
          <Input label="SMTP Password" id="smtpPassword" name="smtpPassword" type="password" value={currentSettings.smtpPassword || ''} onChange={handleInputChange} placeholder="Enter SMTP password" />
          <Input label="Default 'From' Email Address" id="smtpFromEmail" name="smtpFromEmail" type="email" value={currentSettings.smtpFromEmail || ''} onChange={handleInputChange} placeholder="e.g., no-reply@example.com" />
        </div>
        <div className="p-4 bg-slate-50 border-t">
          <p className="text-xs text-slate-500 flex items-start">
            <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
            These settings are for sending system emails (e.g., notifications, password resets - features not yet implemented). Ensure your provider's details are correct.
          </p>
        </div>
      </Card>

      {/* SMS Configuration Card */}
      <Card title="SMS Configuration" className="shadow-lg">
         <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <ChatBubbleLeftRightIconOutline className="h-6 w-6 text-teal-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">SMS Configuration</h3>
        </div>
        <div className="p-5 space-y-6">
          <Input label="SMS Gateway API URL" id="smsApiUrl" name="smsApiUrl" value={currentSettings.smsApiUrl || ''} onChange={handleInputChange} placeholder="e.g., https://api.sms_provider.com/send" />
          <Input label="SMS Gateway API Key/Token" id="smsApiKey" name="smsApiKey" type="password" value={currentSettings.smsApiKey || ''} onChange={handleInputChange} placeholder="Enter SMS API Key" />
          <Input label="SMS Sender ID" id="smsSenderId" name="smsSenderId" value={currentSettings.smsSenderId || ''} onChange={handleInputChange} placeholder="e.g., YourAppName" />
        </div>
         <div className="p-4 bg-slate-50 border-t">
          <p className="text-xs text-slate-500 flex items-start">
            <InformationCircleIcon className="h-4 w-4 mr-1.5 mt-0.5 text-sky-600 flex-shrink-0"/>
            Configure your SMS provider details for sending messages (e.g., OTPs, alerts - features not yet implemented).
          </p>
        </div>
      </Card>


      <Card title="API Configuration Status" className="shadow-lg">
        <div className="flex items-center text-slate-700 mb-3 p-5 border-b border-gray-200 -mt-5 -mx-5 -mb-0 bg-slate-50 rounded-t-xl">
            <KeyIcon className="h-6 w-6 text-amber-600 mr-3"/>
            <h3 className="text-lg font-semibold text-gray-800">API Configuration Status</h3>
        </div>
        <div className="p-5">
           <div className="flex items-center">
            <KeyIcon className="h-6 w-6 text-sky-600 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-500">Google Gemini API Key</p>
              {geminiConfigured ? (
                <div className="flex items-center mt-1">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
                  <p className="text-lg font-medium text-green-600">Configured and Active</p>
                </div>
              ) : (
                <div className="flex items-center mt-1">
                  <XCircleIcon className="h-5 w-5 text-red-500 mr-1" />
                  <p className="text-lg font-medium text-red-600">Not Configured or Error</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t">
             <p className="text-xs text-slate-500">
                The Gemini API key is managed via environment variables on the server. This status reflects whether the application was able to initialize the API client. AI-powered features depend on this configuration.
            </p>
        </div>
      </Card>
      
       <Card title="More Settings" className="shadow-lg opacity-70">
        <div className="p-5">
          <p className="text-slate-600">This section is reserved for future administrative settings.</p>
          <ul className="list-disc list-inside text-slate-500 mt-2 text-sm space-y-1">
            <li>User role management</li>
            <li>Advanced integration management</li>
          </ul>
        </div>
      </Card>

    </div>
  );
};

export default AdminSettingsPage;
