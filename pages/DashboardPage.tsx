
import React, { useState, useEffect } from 'react';
import { Student, Course, Enrollment, Lecturer, CalendarEvent, CalendarEventType, NewsItem } from '../types';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import { UsersIcon, BookOpenIcon, ClipboardDocumentCheckIcon, UserGroupIcon, PencilIcon, TrashIcon, PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'; 
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { UserManagementIcon, CalendarIcon as CustomCalendarIcon, NewspaperIcon, ChatBubbleBottomCenterTextIcon } from '../constants'; 

interface DashboardPageProps {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  lecturers: Lecturer[];
  calendarEvents: CalendarEvent[];
  newsItems: NewsItem[];
  addNewsItem: (newsData: Omit<NewsItem, 'id' | 'date' | 'author'>) => void;
  updateNewsItem: (updatedNews: NewsItem) => void;
  deleteNewsItem: (newsId: string) => void;
  updateStudent: (updatedStudent: Student) => void; 
  updateEnrollmentGrade: (enrollmentId: string, newGrade: string | undefined) => void; // Added prop
  headingTextColor?: string;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode; linkTo?: string; bgColorClass: string; textColorClass: string; actionText?: string; titleColor?: string; }> = 
  ({ title, value, icon, linkTo, bgColorClass, textColorClass, actionText = "View Details", titleColor }) => (
  <Card className={`shadow-xl hover:scale-105 transform transition-all duration-300 ${bgColorClass}`} titleColor={titleColor}>
    <div className={`flex items-center p-2 rounded-full w-12 h-12 mb-4 ${textColorClass} bg-opacity-20 bg-white`}>
      {icon}
    </div>
    <h4 className={`text-3xl font-bold mb-1 ${textColorClass}`}>{value}</h4>
    <p className={`text-md font-medium ${textColorClass} opacity-90`}>{title}</p>
    {linkTo && (
      <Link to={linkTo}>
        <Button variant="ghost" size="sm" className={`mt-4 !text-white !border-white !border-opacity-50 hover:!bg-white hover:!bg-opacity-20`}>
          {actionText}
        </Button>
      </Link>
    )}
  </Card>
);

const getEventTypeStyles = (type: CalendarEventType): { dot: string, text: string } => {
  switch (type) {
    case 'Holiday': return { dot: 'bg-blue-500', text: 'text-blue-700' };
    case 'Exam': return { dot: 'bg-red-500', text: 'text-red-700' };
    case 'Event': return { dot: 'bg-green-500', text: 'text-green-700' };
    case 'Deadline': return { dot: 'bg-orange-500', text: 'text-orange-700' };
    case 'Registration': return { dot: 'bg-purple-500', text: 'text-purple-700' };
    default: return { dot: 'bg-gray-500', text: 'text-gray-700' };
  }
};

const formatDate = (dateString: string, includeTime: boolean = false): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  return date.toLocaleDateString(undefined, options);
};

const GRADE_OPTIONS = ["A", "B", "C", "D", "F", "I", "NG"];


const DashboardPage: React.FC<DashboardPageProps> = ({ 
  students, courses, enrollments, lecturers, calendarEvents, 
  newsItems, addNewsItem, updateNewsItem, deleteNewsItem, updateStudent,
  updateEnrollmentGrade, // Destructure new prop
  headingTextColor 
}) => {
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);
  const [newsFormData, setNewsFormData] = useState({ title: '', content: '' });

  const [selectedStudentIdForNotes, setSelectedStudentIdForNotes] = useState<string>('');
  const [currentStudentNote, setCurrentStudentNote] = useState<string>('');
  
  const [selectedStudentIdForGrades, setSelectedStudentIdForGrades] = useState<string>(''); // New state for grade editing

  useEffect(() => {
    if (editingNewsItem) {
      setNewsFormData({ title: editingNewsItem.title, content: editingNewsItem.content });
    } else {
      setNewsFormData({ title: '', content: '' });
    }
  }, [editingNewsItem]);
  
  useEffect(() => {
    if (selectedStudentIdForNotes) {
      const student = students.find(s => s.id === selectedStudentIdForNotes);
      setCurrentStudentNote(student?.adminProgressNotes || '');
    } else {
      setCurrentStudentNote('');
    }
  }, [selectedStudentIdForNotes, students]);


  const handleNewsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsFormData.title.trim() || !newsFormData.content.trim()) {
      alert("News title and content cannot be empty.");
      return;
    }
    if (editingNewsItem) {
      updateNewsItem({ ...editingNewsItem, ...newsFormData });
    } else {
      addNewsItem(newsFormData);
    }
    closeNewsModal();
  };

  const openNewsModalForEdit = (newsItem: NewsItem) => {
    setEditingNewsItem(newsItem);
    setIsNewsModalOpen(true);
  };

  const openNewsModalForNew = () => {
    setEditingNewsItem(null);
    setIsNewsModalOpen(true);
  };

  const closeNewsModal = () => {
    setIsNewsModalOpen(false);
    setEditingNewsItem(null);
    setNewsFormData({ title: '', content: '' });
  };
  
  const handleDeleteNews = (newsId: string) => {
    if (window.confirm("Are you sure you want to delete this news post?")) {
        deleteNewsItem(newsId);
    }
  };

  const handleSaveStudentNote = () => {
    if (!selectedStudentIdForNotes) return;
    const studentToUpdate = students.find(s => s.id === selectedStudentIdForNotes);
    if (studentToUpdate) {
      updateStudent({ ...studentToUpdate, adminProgressNotes: currentStudentNote });
      alert(`Note saved for ${studentToUpdate.firstName} ${studentToUpdate.lastName}.`);
    }
  };

  const handleGradeChange = (enrollmentId: string, newGradeValue: string) => {
    const gradeToSave = newGradeValue === 'NG' ? undefined : newGradeValue;
    updateEnrollmentGrade(enrollmentId, gradeToSave);
  };


  const recentEnrollments = enrollments
    .sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime())
    .slice(0, 5);

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.firstName} ${student.lastName}` : 'Unknown Student';
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingCalendarEvents = calendarEvents
    .filter(event => event.date >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4); 

  const sortedNewsItems = newsItems.slice(0, 4); 

  const dynamicHeadingStyle = headingTextColor?.startsWith('#') ? { color: headingTextColor } : {};
  const dynamicHeadingClass = headingTextColor?.startsWith('#') ? '' : headingTextColor;

  const studentEnrollmentsForGradeEditing = enrollments.filter(e => e.studentId === selectedStudentIdForGrades);


  return (
    <div className="space-y-8">
      <section>
        <h2 className={`text-3xl font-semibold mb-6 ${dynamicHeadingClass}`} style={dynamicHeadingStyle}>Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Students" value={students.length} icon={<UsersIcon className="h-6 w-6" />} linkTo="/students" bgColorClass="bg-sky-600" textColorClass="text-white" />
          <StatCard title="Total Lecturers" value={lecturers.length} icon={<UserGroupIcon className="h-6 w-6" />} linkTo="/admin/users" bgColorClass="bg-purple-600" textColorClass="text-white" actionText="Manage Users"/>
          <StatCard title="Total Courses" value={courses.length} icon={<BookOpenIcon className="h-6 w-6" />} linkTo="/courses" bgColorClass="bg-indigo-600" textColorClass="text-white"/>
          <StatCard title="Total Enrollments" value={enrollments.length} icon={<ClipboardDocumentCheckIcon className="h-6 w-6" />} linkTo="/enrollments" bgColorClass="bg-emerald-600" textColorClass="text-white"/>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <Card title="Recent Enrollments" className="shadow-xl h-full" titleColor={headingTextColor}>
                {recentEnrollments.length > 0 ? (
                <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {recentEnrollments.map(enrollment => (
                    <li key={enrollment.id} className="py-3 px-1 hover:bg-slate-50 rounded-md transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-sky-700">{getStudentName(enrollment.studentId)}</p>
                            <p className="text-xs text-slate-500">enrolled in <span className="font-semibold">{getCourseName(enrollment.courseId)}</span></p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 sm:mt-0">{new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <p className="text-slate-500 text-center py-4">No recent enrollments.</p>
                )}
            </Card>
             <Card title="User Management" className="shadow-xl" titleClassName="flex items-center" actionsClassName="!bg-white" titleColor={headingTextColor}>
                <div className="flex items-center text-slate-700 mb-2">
                    <UserManagementIcon className="h-8 w-8 text-purple-600 mr-3" />
                    <p className="text-sm">Manage student records. Lecturer and other user type management can be expanded here in future versions.</p>
                </div>
                 <div className="mt-4">
                     <Link to="/students"> 
                        <Button variant="secondary" size="sm" className="w-full">
                            Manage Students
                        </Button>
                    </Link>
                 </div>
            </Card>
            <Card className="shadow-xl" titleColor={headingTextColor}>
                <div className="flex items-center p-5 border-b border-gray-200">
                    <ClipboardDocumentListIcon className="h-7 w-7 text-orange-600 mr-2.5 flex-shrink-0" />
                    <h3 className={`text-lg font-semibold ${headingTextColor?.startsWith('#') ? '' : headingTextColor || 'text-gray-800'}`} style={headingTextColor?.startsWith('#') ? {color: headingTextColor} : {}}>Student Grades Quick Edit</h3>
                </div>
                <div className="p-5 space-y-3 max-h-96 overflow-y-auto">
                    <label htmlFor="student-grade-select" className="block text-sm font-medium text-gray-700">Select Student:</label>
                    <select
                        id="student-grade-select"
                        value={selectedStudentIdForGrades}
                        onChange={(e) => setSelectedStudentIdForGrades(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    >
                        <option value="">-- Select a Student --</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.id.substring(0,8)}...)</option>
                        ))}
                    </select>

                    {selectedStudentIdForGrades && studentEnrollmentsForGradeEditing.length === 0 && (
                        <p className="text-sm text-slate-500 text-center py-2">No enrollments found for this student.</p>
                    )}

                    {selectedStudentIdForGrades && studentEnrollmentsForGradeEditing.length > 0 && (
                        <div className="mt-4 space-y-3">
                            <h4 className="text-sm font-semibold text-slate-600">Courses for {getStudentName(selectedStudentIdForGrades)}:</h4>
                            {studentEnrollmentsForGradeEditing.map(enrollment => {
                                const course = courses.find(c => c.id === enrollment.courseId);
                                return (
                                    <div key={enrollment.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center gap-2">
                                        <span className="text-sm text-slate-700 flex-grow truncate" title={course?.title || 'Unknown Course'}>
                                            {course?.title || 'Unknown Course'} ({course?.code})
                                        </span>
                                        <select
                                            value={enrollment.grade || 'NG'}
                                            onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                                            className="px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-xs w-24"
                                            aria-label={`Grade for ${course?.title}`}
                                        >
                                            {GRADE_OPTIONS.map(grade => (
                                                <option key={grade} value={grade}>{grade === 'NG' ? 'Not Graded' : grade}</option>
                                            ))}
                                        </select>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                     {!selectedStudentIdForGrades && (
                        <p className="text-sm text-slate-500 text-center py-2">Select a student to view and edit their grades.</p>
                    )}
                </div>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl h-full" titleColor={headingTextColor}>
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <div className="flex items-center">
                        <NewspaperIcon className="h-7 w-7 text-rose-600 mr-2.5"/>
                        <h3 className={`text-lg font-semibold ${headingTextColor?.startsWith('#') ? '' : headingTextColor || 'text-gray-800'}`} style={headingTextColor?.startsWith('#') ? {color: headingTextColor} : {}}>Admin News & Announcements</h3>
                    </div>
                    <Button onClick={openNewsModalForNew} size="sm" leftIcon={<PlusIcon className="h-4 w-4"/>}>New Post</Button>
                </div>
                <div className="p-5 max-h-96 overflow-y-auto">
                {sortedNewsItems.length > 0 ? (
                    <ul className="space-y-4">
                    {sortedNewsItems.map(item => (
                        <li key={item.id} className="p-3 bg-slate-50 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="font-semibold text-rose-700">{item.title}</h4>
                        <p className="text-xs text-slate-500 mb-1">By {item.author} on {formatDate(item.date, true)}</p>
                        <p className="text-sm text-slate-600 truncate-3-lines mb-2">{item.content}</p>
                        <div className="flex justify-end space-x-2 mt-2">
                            <Button variant="ghost" size="sm" onClick={() => openNewsModalForEdit(item)} leftIcon={<PencilIcon className="h-4 w-4"/>}>Edit</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteNews(item.id)} leftIcon={<TrashIcon className="h-4 w-4"/>}>Delete</Button>
                        </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-center py-4">No news items posted yet.</p>
                )}
                </div>
            </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl" titleColor={headingTextColor}>
                <div className="flex items-center p-5 border-b border-gray-200">
                    <CustomCalendarIcon className="h-7 w-7 text-teal-600 mr-2.5 flex-shrink-0" />
                    <h3 className={`text-lg font-semibold ${headingTextColor?.startsWith('#') ? '' : headingTextColor || 'text-gray-800'}`} style={headingTextColor?.startsWith('#') ? {color: headingTextColor} : {}}>Upcoming Academic Calendar</h3>
                 </div>
                 <div className="p-5 max-h-80 overflow-y-auto">
                 {upcomingCalendarEvents.length > 0 ? (
                    <ul className="space-y-3">
                        {upcomingCalendarEvents.map(event => {
                            const typeStyle = getEventTypeStyles(event.type);
                            return (
                                <li key={event.id} className="flex items-start p-2 rounded-md hover:bg-slate-50 transition-colors">
                                    <span className={`w-2.5 h-2.5 ${typeStyle.dot} rounded-full mt-1.5 mr-3 flex-shrink-0`} aria-label={`${event.type} event`}></span>
                                    <div>
                                        <span className="block text-sm font-semibold text-slate-700">{event.title}</span>
                                        <div className="flex items-center text-xs text-slate-500">
                                            <span>{formatDate(event.date)}</span>
                                            <span className="mx-1.5">&bull;</span>
                                            <span className={`${typeStyle.text} font-medium`}>{event.type}</span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                 ) : (
                    <p className="text-sm text-slate-500 text-center py-2">No upcoming events.</p>
                 )}
                 </div>
                <div className="p-3 border-t border-slate-100">
                     <Button variant="ghost" size="sm" className="w-full text-sky-600" onClick={() => alert('Full calendar view coming soon!')}> 
                        View Full Calendar
                    </Button>
                </div>
            </Card>

            <Card className="shadow-xl" titleColor={headingTextColor}>
                 <div className="flex items-center p-5 border-b border-gray-200">
                    <ChatBubbleBottomCenterTextIcon className="h-7 w-7 text-blue-600 mr-2.5"/>
                    <h3 className={`text-lg font-semibold ${headingTextColor?.startsWith('#') ? '' : headingTextColor || 'text-gray-800'}`} style={headingTextColor?.startsWith('#') ? {color: headingTextColor} : {}}>Student Quick Progress Notes</h3>
                 </div>
                 <div className="p-5 space-y-3">
                    <label htmlFor="student-note-select" className="block text-sm font-medium text-gray-700">Select Student:</label>
                    <select
                        id="student-note-select"
                        value={selectedStudentIdForNotes}
                        onChange={(e) => setSelectedStudentIdForNotes(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    >
                        <option value="">-- Select a Student --</option>
                        {students.map(s => (
                            <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.id.substring(0,8)}...)</option>
                        ))}
                    </select>
                    {selectedStudentIdForNotes && (
                        <>
                        <Textarea
                            id="student-progress-note"
                            label={`Notes for ${getStudentName(selectedStudentIdForNotes)}:`}
                            value={currentStudentNote}
                            onChange={(e) => setCurrentStudentNote(e.target.value)}
                            rows={4}
                            placeholder="Enter progress notes here..."
                        />
                        <Button onClick={handleSaveStudentNote} size="sm" variant="primary" className="w-full">
                            Save Note for {getStudentName(selectedStudentIdForNotes)}
                        </Button>
                        </>
                    )}
                 </div>
            </Card>
        </div>
      </section>
      
      <Modal isOpen={isNewsModalOpen} onClose={closeNewsModal} title={editingNewsItem ? "Edit News Post" : "Add New News Post"}>
        <form onSubmit={handleNewsSubmit} className="space-y-4">
          <Input label="Title" id="newsTitle" name="title" value={newsFormData.title} onChange={(e) => setNewsFormData({...newsFormData, title: e.target.value})} required />
          <Textarea label="Content" id="newsContent" name="content" value={newsFormData.content} onChange={(e) => setNewsFormData({...newsFormData, content: e.target.value})} rows={6} required />
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="ghost" onClick={closeNewsModal}>Cancel</Button>
            <Button type="submit" variant="primary">{editingNewsItem ? "Save Changes" : "Publish Post"}</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default DashboardPage;

// Helper style for truncating text (could be in a global CSS or utility)
const style = document.createElement('style');
style.innerHTML = `
  .truncate-3-lines {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
document.head.appendChild(style);
