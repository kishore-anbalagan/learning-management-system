import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMessageSquare } from 'react-icons/fi';

// Mock fetch – replace with real API later
async function fetchEnrolledStudents(courseId) {
  await new Promise(r => setTimeout(r, 150));
  return [
    { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', progress: 42 },
    { id: 'u2', name: 'Bob Smith', email: 'bob@example.com', progress: 77 },
    { id: 'u3', name: 'Charlie Lee', email: 'charlie@example.com', progress: 10 },
  ];
}

export default function EnrolledStudents() {
  const { courseId } = useParams();
  const { token } = useSelector(state => state.auth); // reserved for future API call

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchEnrolledStudents(courseId);
        if (!ignore) setStudents(list);
      } catch (e) {
        console.error(e);
        toast.error('Failed to load students');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, [courseId]);

  async function handleSend() {
    if (!selected) return;
    if (!message.trim()) { toast.error('Message cannot be empty'); return; }
    try {
      setSending(true);
      await new Promise(r => setTimeout(r, 300));
      toast.success('Encouragement sent');
      setMessage('');
      setSelected(null);
    } catch (e) {
      console.error(e);
      toast.error('Failed to send message');
    } finally { setSending(false); }
  }

  return (
    <div className="p-6 w-full">
      <h1 className="text-2xl font-semibold mb-4">Enrolled Students</h1>
      {loading ? (
        <div className="text-sm text-gray-400 animate-pulse">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-sm text-gray-400">No students enrolled yet.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <table className="w-full text-sm border border-gray-700/40">
              <thead className="bg-gray-800/60 text-gray-100">
                <tr>
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Email</th>
                  <th className="py-2 px-3 text-left">Progress</th>
                </tr>
              </thead>
              <tbody>
                {students.map(stu => (
                  <tr
                    key={stu.id}
                    onClick={() => setSelected(stu)}
                    className={`cursor-pointer hover:bg-gray-800/40 ${selected?.id === stu.id ? 'bg-gray-800/60' : ''}`}
                  >
                    <td className="py-2 px-3 font-medium">{stu.name}</td>
                    <td className="py-2 px-3 text-gray-400">{stu.email}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-28 bg-gray-700 rounded">
                          <div className="h-2 bg-green-500 rounded" style={{ width: `${stu.progress}%` }} />
                        </div>
                        <span className="text-gray-300 text-xs">{stu.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border border-gray-700/40 rounded p-4 h-fit">
            <h2 className="font-semibold mb-3 flex items-center gap-2"><FiMessageSquare /> Encourage Student</h2>
            {!selected ? (
              <p className="text-xs text-gray-400">Select a student from the table to send a motivational note.</p>
            ) : (
              <div className="space-y-3">
                <div className="text-sm"><span className="font-medium">To:</span> {selected.name}</div>
                <textarea
                  className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  rows={4}
                  placeholder="Great progress! Keep pushing through the next module..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  disabled={sending}
                />
                <button
                  onClick={handleSend}
                  disabled={sending}
                  className="inline-flex items-center gap-2 bg-yellow-400 text-black font-medium px-4 py-2 rounded hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}