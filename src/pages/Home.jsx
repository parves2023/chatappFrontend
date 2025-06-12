import React from 'react';
import { FaGlobe, FaUsers, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Home = () => {
  const mockGroups = ['Dev Team', 'Study Buddies', 'Family Chat'];
  const mockUsers = ['Alice', 'Bob', 'Charlie', 'Diana'];

  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto p-8 space-y-10">

        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <FaGlobe className="text-4xl text-blue-500 mx-auto" />
            <div>
      {user ? <p>Welcome, {user.name}!</p> : <p>Please login</p>}
    </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Chat Box</h1>
          <p className="text-gray-600">Connect with everyone around the globe in real-time.</p>

<div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
  <Link
    to="/global"
    className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md text-center"
  >
    🌐 Join Global Chat
  </Link>
  <Link
    to="/join-group"
    className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-xl hover:bg-yellow-600 transition-all duration-300 shadow-md text-center flex items-center justify-center gap-2"
  >
    <FaUsers /> Join Group
  </Link>
  <Link
    to="/create-group"
    className="bg-green-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-md text-center flex items-center justify-center gap-2"
  >
    <FaUsers /> Create Group
  </Link>
</div>


        </div>

        {/* Your Previous Groups */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📁 Your Groups</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mockGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold text-blue-700">{group}</h3>
                <p className="text-sm text-gray-600">Group description here</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search Users */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">🔍 Search Users</h2>
          <div className="relative mb-6">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mockUsers?.map((user, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow hover:shadow-md transition"
              >
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl">
                  {user[0]}
                </div>
                <h4 className="mt-2 font-semibold text-gray-800">{user}</h4>
                <button className="mt-2 text-sm text-blue-500 hover:underline">View Profile</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
