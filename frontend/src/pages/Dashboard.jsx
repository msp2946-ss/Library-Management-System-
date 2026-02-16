import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    totalIssued: 0,
    recentIssues: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [booksRes, membersRes, issuesRes] = await Promise.all([
        api.get('/books/stats'),
        api.get('/members?limit=1'),
        api.get('/issues/stats/dashboard'),
      ]);

      setStats({
        totalBooks: booksRes.data.totalBooks || 0,
        totalMembers: membersRes.data.totalMembers || 0,
        totalIssued: issuesRes.data.totalIssued || 0,
        recentIssues: issuesRes.data.recentIssues || [],
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Total Books</p>
              <p className="text-4xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="text-5xl opacity-20">📚</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Total Members</p>
              <p className="text-4xl font-bold">{stats.totalMembers}</p>
            </div>
            <div className="text-5xl opacity-20">👥</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Currently Issued</p>
              <p className="text-4xl font-bold">{stats.totalIssued}</p>
            </div>
            <div className="text-5xl opacity-20">📖</div>
          </div>
        </div>
      </div>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recently Issued Books</h2>
        {stats.recentIssues.length > 0 ? (
          <div className="space-y-3">
            {stats.recentIssues.map((issue) => (
              <div
                key={issue._id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div>
                  <p className="font-semibold text-gray-800">{issue.book?.title}</p>
                  <p className="text-sm text-gray-600">
                    Issued to: <span className="font-medium">{issue.member?.name}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(issue.issueDate).toLocaleDateString()}
                  </p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Issued
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent issues</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
