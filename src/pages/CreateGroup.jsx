import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const user = useSelector((state) => state.auth.user);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const groupData = {
      name,
      members: user ? [user._id] : [], // Add current user as a member
      admins: user ? [user._id] : [], // Add current user as an admin
      createdBy: user?._id,
    };

    console.log('Creating group with data:', groupData);

    try {
      const response = await axios.post('http://localhost:3000/api/groups', groupData); // Adjust URL if needed
      alert('Group created successfully!');
      console.log(response.data);

      // Reset form
      setName('');
      setMembers('');
      setAdmins('');
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create a New Group</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Group Name</label> 
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Group
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
