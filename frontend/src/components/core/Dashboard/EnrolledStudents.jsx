import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMessageSquare, FiBarChart2, FiCalendar, FiClock, FiUser, FiMail, FiCheckCircle } from 'react-icons/fi';
import { apiConnector } from '../../../services/apiConnector';
import { dashboardEndpoints } from '../../../services/apis';
import { getAuthToken, getAuthHeaders } from '../../../utils/authUtils';

// Get real data from the API
async function fetchEnrolledStudents() {
  console.log("fetchEnrolledStudents called");
  
  try {
    // Get proper authentication headers
    const headers = getAuthHeaders();
    
    if (!headers) {
      throw new Error("Authentication required. Please log in again.");
    }
    
    console.log("Making API request with Auth headers");
    
    const response = await apiConnector(
      "GET", 
      dashboardEndpoints.GET_ENROLLED_STUDENTS_API,
      null,
      headers
    );
    
    console.log("API response status:", response.status);
    
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || "Failed to fetch enrolled students");
    }
  } catch (error) {
    console.error("Error fetching enrolled students:", error);
    
    // Log more detailed error information
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    
    throw error;
  }
}

export default function EnrolledStudents() {
  const { courseId } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        // Verify we have a token
        const token = getAuthToken();
        if (!token) {
          toast.error("Authentication required. Please log in again.");
          setLoading(false);
          return;
        }
        
        const data = await fetchEnrolledStudents();
        if (!ignore) {
          // Store the full course data
          setCourses(data);
          
          // Extract all unique students from all courses
          const allStudents = [];
          let studentMap = new Map(); // Used to track unique students
          
          data.forEach(course => {
            if (course.studentsEnrolled && course.studentsEnrolled.length > 0) {
              course.studentsEnrolled.forEach(student => {
                // If we haven't processed this student yet
                if (!studentMap.has(student._id)) {
                  // Add student with additional course info
                  const studentWithDetails = {
                    id: student._id,
                    name: `${student.firstName} ${student.lastName}`,
                    email: student.email,
                    image: student.image,
                    enrolledCourses: [course.courseName || 'Unknown Course'],
                    progress: Math.floor(Math.random() * 100), // TODO: Replace with real progress data
                    lastActive: getRandomLastActive(),
                    completedLessons: Math.floor(Math.random() * 20), // TODO: Replace with real data
                    quizScores: Math.floor(Math.random() * 100), // TODO: Replace with real data
                    joinDate: formatDate(course.createdAt) // Using course creation date as a proxy
                  };
                  
                  allStudents.push(studentWithDetails);
                  studentMap.set(student._id, allStudents.length - 1);
                } else {
                  // If we've seen this student before, just add the new course to their list
                  const index = studentMap.get(student._id);
                  allStudents[index].enrolledCourses.push(course.courseName || 'Unknown Course');
                }
              });
            }
          });
          
          setStudents(allStudents);
        }
      } catch (e) {
        console.error('Error fetching students:', e);
        
        // Check for specific error conditions
        if (e.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
        } else if (e.message.includes('Network Error')) {
          toast.error('Network error. Please check your connection.');
        } else {
          toast.error('Failed to load students. Please try again.');
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // Helper function to generate random "last active" strings for demo purposes
  // TODO: Replace with real data when available
  function getRandomLastActive() {
    const options = ['just now', '1 hour ago', '2 hours ago', '1 day ago', '2 days ago', '1 week ago'];
    return options[Math.floor(Math.random() * options.length)];
  }
  
  // Format date to readable string
  function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }

  async function handleSend() {
    if (!selected) return;
    if (!message.trim()) { toast.error('Message cannot be empty'); return; }
    try {
      setSending(true);
      
      // Use the real API endpoint for sending encouragement
      const response = await apiConnector(
        "POST",
        dashboardEndpoints.SEND_ENCOURAGEMENT_API,
        {
          message: message,
          studentIds: [selected.id]
        },
        { Authorization: `Bearer ${token}` }
      );
      
      if (response.data.success) {
        toast.success('Encouragement sent successfully');
        setMessage('');
        setSelected(null);
      } else {
        toast.error(response.data.message || 'Failed to send message');
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to send message');
    } finally { 
      setSending(false); 
    }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4 text-richblack-5">Student Performance Analytics</h1>
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-3">
              <FiUser className="text-yellow-50" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Total Students</p>
              <p className="text-richblack-5 text-xl font-bold">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-3">
              <FiBarChart2 className="text-yellow-50" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Average Progress</p>
              <p className="text-richblack-5 text-xl font-bold">
                {students.length > 0 ? 
                  Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length) : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-3">
              <FiCheckCircle className="text-yellow-50" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Average Quiz Score</p>
              <p className="text-richblack-5 text-xl font-bold">
                {students.length > 0 ? 
                  Math.round(students.reduce((sum, s) => sum + s.quizScores, 0) / students.length) : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-richblack-800 p-4 rounded-lg border border-richblack-700">
          <div className="flex items-center mb-2">
            <div className="h-10 w-10 rounded-full bg-yellow-900 bg-opacity-30 flex items-center justify-center mr-3">
              <FiClock className="text-yellow-50" />
            </div>
            <div>
              <p className="text-richblack-300 text-sm">Active Students</p>
              <p className="text-richblack-5 text-xl font-bold">
                {students.filter(s => s.lastActive.includes('hours') || s.lastActive.includes('day')).length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-sm text-richblack-300 animate-pulse p-4">Loading student data...</div>
      ) : students.length === 0 ? (
        <div className="text-sm text-richblack-300 p-4 bg-richblack-800 rounded-lg">No students enrolled yet.</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-4 mb-6">
                <h2 className="text-lg font-medium text-richblack-5 mb-4">Enrolled Students</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-richblack-700 text-richblack-50">
                      <tr>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Progress</th>
                        <th className="py-3 px-4 text-left">Quiz Score</th>
                        <th className="py-3 px-4 text-left">Last Active</th>
                      </tr>
                    </thead>
                                        <tbody>
                      {students.map(stu => (
                        <tr
                          key={stu.id}
                          onClick={() => setSelected(stu)}
                          className={`cursor-pointer border-b border-richblack-700 hover:bg-richblack-700 transition-colors ${selected?.id === stu.id ? 'bg-richblack-700' : ''}`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                                <img 
                                  src={stu.image || `https://api.dicebear.com/5.x/initials/svg?seed=${stu.name}`} 
                                  alt={stu.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span className="text-richblack-25">{stu.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-richblack-300">{stu.email}</td>
                          <td className="py-3 px-4">
                            <div className="w-full bg-richblack-700 rounded-full h-2.5">
                              <div className="bg-yellow-50 h-2.5 rounded-full" style={{ width: `${stu.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-richblack-300">{stu.progress}%</span>
                          </td>
                          <td className="py-3 px-4 text-richblack-300">{stu.quizScores}%</td>
                          <td className="py-3 px-4 text-richblack-300">{stu.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Student Performance by Course */}
              <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-4">
                <h2 className="text-lg font-medium text-richblack-5 mb-4">Course Engagement</h2>
                <div className="flex flex-col space-y-1">
                  <div className="grid grid-cols-5 text-xs text-richblack-300 mb-2 px-2">
                    <div className="col-span-2">Course</div>
                    <div>Students</div>
                    <div>Avg. Score</div>
                    <div>Engagement</div>
                  </div>
                  {courses.slice(0, 5).map((course, idx) => {
                    const studentCount = course.studentsEnrolled?.length || 0;
                    const avgScore = Math.floor(Math.random() * 30) + 60; // Random score between 60-90%
                    
                    // Determine engagement level based on student count
                    let engagement = 'Low';
                    if (studentCount > 5) engagement = 'High';
                    else if (studentCount > 2) engagement = 'Medium';
                    
                    return (
                      <div key={idx} className="grid grid-cols-5 text-sm py-2 px-2 border-b border-richblack-700 last:border-b-0">
                        <div className="col-span-2 text-richblack-5">{course.courseName || 'Unnamed Course'}</div>
                        <div className="text-richblack-300">{studentCount}</div>
                        <div className="text-richblack-300">{avgScore}%</div>
                        <div className={`${
                          engagement === 'High' ? 'text-green-500' : 
                          engagement === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                        }`}>{engagement}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-4 mb-6">
                <h2 className="text-lg font-medium text-richblack-5 mb-3 flex items-center gap-2">
                  <FiMessageSquare /> Student Communication
                </h2>
                {!selected ? (
                  <p className="text-sm text-richblack-400">Select a student from the table to send a motivational note.</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center p-2 bg-richblack-700 rounded-md">
                      <div className="h-8 w-8 rounded-full bg-richblack-600 flex items-center justify-center mr-3">
                        {selected.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-richblack-5 font-medium">{selected.name}</p>
                        <p className="text-xs text-richblack-300">{selected.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-richblack-300">Student Performance</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-richblack-700 p-2 rounded-md">
                          <p className="text-xs text-richblack-400">Progress</p>
                          <p className="text-richblack-5">{selected.progress}%</p>
                        </div>
                        <div className="bg-richblack-700 p-2 rounded-md">
                          <p className="text-xs text-richblack-400">Quiz Scores</p>
                          <p className="text-richblack-5">{selected.quizScores}%</p>
                        </div>
                        <div className="bg-richblack-700 p-2 rounded-md">
                          <p className="text-xs text-richblack-400">Last Active</p>
                          <p className="text-richblack-5">{selected.lastActive}</p>
                        </div>
                        <div className="bg-richblack-700 p-2 rounded-md">
                          <p className="text-xs text-richblack-400">Join Date</p>
                          <p className="text-richblack-5">{selected.joinDate}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-richblack-300">Send a message to {selected.name.split(' ')[0]}</p>
                      <textarea
                        className="w-full bg-richblack-700 border border-richblack-600 rounded-md p-2 text-sm resize-none focus:outline-none focus:border-yellow-50 text-richblack-5"
                        rows={4}
                        placeholder="Great progress on the recent modules! Keep up the excellent work..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        disabled={sending}
                      />
                      <button
                        onClick={handleSend}
                        disabled={sending}
                        className="inline-flex items-center justify-center gap-2 bg-yellow-50 text-richblack-900 font-medium px-4 py-2 rounded-md hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                      >
                        {sending ? 'Sending...' : 'Send Encouragement'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-4">
                <h2 className="text-lg font-medium text-richblack-5 mb-3">Top Performers</h2>
                {students.length > 0 ? (
                  <div className="space-y-3">
                    {students
                      .sort((a, b) => b.quizScores - a.quizScores)
                      .slice(0, 3)
                      .map((student, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-2 bg-richblack-700 rounded-md cursor-pointer hover:bg-richblack-600"
                          onClick={() => setSelected(student)}
                        >
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                              <img 
                                src={student.image || `https://api.dicebear.com/5.x/initials/svg?seed=${student.name}`} 
                                alt={student.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-richblack-5 font-medium">{student.name}</p>
                          </div>
                          <div className="text-yellow-50 font-medium">{student.quizScores}%</div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-richblack-400">No student data available</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
