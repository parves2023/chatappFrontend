import React, { useEffect, useState } from 'react';

const Addmembers = ({groupId}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  // Fetch users based on partial name
useEffect(() => {
  if (!searchTerm) {
    setUsers([]);
    return;
  }

  const delayDebounce = setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/name/${searchTerm}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data); // ✅ It's a valid array of users
      } else {
        setUsers([]);   // ✅ It's likely an error or no users found
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    }
  }, 300);

  return () => clearTimeout(delayDebounce);
}, [searchTerm]);


let handleaddUserToGroup = async (userId, groupId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/groups/${groupId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to add user to group');
    }

    const data = await response.json();
    console.log('User added successfully:', data);
    alert(`User added to group ${data.name || groupId}`);
  } catch (error) {
    console.error('Error adding user to group:', error);
    alert('Failed to add user to group');
  }
};




  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Add Members to Group</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search users by name..."
        className="w-full p-2 border border-gray-300 rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-4">
        {users.length === 0 && searchTerm && (
          <p className="text-gray-500">No users found</p>
        )}
        {users?.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <img
                src={user.photo || 'https://via.placeholder.com/40'}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-medium">{user.name}</span>
            </div>
            <button
            onClick={() => {
              // Handle adding user to group logic here
              console.log(`Adding ${user.name} to group: ${groupId}`);
              handleaddUserToGroup(user._id, groupId);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Addmembers;
