import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ShowgroupMembers = ({ groupName }) => {
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(false);

    const user = useSelector((state) => state.auth.user);
  

  // Fetch group members based on groupName
  useEffect(() => {
    if (showMembers) {
      const fetchGroupMembers = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://localhost:3000/api/groups/${groupName}/members`);
          const data = await response.json();
          setMembers(data);
        } catch (error) {
          console.error("Error fetching group members:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchGroupMembers();
    }
  }, [groupName, showMembers]);

const handleremoveMember = async (memberId, groupId) => {
  if (!memberId || !groupId) {
    console.error('Member ID or Group ID is missing');
    return;
  }

  console.log(`Removing member ${memberId} from group ${groupId}`);
  try {
    const response = await fetch(`http://localhost:3000/api/groups/${groupId}/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberId }),
    });

    const data = await response.json();

    if (response.status === 200) {
        console.log('Member removed successfully:', data);
    alert(`Member removed from group ${data.name || groupId}`);
    }else {
      console.error('Failed to remove member:', data);
      alert(data.message || 'Failed to remove member from group');
      return;
    }


    setMembers((prevMembers) =>
      prevMembers.filter((member) => member._id !== memberId)
    );
  } catch (error) {
    console.error('Error removing member from group:', error);
    alert(error.message || 'Failed to remove member from group');
  }
};


  return (
    <div className="p-4 border rounded-xl bg-white shadow-md w-full max-w-xl mx-auto">
      <button
        onClick={() => setShowMembers(!showMembers)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showMembers ? 'Hide Members' : 'Show Members'}
      </button>

      {showMembers && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Group Members</h2>
          {loading ? (
            <p>Loading members...</p>
          ) : (
            <ul className="space-y-3">
              {members.length === 0 ? (
                <p>No members found.</p>
              ) : (
                members.map((member) => (
                  <li
                    key={member._id}
                    className="flex items-center justify-between border p-3 rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleremoveMember(member._id, groupName)}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowgroupMembers;
