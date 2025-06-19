
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Added import
import { Photo, AppSettings } from '../types';
import PhotoCard from '../components/PhotoCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { PlusIcon, PhotoIcon as PageIcon, CameraIcon, AcademicCapIcon as DefaultAcademicCapIcon, ArrowLeftIcon, TagIcon } from '@heroicons/react/24/outline'; 
import LoadingSpinner from '../components/LoadingSpinner';
import { DEFAULT_APP_SETTINGS } from '../constants'; // Import default settings

interface PhotoGalleryPageProps {
  photos: Photo[];
  addPhoto?: (photo: Omit<Photo, 'id' | 'uploadDate'>) => void;
  updatePhoto?: (photo: Photo) => void;
  deletePhoto?: (photoId: string) => void;
  headingTextColor?: string;
  isPublicView?: boolean; 
  appSettings?: AppSettings; 
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const initialFormData: Omit<Photo, 'id' | 'uploadDate'> = {
  title: '',
  description: '',
  imageUrl: '',
  category: '',
};

const galleryFilterCategories = ['All', 'Campus Life', 'Events', 'Academics', 'Sports', 'Achievements', 'Community', 'Miscellaneous'];


const PhotoGalleryPage: React.FC<PhotoGalleryPageProps> = ({ 
  photos, 
  addPhoto, 
  updatePhoto, 
  deletePhoto, 
  headingTextColor, 
  isPublicView = false,
  appSettings: pageAppSettings 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState<Omit<Photo, 'id' | 'uploadDate'>>(initialFormData);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const currentAppSettings = pageAppSettings || DEFAULT_APP_SETTINGS;
  const primaryColor = currentAppSettings.primaryColor || DEFAULT_APP_SETTINGS.primaryColor;

  useEffect(() => {
    if (editingPhoto) {
      setFormData({
        title: editingPhoto.title,
        description: editingPhoto.description || '',
        imageUrl: editingPhoto.imageUrl,
        category: editingPhoto.category || '',
      });
      setSelectedFile(null); 
    } else {
      setFormData(initialFormData);
      setSelectedFile(null);
    }
  }, [editingPhoto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPublicView || !addPhoto) return; 

    if (!formData.title) {
        alert("Photo title is required.");
        return;
    }
    if (!editingPhoto && !selectedFile) {
        alert("Please select an image file to upload.");
        return;
    }

    setIsUploading(true);
    let photoDataToSave = { ...formData };

    if (selectedFile) {
      try {
        const base64Image = await fileToBase64(selectedFile);
        photoDataToSave.imageUrl = base64Image;
      } catch (error) {
        console.error("Error converting file to Base64:", error);
        alert("Failed to process image file. Please try again.");
        setIsUploading(false);
        return;
      }
    }
    
    if (editingPhoto && updatePhoto) {
      updatePhoto({ ...editingPhoto, ...photoDataToSave });
    } else if (!editingPhoto && addPhoto) {
      addPhoto(photoDataToSave);
    }
    setIsUploading(false);
    closeModal();
  };

  const openModalForEdit = (photo: Photo) => {
    if (isPublicView || !updatePhoto) return;
    setEditingPhoto(photo);
    setIsModalOpen(true);
  };

  const openModalForNew = () => {
    if (isPublicView || !addPhoto) return;
    setEditingPhoto(null);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPhoto(null);
    setFormData(initialFormData);
    setSelectedFile(null);
  }, []);

  const handleDelete = (photoId: string) => {
    if (isPublicView || !deletePhoto) return;
    if (window.confirm("Are you sure you want to delete this photo? This action cannot be undone.")) {
      deletePhoto(photoId);
    }
  };
  
  const openViewModal = (photo: Photo) => {
    setViewingPhoto(photo);
    setIsViewModalOpen(true);
  };

  const closeViewModal = useCallback(() => {
    setIsViewModalOpen(false);
    setViewingPhoto(null);
  }, []);

  const getPrimaryColorClass = (baseClass: string = 'text', hover: boolean = false): string => {
    if (primaryColor.startsWith('#')) return '';
    const [color, shadeStr = '600'] = primaryColor.split('-');
    let targetShade = parseInt(shadeStr, 10);
    if (hover) targetShade = Math.min(900, targetShade + 100);
    return `${baseClass}-${color}-${targetShade}`;
  };

  const getPrimaryColorStyle = (property: 'color' | 'backgroundColor' | 'borderColor' = 'color'): React.CSSProperties => {
    if (primaryColor.startsWith('#')) return { [property]: primaryColor };
    return {};
  };

  const sortedPhotos = [...photos].sort((a,b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

  const searchedPhotos = sortedPhotos.filter(photo =>
    photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (photo.description && photo.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (photo.category && photo.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const photosToDisplay = activeFilter === 'All' 
    ? searchedPhotos 
    : searchedPhotos.filter(photo => photo.category === activeFilter);

  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : (headingTextColor || 'text-slate-800');
  const pageContainerClass = isPublicView ? 'py-8 px-4 sm:px-6 lg:px-8 bg-slate-100 min-h-screen flex flex-col' : 'space-y-6';

  return (
    <div className={pageContainerClass}>
      {isPublicView && (
         <header className="text-center mb-6 sm:mb-10">
          {currentAppSettings.collegeLogo ? (
              <img src={currentAppSettings.collegeLogo} alt={`${currentAppSettings.appName} Logo`} className="h-16 sm:h-20 w-auto object-contain mx-auto mb-2 rounded-md" />
          ) : (
              <DefaultAcademicCapIcon className="h-12 sm:h-16 w-16 text-sky-600 mx-auto mb-2" />
          )}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">{currentAppSettings.appName}</h1>
        </header>
      )}
      <div className={`${isPublicView ? 'max-w-7xl mx-auto flex-grow' : ''}`}>
        <div className={`flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 ${isPublicView ? 'px-2 sm:px-4' : ''}`}>
          {isPublicView ? (
             <h2 className="text-2xl sm:text-3xl font-semibold text-slate-700 self-start sm:self-center">Home Gallery</h2>
          ) : (
            <h2 className={`text-3xl font-semibold ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>
                <PageIcon className="h-8 w-8 inline-block mr-2 align-text-bottom" />
                Photo Gallery
            </h2>
          )}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto self-end sm:self-center">
            <Input 
              id="search-photos"
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-56 md:w-64 !mb-0" // Adjusted width
            />
            {!isPublicView && addPhoto && (
              <Button onClick={openModalForNew} leftIcon={<PlusIcon className="h-5 w-5"/>} className="w-full sm:w-auto">
                Add Photo
              </Button>
            )}
          </div>
        </div>

        {/* Category Filters */}
            <div className={`mb-6 sm:mb-8 px-2 sm:px-4 flex flex-wrap gap-2 items-center border-b pb-4 border-slate-200`}>
                <TagIcon className={`h-5 w-5 mr-1 hidden sm:inline ${getPrimaryColorClass()}`} style={getPrimaryColorStyle()}/>
                <span className="text-sm font-medium text-slate-600 mr-2 hidden sm:inline">Categories:</span>
                {galleryFilterCategories.map(category => (
                    <Button
                        key={category}
                        variant={activeFilter === category ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setActiveFilter(category)}
                        className={`
                            ${activeFilter === category && primaryColor.startsWith('#') ? 'text-white' : ''}
                            ${activeFilter === category && !primaryColor.startsWith('#') ? `bg-${primaryColor} text-white hover:bg-${primaryColor.split('-')[0]}-${Math.min(900, parseInt(primaryColor.split('-')[1] || '600') + 100)}` : ''}
                        `}
                        style={activeFilter === category && primaryColor.startsWith('#') ? getPrimaryColorStyle('backgroundColor') : {}}
                    >
                        {category}
                    </Button>
                ))}
            </div>

        {photosToDisplay.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ${isPublicView ? 'px-2 sm:px-4' : ''}`}>
            {photosToDisplay.map((photo) => (
              <PhotoCard 
                  key={photo.id} 
                  photo={photo} 
                  onView={openViewModal}
                  onEdit={!isPublicView && updatePhoto ? openModalForEdit : undefined}
                  onDelete={!isPublicView && deletePhoto ? handleDelete : undefined}
                  isPublicView={isPublicView}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-10 ${isPublicView ? 'bg-white rounded-lg shadow p-8' : ''}`}>
            <CameraIcon className="h-20 sm:h-24 w-auto text-slate-300 mx-auto mb-4" />
            <p className="text-lg sm:text-xl text-slate-600">No photos found.</p>
            {photos.length > 0 && (searchTerm || activeFilter !== 'All') && <p className="text-sm text-slate-500">Try adjusting your search or filter.</p>}
            {photos.length === 0 && !isPublicView && <p className="text-sm text-slate-500">Click "Add Photo" to upload images to the gallery.</p>}
            {photos.length === 0 && isPublicView && <p className="text-sm text-slate-500">The gallery is currently empty. Check back later!</p>}
          </div>
        )}
      </div>

      {!isPublicView && (
        <Modal isOpen={isModalOpen} onClose={closeModal} title={editingPhoto ? "Edit Photo Details" : "Add New Photo"}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Photo Title *" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            <Textarea label="Description (Optional)" id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={3} />
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                >
                    <option value="">Select a category</option>
                    {galleryFilterCategories.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>
            <div>
              <label htmlFor="imageFile" className="block text-sm font-medium text-gray-700 mb-1">
                Image File {!editingPhoto && <span className="text-red-500">*</span>}
              </label>
              <input
                id="imageFile"
                name="imageFile"
                type="file"
                accept="image/jpeg, image/png, image/gif, image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100"
              />
              {selectedFile && <p className="text-xs text-slate-500 mt-1">Selected: {selectedFile.name}</p>}
              {editingPhoto && !selectedFile && <p className="text-xs text-slate-500 mt-1">Current image will be kept if no new file is selected.</p>}
            </div>

            {isUploading && <LoadingSpinner size="sm" className="my-2" />}

            <div className="flex justify-end space-x-3 pt-2">
              <Button type="button" variant="ghost" onClick={closeModal} disabled={isUploading}>Cancel</Button>
              <Button type="submit" variant="primary" isLoading={isUploading} disabled={isUploading}>
                {editingPhoto ? "Save Changes" : "Add Photo"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {viewingPhoto && (
        <Modal isOpen={isViewModalOpen} onClose={closeViewModal} title={viewingPhoto.title}>
            <div className="space-y-4">
                <img 
                    src={viewingPhoto.imageUrl} 
                    alt={viewingPhoto.title} 
                    className="max-w-full max-h-[70vh] w-auto h-auto object-contain rounded-md mx-auto shadow-lg" 
                />
                 {viewingPhoto.category && (
                    <div className="text-center mt-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-700">
                            <TagIcon className="h-4 w-4 mr-1.5" />
                            {viewingPhoto.category}
                        </span>
                    </div>
                )}
                {viewingPhoto.description && (
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md">{viewingPhoto.description}</p>
                )}
                <p className="text-xs text-slate-400 text-center">Uploaded: {new Date(viewingPhoto.uploadDate).toLocaleDateString()}</p>
            </div>
             <div className="pt-4 flex justify-end">
                <Button variant="ghost" onClick={closeViewModal}>Close</Button>
            </div>
        </Modal>
      )}
      {isPublicView && (
        <footer className="text-center mt-auto pt-6 pb-8 border-t border-slate-200">
          <Link to="/" className="group inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 transition-colors duration-150 mb-3">
            <ArrowLeftIcon className="h-4 w-4 mr-1.5 transition-transform duration-150 group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} {currentAppSettings.appName}. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
};

export default PhotoGalleryPage;
