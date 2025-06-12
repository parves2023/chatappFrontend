// JoinGroup.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const JoinGroup = () => {
  const [groups, setGroups] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/groups/user/${user._id}`);
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    if (user?._id) fetchGroups();
  }, [user]);

  const handleJoin = (groupId) => {
    // Navigate to the group chat page
    navigate(`/join-group/${groupId}`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Available Groups</h2>
      {groups.length === 0 ? (
        <p>No groups available.</p>
      ) : (
        groups.map((group) => (
          <div
            key={group._id}
            className="flex justify-between items-center p-4 border rounded-lg mb-3"
          >
            <div>
              <strong>{group.name}</strong>
              <div className="text-sm text-gray-600">
                Created by: {group.createdBy?.name || "Unknown"}
              </div>
            </div>
            <button
              onClick={() => handleJoin(group._id)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Join
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default JoinGroup;
