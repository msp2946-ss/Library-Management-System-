import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issueData, setIssueData] = useState({
    bookId: '',
    memberId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesRes, booksRes, membersRes] = await Promise.all([
        api.get('/issues?limit=20'),
        api.get('/books?limit=100'),
        api.get('/members?limit=100'),
      ]);
      setIssues(issuesRes.data.issues);
      setBooks(booksRes.data.books);
      setMembers(membersRes.data.members);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      await api.post('/issues', issueData);
      toast.success('Book issued successfully! Email sent to member.');
      setIssueData({ bookId: '', memberId: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue book');
    }
  };

  const handleReturnBook = async (issueId) => {
    if (!window.confirm('Confirm book return?')) return;
    
    try {
      await api.put(`/issues/${issueId}/return`);
      toast.success('Book returned successfully! Email sent to member.');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Issue & Return Books</h1>

      {/* Issue Book Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Issue New Book</h2>
        <form onSubmit={handleIssueBook} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Book</label>
            <select
              required
              value={issueData.bookId}
              onChange={(e) => setIssueData({ ...issueData, bookId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a book...</option>
              {books
                .filter((book) => book.availableCopies > 0)
                .map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} ({book.availableCopies} available)
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Member</label>
            <select
              required
              value={issueData.memberId}
              onChange={(e) => setIssueData({ ...issueData, memberId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a member...</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} - {member.email}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Issue Book
            </button>
          </div>
        </form>
      </div>

      {/* Issued Books List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Issued Books</h2>
        
        {issues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Book</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Member</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Issue Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Return Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {issues.map((issue) => (
                  <tr key={issue._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-gray-800 font-medium">{issue.book?.title}</div>
                      <div className="text-sm text-gray-500">{issue.book?.author}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-800 font-medium">{issue.member?.name}</div>
                      <div className="text-sm text-gray-500">{issue.member?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(issue.issueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {issue.returnDate ? new Date(issue.returnDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          issue.status === 'issued'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {issue.status === 'issued' ? 'Issued' : 'Returned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {issue.status === 'issued' && (
                        <button
                          onClick={() => handleReturnBook(issue._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No issued books</p>
        )}
      </div>
    </div>
  );
};

export default Issues;
