import React, { useEffect, useState } from 'react';
import { User, Mail, Briefcase, Calendar, Phone } from 'lucide-react';
import apiClient from '../api/client';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/employees/me/');
                if (response.data.success) {
                    setProfile(response.data.data);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="flex h-64 items-center justify-center">Loading profile...</div>;

    if (!profile) return (
        <div className="rounded-xl bg-orange-50 p-8 border border-orange-200 text-orange-800">
            <h3 className="font-bold">No Employee Record Found</h3>
            <p>Your user account is not linked to an employee record yet. Please contact an administrator.</p>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600">Your personal employee information.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary-600 h-32 w-full"></div>
                <div className="px-8 pb-8">
                    <div className="-mt-12 mb-6">
                        <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-md">
                            <div className="h-full w-full rounded-xl bg-gray-100 flex items-center justify-center text-primary-600">
                                <User size={48} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h2>
                            <p className="text-primary-600 font-medium">{profile.designation}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail size={18} />
                                <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Briefcase size={18} />
                                <span>{profile.department}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone size={18} />
                                <span>{profile.phone || 'Not provided'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar size={18} />
                                <span>Joined {profile.date_joined}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
