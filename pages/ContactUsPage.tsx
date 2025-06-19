
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Button from '../components/Button';
import Card from '../components/Card';
import { 
    AcademicCapIcon, ArrowLeftIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, BuildingOfficeIcon, PrinterIcon,
    UserIcon as FormUserIcon, AtSymbolIcon, PhoneArrowUpRightIcon as FormPhoneIcon, TagIcon, ChatBubbleLeftRightIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

interface ContactUsPageProps {
  appSettings: AppSettings;
}

const ContactUsPage: React.FC<ContactUsPageProps> = ({ appSettings }) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeAddress = DEFAULT_APP_SETTINGS.collegeAddress,
    collegePhone = DEFAULT_APP_SETTINGS.collegePhone,
    collegeLogo, 
    primaryColor: settingsPrimaryColor,
    contactUsPageHeading = DEFAULT_APP_SETTINGS.contactUsPageHeading,
    contactUsIntroText = DEFAULT_APP_SETTINGS.contactUsIntroText,
    contactUsSpecificPhone = DEFAULT_APP_SETTINGS.contactUsSpecificPhone,
    contactUsSpecificFax = DEFAULT_APP_SETTINGS.contactUsSpecificFax,
    contactUsSpecificEmail = DEFAULT_APP_SETTINGS.contactUsSpecificEmail,
    contactUsSpecificAddress = DEFAULT_APP_SETTINGS.contactUsSpecificAddress,
    contactUsFormHeading = DEFAULT_APP_SETTINGS.contactUsFormHeading,
    contactUsMapEmbedUrl = DEFAULT_APP_SETTINGS.contactUsMapEmbedUrl
  } = appSettings;

  const primaryColor = settingsPrimaryColor || DEFAULT_APP_SETTINGS.primaryColor;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email format is invalid.";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    if (!validateForm()) return;

    setIsSubmitting(true);
    // Simulate API call
    console.log("Form data submitted:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    }, 1500);
  };
  
  const getPrimaryColorClass = (baseClass: string = 'text', hover: boolean = false): string => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shadeStr = '600'] = primaryColor.split('-');
    let targetShade = parseInt(shadeStr, 10);
    if (hover) targetShade = Math.min(900, targetShade + 100);
    return `${baseClass}-${color}-${targetShade}`;
  };

  const getPrimaryColorStyle = (): React.CSSProperties => {
    if (primaryColor.startsWith('#')) return { color: primaryColor };
    return {};
  };

  const getButtonBgColor = (): string => {
    if (primaryColor.startsWith('#')) return ''; 
    return `bg-${primaryColor}`;
  };

  const getButtonHoverBgColor = (): string => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shade] = primaryColor.split('-');
    if (shade) {
      const numericShade = parseInt(shade);
      if (numericShade < 900 && numericShade > 0) return `hover:bg-${color}-${Math.min(900, numericShade + 100)}`;
      if (numericShade === 0) return `hover:bg-${color}-100`;
      return `hover:bg-${color}-${shade}`;
    }
    return `hover:bg-sky-700`;
  };
  
  const getButtonTextColor = (): string => {
     if (primaryColor.startsWith('#')) return 'text-white';
     const [colorName, shadeStr = '600'] = primaryColor.split('-');
     const shade = parseInt(shadeStr, 10);
     if ((colorName === 'yellow' || colorName === 'lime' || colorName === 'cyan' || colorName === 'sky' || colorName === 'indigo' || colorName === 'purple' || colorName === 'pink') && shade < 500) {
         return `text-${colorName}-800`;
     }
     return 'text-white';
  };

  const submitButtonClass = `
    ${getButtonBgColor()} 
    ${getButtonTextColor()} 
    ${getButtonHoverBgColor()}
  `;
  const submitButtonStyle = primaryColor.startsWith('#') ? { backgroundColor: primaryColor } : {};

  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return '';
    return phone.replace(/\s+/g, ''); // Remove spaces for tel: link
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            {collegeLogo ? (
              <img src={collegeLogo} alt={`${appName} Logo`} className="h-10 sm:h-12 w-auto object-contain" />
            ) : (
              <AcademicCapIcon className={`h-10 sm:h-12 w-auto ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
            )}
            <div>
              <span className={`text-xl sm:text-2xl font-bold ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}>{appName}</span>
              <span className="block text-sm text-slate-500 -mt-1">Contact Us</span>
            </div>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeftIcon className="h-4 w-4"/>}>
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className={`text-3xl sm:text-4xl font-bold text-center mb-4 text-slate-800`}>{contactUsPageHeading}</h1>
          {contactUsIntroText && <p className="text-center text-slate-600 mb-10">{contactUsIntroText}</p>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Information Section */}
            <section aria-labelledby="contact-info-heading">
              <Card className="shadow-lg h-full">
                <div className="p-6">
                  <h2 id="contact-info-heading" className={`text-2xl font-semibold mb-6 flex items-center ${getPrimaryColorClass('text')}`} style={getPrimaryColorStyle()}>
                    <BuildingOfficeIcon className="h-7 w-7 mr-2" />
                    Our Contact Details
                  </h2>
                  <div className="space-y-5 text-slate-700">
                    <div>
                      <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider mb-1">General Inquiries</h3>
                      {collegeAddress && (
                        <p className="flex items-start">
                          <MapPinIcon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                          <span>{collegeAddress}</span>
                        </p>
                      )}
                      {collegePhone && (
                        <p className="flex items-center mt-1">
                          <PhoneIcon className={`h-5 w-5 mr-3 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                          <a href={`tel:${formatPhoneNumber(collegePhone)}`} className={`hover:${getPrimaryColorClass(undefined, true)}`}>{collegePhone}</a>
                        </p>
                      )}
                    </div>
                    
                    <hr/>

                    <div>
                       <h3 className="font-semibold text-slate-500 text-sm uppercase tracking-wider mb-2">Specific Contact Point</h3>
                       {contactUsSpecificPhone && (
                        <p className="flex items-center mt-1">
                            <PhoneIcon className={`h-5 w-5 mr-3 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                            <a href={`tel:${formatPhoneNumber(contactUsSpecificPhone)}`} className={`hover:${getPrimaryColorClass(undefined, true)}`}>{contactUsSpecificPhone}</a>
                        </p>
                       )}
                       {contactUsSpecificFax && contactUsSpecificFax.toLowerCase() !== 'n/a' && (
                        <p className="flex items-center mt-2">
                            <PrinterIcon className={`h-5 w-5 mr-3 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                            <span>{contactUsSpecificFax} (Fax)</span>
                        </p>
                       )}
                       {contactUsSpecificEmail && (
                        <p className="flex items-center mt-2">
                            <EnvelopeIcon className={`h-5 w-5 mr-3 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                            <a href={`mailto:${contactUsSpecificEmail}`} className={`hover:${getPrimaryColorClass(undefined, true)}`}>{contactUsSpecificEmail}</a>
                        </p>
                       )}
                       {contactUsSpecificAddress && (
                        <p className="flex items-start mt-2">
                            <MapPinIcon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()} />
                            <span>{contactUsSpecificAddress}</span>
                        </p>
                       )}
                    </div>
                  </div>
                  
                  {contactUsMapEmbedUrl && (
                    <div className="mt-8">
                        <iframe 
                            src={contactUsMapEmbedUrl}
                            width="100%" 
                            height="250" 
                            style={{border:0}} 
                            allowFullScreen={false} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Campus Location Map"
                            className="rounded-md shadow-md"
                        ></iframe>
                    </div>
                  )}
                </div>
              </Card>
            </section>

            {/* Contact Form Section */}
            <section aria-labelledby="contact-form-heading">
              <Card className="shadow-lg h-full">
                <div className="p-6">
                  <h2 id="contact-form-heading" className={`text-2xl font-semibold mb-6 flex items-center ${getPrimaryColorClass('text')}`} style={getPrimaryColorStyle()}>
                    <ChatBubbleLeftRightIcon className="h-7 w-7 mr-2" />
                    {contactUsFormHeading}
                  </h2>
                  {submitSuccess && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center" role="alert">
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <Input id="name" name="name" label="Full Name" value={formData.name} onChange={handleInputChange} error={errors.name} required placeholder="Your Full Name" icon={<FormUserIcon className="h-5 w-5 text-slate-400" />} />
                    <Input id="email" name="email" type="email" label="Email Address" value={formData.email} onChange={handleInputChange} error={errors.email} required placeholder="your.email@example.com" icon={<AtSymbolIcon className="h-5 w-5 text-slate-400" />} />
                    <Input id="phone" name="phone" type="tel" label="Phone Number (Optional)" value={formData.phone} onChange={handleInputChange} placeholder="Your Phone Number" icon={<FormPhoneIcon className="h-5 w-5 text-slate-400" />} />
                    <Input id="subject" name="subject" label="Subject (Optional)" value={formData.subject} onChange={handleInputChange} placeholder="Reason for contacting" icon={<TagIcon className="h-5 w-5 text-slate-400" />} />
                    <Textarea id="message" name="message" label="Your Message" value={formData.message} onChange={handleInputChange} error={errors.message} required rows={5} placeholder="Type your message here..." />
                    
                    <Button type="submit" variant="primary" className={`w-full !py-3 ${submitButtonClass}`} style={submitButtonStyle} isLoading={isSubmitting} disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </Card>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 py-8 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ContactUsPage;
