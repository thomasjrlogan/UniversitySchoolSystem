
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppSettings, MobileMoneyOption } from '../types';
import { DEFAULT_APP_SETTINGS } from '../constants';
import { AcademicCapIcon, ArrowLeftIcon, BanknotesIcon, DevicePhoneMobileIcon, InformationCircleIcon, CreditCardIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Modal from '../components/Modal';

interface StudentPaymentStatusPageProps {
  appSettings: AppSettings;
}

const StudentPaymentStatusPage: React.FC<StudentPaymentStatusPageProps> = ({ appSettings }) => {
  const { 
    appName = DEFAULT_APP_SETTINGS.appName, 
    collegeLogo,
    // Primary Bank
    bankName, bankAccountName, bankAccountNumber, bankSwiftCode,
    // Mobile Money
    mobileMoneyOptions = [], // Default to empty array if not present
    // UBA Bank
    ubaBankName, ubaBankAccountName, ubaBankAccountNumber, ubaBankSwiftCode,
    // LBDI Bank
    lbtiBankName, lbtiBankAccountName, lbtiBankAccountNumber, lbtiBankSwiftCode,
    // Asset Bank
    assetBankName, assetBankAccountName, assetBankAccountNumber, assetBankSwiftCode,
  } = appSettings;

  const [amountToPay, setAmountToPay] = useState('');
  const [paymentReference, setPaymentReference] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMobileMoneyOption, setSelectedMobileMoneyOption] = useState<MobileMoneyOption | null>(null);
  const [paymentError, setPaymentError] = useState('');

  const handleOpenPaymentModal = (option: MobileMoneyOption) => {
    setPaymentError('');
    if (!amountToPay || parseFloat(amountToPay) <= 0) {
      setPaymentError('Please enter a valid amount to pay.');
      return;
    }
    if (!paymentReference.trim()) {
      setPaymentError('Please enter a payment reference (e.g., your Student ID).');
      return;
    }
    setSelectedMobileMoneyOption(option);
    setIsModalOpen(true);
  };

  const primaryColor = appSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor;
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

  const payButtonClass = `
    ${getButtonBgColor()} 
    ${getButtonTextColor()} 
    ${getButtonHoverBgColor()}
  `;
  const payButtonStyle = primaryColor.startsWith('#') ? { backgroundColor: primaryColor } : {};

  const renderBankPaymentDetails = (title: string, bName?: string, bAccName?: string, bAccNum?: string, bSwift?: string) => {
    if (bAccNum && bName && bAccName) {
      return (
        <div className="mb-4 p-3 border rounded-md bg-white shadow-sm">
          <h4 className="font-semibold text-sky-600 mb-1 flex items-center"><CreditCardIcon className="h-5 w-5 mr-2"/>{title}:</h4>
          <p className="text-xs"><strong>Bank Name:</strong> {bName}</p>
          <p className="text-xs"><strong>Account Name:</strong> {bAccName}</p>
          <p className="text-xs"><strong>Account Number:</strong> {bAccNum}</p>
          {bSwift && <p className="text-xs"><strong>SWIFT/BIC Code:</strong> {bSwift}</p>}
        </div>
      );
    }
    return null;
  };

  const enabledMobileMoneyOptions = mobileMoneyOptions.filter(opt => opt.isEnabled && opt.providerName && opt.accountNumber);

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
          <BanknotesIcon className="h-8 w-8 mr-2 text-slate-500" /> Payment Status &amp; Options
        </p>
      </header>

      <div className="max-w-2xl mx-auto space-y-8">
        <Card className="shadow-xl">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Outstanding Fees</h2>
                <div className="bg-sky-50 p-4 rounded-md text-center">
                    <p className="text-sm text-sky-700">Your current outstanding balance is:</p>
                    <p className="text-3xl font-bold text-sky-600">$0.00</p>
                    <p className="text-xs text-slate-500 mt-1">(This is a placeholder. Actual fee data would be shown here.)</p>
                </div>
            </div>
        </Card>

        <Card className="shadow-xl">
            <div className="p-6 space-y-5">
                <h2 className="text-xl font-semibold text-slate-700 mb-1">Make a Payment</h2>
                <p className="text-sm text-slate-500 mb-4">
                  Enter the amount you wish to pay and a reference for your payment. Then, select a payment method.
                </p>
                
                <Input
                    id="amountToPay"
                    label="Amount to Pay ($)"
                    type="number"
                    value={amountToPay}
                    onChange={(e) => setAmountToPay(e.target.value)}
                    placeholder="e.g., 50.00"
                    min="0.01"
                    step="0.01"
                />
                <Input
                    id="paymentReference"
                    label="Payment Reference"
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="e.g., Student ID, Invoice #"
                />

                {paymentError && (
                  <p role="alert" className="text-sm text-red-600 bg-red-100 p-2 rounded-md">{paymentError}</p>
                )}
                
                <hr/>
                <h3 className="text-lg font-medium text-slate-600">Payment Methods:</h3>

                {/* Mobile Money Options */}
                {enabledMobileMoneyOptions.length > 0 ? (
                    enabledMobileMoneyOptions.map(option => (
                        <Button
                            key={option.id}
                            onClick={() => handleOpenPaymentModal(option)}
                            leftIcon={<DevicePhoneMobileIcon className="h-5 w-5" />}
                            className={`w-full ${payButtonClass} mb-2`} // Added mb-2 for spacing between buttons
                            style={payButtonStyle}
                        >
                            Pay with {option.providerName}
                        </Button>
                    ))
                ) : (
                    <p className="text-xs text-amber-600 text-center py-2 bg-amber-50 border border-amber-200 rounded-md">
                        No Mobile Money payment options are currently configured by the administrator.
                    </p>
                )}
                
                {/* Bank Payments */}
                <div className="space-y-3 pt-2">
                    {renderBankPaymentDetails("Primary Bank", bankName, bankAccountName, bankAccountNumber, bankSwiftCode)}
                    {renderBankPaymentDetails(ubaBankName || "UBA Bank", ubaBankName, ubaBankAccountName, ubaBankAccountNumber, ubaBankSwiftCode)}
                    {renderBankPaymentDetails(lbtiBankName || "LBDI Bank", lbtiBankName, lbtiBankAccountName, lbtiBankAccountNumber, lbtiBankSwiftCode)}
                    {renderBankPaymentDetails(assetBankName || "International Bank", assetBankName, assetBankAccountName, assetBankAccountNumber, assetBankSwiftCode)}
                </div>
                
                {(bankAccountNumber || ubaBankAccountNumber || lbtiBankAccountNumber || assetBankAccountNumber) && (
                    <div className="mt-1 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm flex items-start">
                        <InformationCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"/>
                        <div>
                        <strong>Bank Payment Note:</strong> When making a bank deposit or transfer, please use your <strong>Payment Reference</strong> ({paymentReference || "Your Student ID"}) in the transaction details. After payment, keep your deposit slip or transaction confirmation and follow the institution's procedure for payment verification.
                        </div>
                    </div>
                )}

                 <p className="text-xs text-slate-500 text-center mt-2">
                    Further payment methods (e.g., Card Payment) would be listed here if available.
                </p>
            </div>
        </Card>
        
        <Card className="shadow-xl">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-700 mb-4">Payment History</h2>
                <p className="text-slate-500 text-center py-4">
                    Your payment history will be displayed here. (Placeholder)
                </p>
                {/* Placeholder for payment history table/list */}
            </div>
        </Card>

      </div>

      <div className="mt-10 text-center">
        <Link to="/student-dashboard">
          <Button variant="ghost" leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
            Back to Student Dashboard
          </Button>
        </Link>
      </div>
      <p className="text-center text-xs text-slate-500 mt-12">&copy; {new Date().getFullYear()} {appName}. All rights reserved.</p>

      {selectedMobileMoneyOption && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`${selectedMobileMoneyOption.providerName} Payment Instructions`}>
            <div className="space-y-4">
            <p className="text-sm text-slate-600">
                To complete your payment of <strong className="text-sky-600">${parseFloat(amountToPay).toFixed(2)}</strong>, please follow these steps:
            </p>
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <p className="text-sm text-slate-700 mb-1"><strong>Provider:</strong> {selectedMobileMoneyOption.providerName}</p>
                <p className="text-sm text-slate-700 mb-1"><strong>Account Number:</strong> <strong className="text-sky-700">{selectedMobileMoneyOption.accountNumber}</strong></p>
                <p className="text-sm text-slate-700 mb-1"><strong>Amount:</strong> <strong className="text-sky-700">${parseFloat(amountToPay).toFixed(2)}</strong></p>
                <p className="text-sm text-slate-700"><strong>Reference:</strong> <strong className="text-sky-700">{paymentReference}</strong></p>
                {selectedMobileMoneyOption.instructions && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-700 mb-1">Instructions:</p>
                    <p className="text-xs text-slate-600 whitespace-pre-wrap">{selectedMobileMoneyOption.instructions}</p>
                </div>
                )}
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm flex items-start">
                <InformationCircleIcon className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"/>
                <div>
                <strong>Important:</strong> This is a manual payment process. After completing the transaction, please keep your transaction ID and receipt. You may need to inform the accounts office or follow your institution's specific procedure for payment confirmation.
                </div>
            </div>
            </div>
            <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={() => setIsModalOpen(false)} className={`${payButtonClass}`} style={payButtonStyle}>
                Okay, I Understand
            </Button>
            </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentPaymentStatusPage;
