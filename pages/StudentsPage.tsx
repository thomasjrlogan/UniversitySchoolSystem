
import React, { useState, useEffect } from 'react';
import { Student, UploadedFile } from '../types';
import StudentCard from '../components/StudentCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea'; 
import { PlusIcon, UserPlusIcon, PhotoIcon as PhotoPlaceholderIcon, XCircleIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

interface StudentsPageProps {
  students: Student[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  headingTextColor?: string;
}

const initialFormData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  major: '',
  studentIdNumber: '', 
  adminProgressNotes: '', 
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const StudentsPage: React.FC<StudentsPageProps> = ({ students, addStudent, updateStudent, deleteStudent, headingTextColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | undefined>(undefined);
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false);
  const [isPhotoMarkedForRemovalOnSave, setIsPhotoMarkedForRemovalOnSave] = useState(false);


  useEffect(() => {
    if (editingStudent) {
      setFormData({
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        email: editingStudent.email,
        dateOfBirth: editingStudent.dateOfBirth,
        major: editingStudent.major || '',
        studentIdNumber: editingStudent.studentIdNumber || '', 
        adminProgressNotes: editingStudent.adminProgressNotes || '',
      });
      setPhotoPreview(editingStudent.passportPhoto?.fileData);
      setSelectedPhotoFile(null);
      setIsPhotoMarkedForRemovalOnSave(false);
    } else {
      setFormData(initialFormData);
      setPhotoPreview(undefined);
      setSelectedPhotoFile(null);
      setIsPhotoMarkedForRemovalOnSave(false);
    }
  }, [editingStudent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        alert("Photo size should not exceed 2MB.");
        e.target.value = ''; // Reset file input
        return;
      }
      setSelectedPhotoFile(file);
      setIsPhotoMarkedForRemovalOnSave(false); // New file selected, so not removing existing one
      const reader = new FileReader();
      reader.onloadstart = () => setIsPhotoProcessing(true);
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setIsPhotoProcessing(false);
      };
      reader.onerror = () => {
        alert("Error reading file.");
        setIsPhotoProcessing(false);
      }
      reader.readAsDataURL(file);
    } else {
      // If selection is cancelled, and we are editing, revert to original preview
      if (editingStudent) {
        setPhotoPreview(editingStudent.passportPhoto?.fileData);
      }
      setSelectedPhotoFile(null);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedPhotoFile(null);
    setPhotoPreview(undefined);
    setIsPhotoMarkedForRemovalOnSave(true); // Mark that the photo should be removed on save
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPhotoProcessing(true);

    let finalPassportPhoto: UploadedFile | undefined;

    if (selectedPhotoFile) {
      try {
        const base64Data = await fileToBase64(selectedPhotoFile);
        finalPassportPhoto = {
          fileName: selectedPhotoFile.name,
          fileType: selectedPhotoFile.type,
          fileData: base64Data,
        };
      } catch (error) {
        console.error("Error processing passport photo:", error);
        alert("Failed to process passport photo. Please try again.");
        setIsPhotoProcessing(false);
        return;
      }
    } else if (editingStudent && !isPhotoMarkedForRemovalOnSave) {
      finalPassportPhoto = editingStudent.passportPhoto;
    } else {
      finalPassportPhoto = undefined;
    }
    
    const dataToSave = {
      ...formData,
      studentIdNumber: formData.studentIdNumber || undefined,
      passportPhoto: finalPassportPhoto,
    };

    if (editingStudent) {
      updateStudent({ ...editingStudent, ...dataToSave });
    } else {
      addStudent(dataToSave);
    }
    setIsPhotoProcessing(false);
    closeModal();
  };

  const openModalForEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingStudent(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData(initialFormData);
    setSelectedPhotoFile(null);
    setPhotoPreview(undefined);
    setIsPhotoProcessing(false);
    setIsPhotoMarkedForRemovalOnSave(false);
  };

  const filteredStudents = students.filter(student =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.major && student.major.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.studentIdNumber && student.studentIdNumber.toLowerCase().includes(searchTerm.toLowerCase())) 
  ).sort((a,b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));


  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : headingTextColor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Manage Students</h2>
        <div className="flex gap-2 w-full sm:w-auto">
            <Input 
                id="search-students"
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 !mb-0"
            />
            <Button onClick={openModalForNew} leftIcon={<UserPlusIcon className="h-5 w-5"/>}>
            Add Student
            </Button>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} onDelete={deleteStudent} onEdit={openModalForEdit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <img src="https://picsum.photos/seed/empty-students/400/300" alt="No students found" className="mx-auto mb-4 rounded-lg shadow-md h-60 w-auto object-cover" />
          <p className="text-xl text-slate-600">No students found.</p>
          {students.length > 0 && searchTerm && <p className="text-sm text-slate-500">Try adjusting your search term.</p>}
          {students.length === 0 && <p className="text-sm text-slate-500">Click "Add Student" to get started.</p>}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStudent ? "Edit Student" : "Add New Student"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="First Name" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
          <Input label="Last Name" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
          <Input label="Email" id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
          <Input label="Student ID Number (Optional)" id="studentIdNumber" name="studentIdNumber" value={formData.studentIdNumber} onChange={handleInputChange} placeholder="e.g., CUC2024001" />
          <Input label="Date of Birth" id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} required />
          <Input label="Major (Optional)" id="major" name="major" value={formData.major} onChange={handleInputChange} />
          
          <div>
            <label htmlFor="passportPhoto" className="block text-sm font-medium text-gray-700 mb-1">
              Passport Photo (Optional)
            </label>
            <div className="mt-1 flex items-center space-x-3">
              {photoPreview ? (
                <img src={photoPreview} alt="Passport Preview" className="h-20 w-20 object-cover rounded-md border border-gray-300" />
              ) : (
                <div className="h-20 w-20 bg-slate-100 rounded-md flex items-center justify-center border border-gray-300">
                  <PhotoPlaceholderIcon className="h-10 w-10 text-slate-400" />
                </div>
              )}
              <input
                type="file"
                id="passportPhoto"
                name="passportPhoto"
                accept="image/png, image/jpeg"
                onChange={handlePhotoFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            {photoPreview && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleRemovePhoto} 
                leftIcon={<XCircleIcon className="h-4 w-4"/>}
                className="mt-2 !text-red-600 hover:!bg-red-50"
              >
                Remove Photo
              </Button>
            )}
            {selectedPhotoFile && <p className="text-xs text-slate-500 mt-1">New: {selectedPhotoFile.name}</p>}
            <p className="text-xs text-slate-500 mt-1">Recommended: Square JPG or PNG, max 2MB.</p>
          </div>

          {isPhotoProcessing && <LoadingSpinner size="sm" className="my-1"/>}

          <Textarea
            label="Admin Progress Notes (Optional)"
            id="adminProgressNotes"
            name="adminProgressNotes"
            value={formData.adminProgressNotes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Enter any progress notes for this student..."
          />
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isPhotoProcessing}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isPhotoProcessing} disabled={isPhotoProcessing}>
                {editingStudent ? "Save Changes" : "Add Student"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentsPage;
