
import React, { useState, useEffect, useCallback } from 'react';
import { Course } from '../types';
import CourseCard from '../components/CourseCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea'; 
import { generateCourseDescription, isGeminiApiKeyConfigured } from '../services/geminiService'; // Added isGeminiApiKeyConfigured
import LoadingSpinner from '../components/LoadingSpinner';
import { PlusIcon, SparklesIcon, BookOpenIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface CoursesPageProps {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
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

const initialFormData = {
  title: '',
  code: '',
  description: '',
  credits: 0,
  department: '',
  coverImageUrl: '',
};

const CoursesPage: React.FC<CoursesPageProps> = ({ courses, addCourse, updateCourse, deleteCourse, headingTextColor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<Omit<Course, 'id'>>(initialFormData);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | undefined>(undefined);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [geminiAvailable, setGeminiAvailable] = useState<boolean>(false); // State for Gemini availability

  useEffect(() => {
    setGeminiAvailable(isGeminiApiKeyConfigured());
  }, []);


  const resetFormState = useCallback(() => {
    setFormData(initialFormData);
    setSelectedCoverFile(null);
    setCoverImagePreview(undefined);
  }, []);

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title,
        code: editingCourse.code,
        description: editingCourse.description,
        credits: editingCourse.credits,
        department: editingCourse.department || '',
        coverImageUrl: editingCourse.coverImageUrl || '',
      });
      setCoverImagePreview(editingCourse.coverImageUrl);
      setSelectedCoverFile(null);
    } else {
      resetFormState();
    }
  }, [editingCourse, resetFormState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'credits' ? parseInt(value, 10) || 0 : value }));
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
        // No need to set formData.coverImageUrl here, it will be processed on submit
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedCoverFile(null);
      // If editing, keep existing image if no new file is selected, unless explicitly removed
      if(editingCourse) {
        setCoverImagePreview(formData.coverImageUrl); // Revert to original if file selection is cancelled
      } else {
        setCoverImagePreview(undefined);
      }
    }
  };

  const handleRemoveCoverImage = () => {
    setSelectedCoverFile(null);
    setCoverImagePreview(undefined);
    setFormData(prev => ({ ...prev, coverImageUrl: '' })); // Clear from formData as well
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.credits <= 0) {
      alert("Credits must be a positive number.");
      return;
    }
    
    setIsUploadingCover(true);
    let finalCoverImageUrl = formData.coverImageUrl;

    if (selectedCoverFile) {
      try {
        finalCoverImageUrl = await fileToBase64(selectedCoverFile);
      } catch (error) {
        console.error("Error converting cover image to Base64:", error);
        alert("Failed to process cover image. Please try again.");
        setIsUploadingCover(false);
        return;
      }
    }
    
    const courseDataToSave = { ...formData, coverImageUrl: finalCoverImageUrl };

    if (editingCourse) {
      updateCourse({ ...editingCourse, ...courseDataToSave });
    } else {
      addCourse(courseDataToSave);
    }
    setIsUploadingCover(false);
    closeModal();
  };

  const handleGenerateDescription = async () => {
    if (!formData.title) {
      alert("Please enter a course title first to generate a description.");
      return;
    }
    if (!geminiAvailable) {
      alert("AI description generation is currently unavailable. Please check API configuration.");
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const description = await generateCourseDescription(formData.title);
      if (description.startsWith("Error:")) {
        alert(description); // Show error from service
      } else {
        setFormData(prev => ({ ...prev, description }));
      }
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Failed to generate description. See console for details.");
    } finally {
      setIsGeneratingDesc(false);
    }
  };
  
  const openModalForEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingCourse(null);
    resetFormState();
  }, [resetFormState]);
  
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (course.department && course.department.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title

  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : headingTextColor;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Manage Courses</h2>
         <div className="flex gap-2 w-full sm:w-auto">
            <Input 
                id="search-courses"
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 !mb-0"
            />
            <Button onClick={openModalForNew} leftIcon={<BookOpenIcon className="h-5 w-5" />}>
            Add Course
            </Button>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Added xl:grid-cols-4 for larger screens */}
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} onDelete={deleteCourse} onEdit={openModalForEdit}/>
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
          <img src="https://picsum.photos/seed/empty-courses/400/300" alt="No courses found" className="mx-auto mb-4 rounded-lg shadow-md h-60 w-auto object-cover" />
          <p className="text-xl text-slate-600">No courses found.</p>
          {courses.length > 0 && searchTerm && <p className="text-sm text-slate-500">Try adjusting your search term.</p>}
          {courses.length === 0 && <p className="text-sm text-slate-500">Click "Add Course" to get started.</p>}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCourse ? "Edit Course" : "Add New Course"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Course Title" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
          <Input label="Course Code" id="code" name="code" value={formData.code} onChange={handleInputChange} required />
          <Input label="Department (Optional)" id="department" name="department" value={formData.department} onChange={handleInputChange} />
          <Input label="Credits" id="credits" name="credits" type="number" value={formData.credits.toString()} onChange={handleInputChange} required min="1" />
          
          <div className="relative">
            <Textarea label="Description" id="description" name="description" value={formData.description} onChange={handleInputChange} rows={3} required />
            <Button
              type="button"
              onClick={handleGenerateDescription}
              isLoading={isGeneratingDesc}
              disabled={isGeneratingDesc || !formData.title || !geminiAvailable}
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 mt-1 mr-1 !py-1"
              leftIcon={<SparklesIcon className="h-4 w-4 text-yellow-500"/>}
              title={!geminiAvailable ? "AI Suggestion unavailable (API not configured)" : "Suggest description using AI"}
            >
              {isGeneratingDesc ? 'Generating...' : 'AI Suggest'}
            </Button>
          </div>
          {isGeneratingDesc && <LoadingSpinner size="sm" className="my-1"/>}
          {!geminiAvailable && formData.title && (
             <p className="text-xs text-amber-600 -mt-2">AI Suggestion unavailable. API key might not be configured.</p>
          )}


          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image (Optional)
            </label>
            <div className="mt-1 flex items-center space-x-3">
              {coverImagePreview ? (
                <div className="relative group">
                  <img src={coverImagePreview} alt="Cover preview" className="h-20 w-32 object-cover rounded-md border border-gray-300" />
                  <Button
                    type="button"
                    onClick={handleRemoveCoverImage}
                    variant="danger"
                    size="sm"
                    className="absolute top-0 right-0 p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity !leading-none"
                    aria-label="Remove cover image"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="h-20 w-32 bg-slate-100 rounded-md flex items-center justify-center border border-gray-300">
                  <PhotoIcon className="h-10 w-10 text-slate-400" />
                </div>
              )}
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={handleCoverImageChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            {selectedCoverFile && <p className="text-xs text-slate-500 mt-1">New: {selectedCoverFile.name}</p>}
          </div>
           {isUploadingCover && <LoadingSpinner size="sm" className="my-1"/>}


          <div className="flex justify-end space-x-3 pt-2 border-t mt-6">
            <Button type="button" variant="ghost" onClick={closeModal} disabled={isUploadingCover || isGeneratingDesc}>Cancel</Button>
            <Button type="submit" variant="primary" isLoading={isUploadingCover || isGeneratingDesc} disabled={isUploadingCover || isGeneratingDesc}>
                {editingCourse ? "Save Changes" : "Add Course"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CoursesPage;
