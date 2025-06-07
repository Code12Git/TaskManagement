"use client";
import { useAppDispatch } from "@/hooks/hooks";
import { fetchUser, updatedUser } from "@/redux/actions/userAction";
import React, { useEffect, useRef, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { FiEdit2, FiUser, FiMail, FiLock, FiCalendar, FiSave, FiX } from "react-icons/fi";
import Avatar from '@mui/material/Avatar';
import { formRequest } from "@/helpers/axios";
import toast from "react-hot-toast";
import Image from "next/image";

interface UserData {
  name?: string;
  email?: string;
  username?: string;
  bio?: string;
  _id?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  password?: string;
  avatarUrl?: string;
}

const EditUser: React.FC = () => {
  const auth = useAuth();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<UserData>({});
  const [isFieldEdit, setIsFieldEdit] = useState<Record<string, string>>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (auth.user) {
      try {
        const parsedUser = JSON.parse(auth.user) as UserData;
        setFormData(parsedUser);
        if (parsedUser.avatarUrl) {
          setAvatarUrl(parsedUser.avatarUrl);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, [auth.user]);

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "name":
        return <FiUser className="text-gray-500" />;
      case "email":
        return <FiMail className="text-gray-500" />;
      case "password":
        return <FiLock className="text-gray-500" />;
      case "createdAt":
        return <FiCalendar className="text-gray-500" />;
      default:
        return <FiUser className="text-gray-500" />;
    }
  };
  
  const userFields = Object.entries(formData)
    .filter(
      ([key]) => !["_id", "role", "__v", "password", "updatedAt", "avatar"].includes(key)
    )
    .sort(([a], [b]) => {
      const order = ["name", "email", "username", "bio"];
      return order.indexOf(a) - order.indexOf(b);
    });

  const openUpdateField = (field: string) => {
    setEditingField(field === editingField ? null : field);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setIsFieldEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const uploadImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.match('image.*')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarUrl(event.target?.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const uploadAvatar = async () => {
    if (!file || !formData._id) return;

    try {
      setIsUploading(true);
      const formDataObj = new FormData();
      formDataObj.append('avatarUrl', file);

      const response = await formRequest.post('/user/upload-avatar', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const newAvatarUrl = response.data.url;
      setAvatarUrl(newAvatarUrl);
      
      if (auth.user) {
        const user = JSON.parse(auth.user);
        const updatedUser = { ...user, avatarUrl: newAvatarUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success('Avatar updated successfully');
      return newAvatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const sendUpdateData = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    try {
      if (!formData._id) {
        console.error("User ID is missing in formData.");
        return;
      }

      setIsLoading(true);

      let newAvatarUrl = avatarUrl;
      if (file) {
        newAvatarUrl = await uploadAvatar();
      }

      const updateData: Partial<UserData> = {
        ...isFieldEdit,
        ...(newAvatarUrl ? { avatarUrl: newAvatarUrl } : {}),
      };

      await dispatch(updatedUser(formData._id, updateData));
      
      // Update the form data and localStorage with the new data
      const updatedUserData = {
        ...formData,
        ...isFieldEdit,
        ...(newAvatarUrl ? { avatarUrl: newAvatarUrl } : {}),
      };
      
      setFormData(updatedUserData);
      
      // Update localStorage with the complete updated user data
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      setIsFieldEdit({});
      setEditingField(null);
      setFile(null);
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-8 text-center relative">
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <input 
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              
              {file ? (
                <div className="relative">
                  <Image
                    src={avatarUrl || "/static/images/avatar/1.jpg"}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-white shadow-md object-cover"
                    style={{ width: '100px', height: '100px' }}
                  />
                  <button
                    onClick={() => {
                      setFile(null);
                      setAvatarUrl(formData.avatarUrl || null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <FiX className="text-white text-sm" />
                  </button>
                </div>
              ) : (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Avatar 
                    alt="User Avatar" 
                    src={avatarUrl || "/static/images/avatar/1.jpg"}
                    sx={{ width: 100, height: 100 }}
                    onClick={uploadImage}
                    className="border-4 cursor-pointer border-white shadow-md hover:border-indigo-300 transition-colors"
                  />
                </motion.div>
              )}

              {(isLoading || isUploading) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold text-white"
            >
              Edit Profile
            </motion.h1>
          </div>

          <div className="pt-16 pb-8 px-8 space-y-6">
            {userFields.map(([key, value]) => (
              <motion.div
                key={key}
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <div className="flex items-center space-x-3">
                    {getFieldIcon(key)}
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {key}
                    </label>
                  </div>
                  {editingField !== key && key !== 'createdAt' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => openUpdateField(key)}
                      whileTap={{ scale: 0.95 }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-end sm:justify-start"
                    >
                      <FiEdit2 className="mr-1" /> Edit
                    </motion.button>
                  )}
                </div>

                {editingField !== key ? (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mt-1 text-gray-600 pl-8 break-words"
                  >
                    {key === 'createdAt' ? formatDate(value) : value || "Not specified"}
                  </motion.p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                    {key === 'bio' ? (
                      <textarea
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        name={key}
                        value={(isFieldEdit[key] ?? value) || ""}
                        onChange={handleFieldChange}
                        rows={3}
                      />
                    ) : (
                      <input
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        name={key}
                        value={(isFieldEdit[key] ?? value) || ""}
                        onChange={handleFieldChange}
                      />
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEditingField(null)}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg text-sm mt-2 sm:mt-0"
                    >
                      Cancel
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {(Object.keys(isFieldEdit).length > 0 || (file && avatarUrl !== formData.avatarUrl)) && (
            <div className="bg-gray-50 px-8 py-4 flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsFieldEdit({});
                  setEditingField(null);
                  setAvatarUrl(formData.avatarUrl || null);
                  setFile(null);
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Discard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendUpdateData}
                disabled={isLoading || isUploading}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center disabled:opacity-70"
              >
                {(isLoading || isUploading) ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditUser;