import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiVideo, FiFile, FiSave } from 'react-icons/fi';

// This will be replaced with actual API calls
const fetchCourseDetails = async (courseId, token) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        _id: '1',
        courseName: 'Introduction to Web Development',
        courseDescription: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript.',
        price: 49.99,
        thumbnail: 'https://placehold.co/600x400',
        sections: [
          {
            _id: 'section1',
            sectionName: 'Getting Started with HTML',
            subSections: [
              {
                _id: 'sub1',
                title: 'Introduction to HTML',
                description: 'Learn about HTML tags and structure',
                videoUrl: 'https://example.com/video1',
                duration: '10:25'
              },
              {
                _id: 'sub2',
                title: 'HTML Forms and Inputs',
                description: 'Learn to create interactive forms',
                videoUrl: 'https://example.com/video2',
                duration: '15:30'
              }
            ]
          },
          {
            _id: 'section2',
            sectionName: 'CSS Fundamentals',
            subSections: [
              {
                _id: 'sub3',
                title: 'Introduction to CSS',
                description: 'Learn about CSS selectors and properties',
                videoUrl: 'https://example.com/video3',
                duration: '12:45'
              },
              {
                _id: 'sub4',
                title: 'CSS Layouts',
                description: 'Learn about Flexbox and Grid',
                videoUrl: 'https://example.com/video4',
                duration: '18:20'
              }
            ]
          }
        ]
      });
    }, 1000);
  });
};

// These will be replaced with actual API calls
const updateSection = async (sectionId, data, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

const deleteSection = async (sectionId, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

const updateSubSection = async (subSectionId, data, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

const deleteSubSection = async (subSectionId, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

const addSection = async (courseId, data, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, sectionId: 'new-section-id' }), 500);
  });
};

const addSubSection = async (sectionId, data, token) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, subSectionId: 'new-subsection-id' }), 500);
  });
};

export default function CourseContent() {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingSubSectionId, setEditingSubSectionId] = useState(null);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSubSection, setNewSubSection] = useState({
    title: '',
    description: '',
    videoUrl: '',
  });
  const [addingSectionTo, setAddingSectionTo] = useState(null);
  const [addingSubSectionTo, setAddingSubSectionTo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseDetails(courseId, token);
        setCourseData(data);
        
        // Initialize expanded sections
        const initialExpanded = {};
        data.sections.forEach(section => {
          initialExpanded[section._id] = false;
        });
        setExpandedSections(initialExpanded);
      } catch (error) {
        console.error('Error fetching course details:', error);
        toast.error('Failed to fetch course content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, token]);

  const toggleSection = (sectionId) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId],
    });
  };

  const handleEditSection = (sectionId, currentName) => {
    setEditingSectionId(sectionId);
    setNewSectionName(currentName);
  };

  const handleSaveSection = async (sectionId) => {
    if (!newSectionName.trim()) {
      toast.error('Section name cannot be empty');
      return;
    }

    try {
      await updateSection(sectionId, { sectionName: newSectionName }, token);
      
      // Update local state
      setCourseData({
        ...courseData,
        sections: courseData.sections.map(section => 
          section._id === sectionId 
            ? { ...section, sectionName: newSectionName } 
            : section
        )
      });
      
      toast.success('Section updated successfully');
      setEditingSectionId(null);
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section? This will delete all subsections within it.')) {
      return;
    }

    try {
      await deleteSection(sectionId, token);
      
      // Update local state
      setCourseData({
        ...courseData,
        sections: courseData.sections.filter(section => section._id !== sectionId)
      });
      
      toast.success('Section deleted successfully');
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  };

  const handleEditSubSection = (subSection) => {
    setEditingSubSectionId(subSection._id);
    setNewSubSection({
      title: subSection.title,
      description: subSection.description,
      videoUrl: subSection.videoUrl,
    });
  };

  const handleSaveSubSection = async (sectionId, subSectionId) => {
    if (!newSubSection.title.trim() || !newSubSection.description.trim() || !newSubSection.videoUrl.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      await updateSubSection(subSectionId, newSubSection, token);
      
      // Update local state
      setCourseData({
        ...courseData,
        sections: courseData.sections.map(section => 
          section._id === sectionId 
            ? {
                ...section,
                subSections: section.subSections.map(subSection => 
                  subSection._id === subSectionId 
                    ? { ...subSection, ...newSubSection } 
                    : subSection
                )
              } 
            : section
        )
      });
      
      toast.success('Subsection updated successfully');
      setEditingSubSectionId(null);
    } catch (error) {
      console.error('Error updating subsection:', error);
      toast.error('Failed to update subsection');
    }
  };

  const handleDeleteSubSection = async (sectionId, subSectionId) => {
    if (!window.confirm('Are you sure you want to delete this subsection?')) {
      return;
    }

    try {
      await deleteSubSection(subSectionId, token);
      
      // Update local state
      setCourseData({
        ...courseData,
        sections: courseData.sections.map(section => 
          section._id === sectionId 
            ? {
                ...section,
                subSections: section.subSections.filter(
                  subSection => subSection._id !== subSectionId
                )
              } 
            : section
        )
      });
      
      toast.success('Subsection deleted successfully');
    } catch (error) {
      console.error('Error deleting subsection:', error);
      toast.error('Failed to delete subsection');
    }
  };

  const handleAddSection = () => {
    setAddingSectionTo('course');
    setNewSectionName('');
  };

  const handleSaveNewSection = async () => {
    if (!newSectionName.trim()) {
      toast.error('Section name cannot be empty');
      return;
    }

    try {
      const response = await addSection(courseId, { sectionName: newSectionName }, token);
      
      // Update local state
      setCourseData({
        ...courseData,
        sections: [
          ...courseData.sections,
          {
            _id: response.sectionId,
            sectionName: newSectionName,
            subSections: []
          }
        ]
      });
      
      // Set new section to expanded
      setExpandedSections({
        ...expandedSections,
        [response.sectionId]: true
      });
      
      toast.success('Section added successfully');
      setAddingSectionTo(null);
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Failed to add section');
    }
  };

  const handleAddSubSection = (sectionId) => {
    setAddingSubSectionTo(sectionId);
    setNewSubSection({
      title: '',
      description: '',
      videoUrl: '',
    });
  };

  const handleSaveNewSubSection = async (sectionId) => {
    if (!newSubSection.title.trim() || !newSubSection.description.trim() || !newSubSection.videoUrl.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      const response = await addSubSection(sectionId, newSubSection, token);
      
      // Update local state
      setCourseData({
        ...courseData,
        sections: courseData.sections.map(section => 
          section._id === sectionId 
            ? {
                ...section,
                subSections: [
                  ...section.subSections,
                  {
                    _id: response.subSectionId,
                    ...newSubSection,
                    duration: '00:00' // Placeholder for new subsection
                  }
                ]
              } 
            : section
        )
      });
      
      toast.success('Subsection added successfully');
      setAddingSubSectionTo(null);
    } catch (error) {
      console.error('Error adding subsection:', error);
      toast.error('Failed to add subsection');
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!courseData) {
    return (
      <div className="text-center py-10">
        <p className="text-richblack-5 text-xl mb-2">No data available</p>
        <p className="text-richblack-300">Try refreshing the page</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link
          to="/dashboard/instructor"
          className="text-richblack-300 hover:text-richblack-50 mr-4"
        >
          <FiArrowLeft className="text-xl" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-richblack-5">
            Course Content
          </h1>
          <p className="text-richblack-300">
            {courseData.courseName}
          </p>
        </div>
      </div>

      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-richblack-5">
            Course Sections
          </h2>
          <button
            onClick={handleAddSection}
            className="flex items-center px-4 py-2 rounded-md font-medium bg-yellow-50 text-richblack-900 hover:bg-yellow-100 transition-all"
          >
            <FiPlus className="mr-2" /> Add Section
          </button>
        </div>

        {/* Add New Section Form */}
        {addingSectionTo === 'course' && (
          <div className="bg-richblack-700 p-4 rounded-md mb-6">
            <h3 className="text-lg font-medium text-richblack-5 mb-3">Add New Section</h3>
            <div className="mb-4">
              <input
                type="text"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name"
                className="w-full bg-richblack-600 text-richblack-5 rounded-md p-3 focus:outline-none focus:ring-1 focus:ring-yellow-50"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setAddingSectionTo(null)}
                className="px-4 py-2 rounded-md font-medium bg-richblack-600 text-richblack-50 hover:bg-richblack-500 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewSection}
                className="flex items-center px-4 py-2 rounded-md font-medium bg-yellow-50 text-richblack-900 hover:bg-yellow-100 transition-all"
              >
                <FiSave className="mr-2" /> Save
              </button>
            </div>
          </div>
        )}

        {/* Sections Accordion */}
        {courseData.sections.length === 0 ? (
          <div className="bg-richblack-700 p-6 rounded-lg text-center">
            <p className="text-richblack-5 text-lg mb-2">No sections added yet</p>
            <p className="text-richblack-300">
              Add your first section to organize your course content.
            </p>
          </div>
        ) : (
          <div className="border border-richblack-700 rounded-lg overflow-hidden divide-y divide-richblack-700">
            {courseData.sections.map((section) => (
              <div key={section._id} className="bg-richblack-700">
                {/* Section Header */}
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    {editingSectionId === section._id ? (
                      <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        className="flex-1 mr-4 bg-richblack-600 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                      />
                    ) : (
                      <div className="flex items-center flex-1">
                        <button
                          onClick={() => toggleSection(section._id)}
                          className="text-richblack-5 mr-2"
                        >
                          {expandedSections[section._id] ? (
                            <FiChevronUp className="text-xl" />
                          ) : (
                            <FiChevronDown className="text-xl" />
                          )}
                        </button>
                        <h3 className="text-lg font-medium text-richblack-5">
                          {section.sectionName}
                        </h3>
                        <span className="ml-3 text-sm text-richblack-300">
                          ({section.subSections.length} lectures)
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingSectionId === section._id ? (
                        <>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className="p-2 rounded-full text-richblack-300 hover:text-richblack-50 hover:bg-richblack-600"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveSection(section._id)}
                            className="p-2 rounded-full text-yellow-50 hover:text-yellow-100 hover:bg-richblack-600"
                          >
                            <FiSave />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditSection(section._id, section.sectionName)}
                            className="p-2 rounded-full text-richblack-300 hover:text-richblack-50 hover:bg-richblack-600"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(section._id)}
                            className="p-2 rounded-full text-pink-500 hover:text-pink-400 hover:bg-richblack-600"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section Content (SubSections) */}
                {expandedSections[section._id] && (
                  <div className="p-4 pt-0">
                    {/* SubSections List */}
                    <div className="pl-8">
                      {section.subSections.map((subSection) => (
                        <div
                          key={subSection._id}
                          className="border border-richblack-600 rounded-md mb-3 p-4 bg-richblack-800"
                        >
                          {editingSubSectionId === subSection._id ? (
                            <div className="space-y-3">
                              <div>
                                <label className="block text-sm text-richblack-300 mb-1">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  value={newSubSection.title}
                                  onChange={(e) => setNewSubSection({...newSubSection, title: e.target.value})}
                                  className="w-full bg-richblack-700 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-richblack-300 mb-1">
                                  Description
                                </label>
                                <textarea
                                  value={newSubSection.description}
                                  onChange={(e) => setNewSubSection({...newSubSection, description: e.target.value})}
                                  className="w-full bg-richblack-700 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50 resize-none h-20"
                                ></textarea>
                              </div>
                              <div>
                                <label className="block text-sm text-richblack-300 mb-1">
                                  Video URL
                                </label>
                                <input
                                  type="text"
                                  value={newSubSection.videoUrl}
                                  onChange={(e) => setNewSubSection({...newSubSection, videoUrl: e.target.value})}
                                  className="w-full bg-richblack-700 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                                />
                              </div>
                              <div className="flex justify-end gap-3 mt-4">
                                <button
                                  onClick={() => setEditingSubSectionId(null)}
                                  className="px-4 py-2 rounded-md font-medium bg-richblack-600 text-richblack-50 hover:bg-richblack-500 transition-all"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveSubSection(section._id, subSection._id)}
                                  className="flex items-center px-4 py-2 rounded-md font-medium bg-yellow-50 text-richblack-900 hover:bg-yellow-100 transition-all"
                                >
                                  <FiSave className="mr-2" /> Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-start">
                                  <FiVideo className="text-richblack-300 mt-1 mr-3" />
                                  <div>
                                    <h4 className="font-medium text-richblack-5">
                                      {subSection.title}
                                    </h4>
                                    <p className="text-richblack-300 text-sm">
                                      {subSection.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <span className="text-xs text-richblack-300">
                                    {subSection.duration}
                                  </span>
                                  <button
                                    onClick={() => handleEditSubSection(subSection)}
                                    className="p-1.5 rounded-full text-richblack-300 hover:text-richblack-50 hover:bg-richblack-700"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSubSection(section._id, subSection._id)}
                                    className="p-1.5 rounded-full text-pink-500 hover:text-pink-400 hover:bg-richblack-700"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Subsection Button */}
                      {addingSubSectionTo === section._id ? (
                        <div className="border border-richblack-600 rounded-md mb-3 p-4 bg-richblack-800">
                          <h4 className="font-medium text-richblack-5 mb-3">Add New Lecture</h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm text-richblack-300 mb-1">
                                Title
                              </label>
                              <input
                                type="text"
                                value={newSubSection.title}
                                onChange={(e) => setNewSubSection({...newSubSection, title: e.target.value})}
                                className="w-full bg-richblack-700 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm text-richblack-300 mb-1">
                                Description
                              </label>
                              <textarea
                                value={newSubSection.description}
                                onChange={(e) => setNewSubSection({...newSubSection, description: e.target.value})}
                                className="w-full bg-richblack-700 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50 resize-none h-20"
                              ></textarea>
                            </div>
                            <div>
                              <label className="block text-sm text-richblack-300 mb-1">
                                Video URL
                              </label>
                              <input
                                type="text"
                                value={newSubSection.videoUrl}
                                onChange={(e) => setNewSubSection({...newSubSection, videoUrl: e.target.value})}
                                className="w-full bg-richblack-700 text-richblack-5 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                              />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                              <button
                                onClick={() => setAddingSubSectionTo(null)}
                                className="px-4 py-2 rounded-md font-medium bg-richblack-600 text-richblack-50 hover:bg-richblack-500 transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNewSubSection(section._id)}
                                className="flex items-center px-4 py-2 rounded-md font-medium bg-yellow-50 text-richblack-900 hover:bg-yellow-100 transition-all"
                              >
                                <FiSave className="mr-2" /> Add Lecture
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddSubSection(section._id)}
                          className="flex items-center mb-2 px-3 py-2 rounded-md font-medium text-yellow-50 hover:bg-richblack-700 transition-all"
                        >
                          <FiPlus className="mr-2" /> Add Lecture
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-richblack-700 rounded-full mr-4 animate-pulse"></div>
        <div>
          <div className="h-8 w-64 bg-richblack-700 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-40 bg-richblack-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="bg-richblack-800 p-6 rounded-lg border border-richblack-700 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-6 w-48 bg-richblack-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-richblack-700 rounded animate-pulse"></div>
        </div>

        <div className="border border-richblack-700 rounded-lg overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-richblack-700 p-4 border-b border-richblack-700">
              <div className="flex justify-between items-center">
                <div className="flex items-center flex-1">
                  <div className="w-6 h-6 bg-richblack-600 rounded-full mr-2 animate-pulse"></div>
                  <div className="h-5 w-48 bg-richblack-600 rounded animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-richblack-600 rounded-full animate-pulse"></div>
                  <div className="w-8 h-8 bg-richblack-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}