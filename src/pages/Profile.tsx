import React from 'react';
import { StudentProfile } from '../components/StudentProfile';

export const Profile = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h2>
        <p className="text-gray-500 text-lg mt-1">
          Manage your account and view your achievements.
        </p>
      </div>
      
      {/* We reuse the StudentProfile component we built earlier which looks premium */}
      <StudentProfile />
    </div>
  );
};
