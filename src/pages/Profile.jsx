import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Grid, Bookmark, Tag, Camera, FolderOpen, Heart, MessageSquare, Settings, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';
import ProfileGrid from '../components/Profile/ProfileGrid';
import FollowListModal from '../components/Profile/FollowListModal';
import EditProfileModal from '../components/Profile/EditProfileModal';
import { getOrCreateChat } from '../services/chatService';
import { useUserPosts } from '../hooks/useUserPosts';
import { useSavedPosts } from '../hooks/useSavedPosts';
import { useTaggedPosts } from '../hooks/useTaggedPosts';
import { useAuth } from '../hooks/useAuth.jsx';
import { updateUserProfile, getUserProfile } from '../services/userService';
import { useFollow } from '../hooks/useFollow';
import { uploadMedia } from '../services/cloudinary';

const TABS = [
  { id: 'posts', label: 'Quests', icon: Grid },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'tagged', label: 'Tagged', icon: Tag },
];

export default function Profile() {
  const { userId } = useParams();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [followListType, setFollowListType] = useState(null); // 'followers' or 'following' or null
  
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const currentUserId = currentUser?.uid || currentUser?.id || null;
  const targetUserId = userId || currentUserId;
  const isOwnProfile = targetUserId === currentUserId;

  const [profileUser, setProfileUser] = React.useState(null);
  const [loadingProfile, setLoadingProfile] = React.useState(true);

  const { isFollowing, isFollower, handleFollowToggle, loading: followLoading } = useFollow(targetUserId);

  const handleMessageClick = async () => {
    if (!currentUserId || !targetUserId) return;
    try {
      const chatId = await getOrCreateChat(currentUserId, targetUserId);
      navigate(`/message?chatId=${chatId}`);
    } catch (error) {
      console.error("Failed to initialize transmission:", error);
    }
  };

  React.useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
      } else if (targetUserId) {
        try {
          const data = await getUserProfile(targetUserId);
          setProfileUser(data);
        } catch (err) {
          console.error("Failed to load user profile:", err);
        }
      }
      setLoadingProfile(false);
    };
    if (targetUserId) fetchProfile();
  }, [targetUserId, isOwnProfile, currentUser]);

  // Real-time Firestore hooks — fetch for targetUserId
  const { posts: userPosts, loading: loadingUserPosts } = useUserPosts(targetUserId);
  const { savedPosts } = useSavedPosts(); // probably only if isOwnProfile, but ok for now
  const { posts: taggedPosts, loading: loadingTaggedPosts } = useTaggedPosts(targetUserId);

  const finalUserPosts = userPosts || [];
  const finalTaggedPosts = taggedPosts || [];
  const finalSavedPosts = savedPosts || [];

  // Profile constructed from fetched user data or currentUser
  const profile = {
    name: profileUser?.name || "Player",
    username: profileUser?.username || "player_x",
    bio: profileUser?.bio || "Level 1 User | Exploring the grid.",
    avatar: profileUser?.profileImage || profileUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser?.username || 'Guest'}`,
    coverImage: profileUser?.coverImage || "https://picsum.photos/800/200",
    stats: { 
      posts: finalUserPosts.length,
      followers: profileUser?.followersCount || profileUser?.followers?.length || 0, 
      following: profileUser?.followingCount || profileUser?.following?.length || 0 
    }
  };

  const handleSaveProfile = async (updatedData, filesToUpload = {}) => {
    try {
      setIsSaving(true);
      const { avatarFile, coverFile } = filesToUpload;
      
      let newAvatarUrl = updatedData.avatar;
      let newCoverUrl = updatedData.coverImage;

      // Upload new avatar if selected
      if (avatarFile) {
        const uploadResult = await uploadMedia(avatarFile);
        if (uploadResult?.url) newAvatarUrl = uploadResult.url;
      }

      // Upload new cover image if selected
      if (coverFile) {
        const uploadResult = await uploadMedia(coverFile);
        if (uploadResult?.url) newCoverUrl = uploadResult.url;
      }

      const finalProfileData = {
        name: updatedData.name,
        username: updatedData.username,
        bio: updatedData.bio,
        profileImage: newAvatarUrl,
        coverImage: newCoverUrl
      };

      if (currentUserId !== 'guest') {
        await updateUserProfile(currentUserId, finalProfileData);
      }
      
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingProfile || !profileUser) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-slate-950">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent flex items-center justify-center rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.5)]">
        </div>
      </div>
    );
  }

  return (
    <div className="-m-6 lg:-m-10 min-h-[calc(100vh-64px)] bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
        {/* Cover Image */}
        <div className="h-48 md:h-72 w-full relative rounded-b-3xl overflow-hidden group">
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          {/* Animated Cyberpunk Overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Profile Info Section */}
        <div className="px-4 sm:px-8 relative -mt-16 sm:-mt-24">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            {/* Avatar (with glow and ring) */}
            <div className="relative group self-center sm:self-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-rose-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
              <img 
                src={profile.avatar} 
                alt="Avatar" 
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-slate-950 bg-slate-900 object-cover"
              />
              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-950 shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
            </div>

            {/* Action Buttons (Desktop) */}
            <div className="hidden sm:flex flex-1 justify-end gap-3 mb-4">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="px-6 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-medium hover:bg-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                  <Link to="/settings" className="p-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center">
                    <Settings size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-8 py-2 rounded-full font-bold transition-all shadow-lg ${
                      isFollowing 
                        ? "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700" 
                        : isFollower
                          ? "bg-purple-500 hover:bg-purple-400 text-white shadow-purple-500/30"
                          : "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/30"
                    }`}
                  >
                    {isFollowing ? "Following" : isFollower ? "Follow Back" : "Follow"}
                  </button>
                  <button 
                    onClick={handleMessageClick}
                    className="px-8 py-2 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-medium hover:bg-slate-700 hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="mt-4 sm:mt-6 space-y-4 text-center sm:text-left">
            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center sm:justify-start gap-3">
                {profile.name}
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase font-mono tracking-wider shadow-[0_0_8px_rgba(34,211,238,0.2)]">Lvl 99</span>
              </h1>
              <p className="text-cyan-400 font-medium text-lg mt-1">@{profile.username}</p>
            </div>

            <p className="text-slate-300 max-w-2xl leading-relaxed mx-auto sm:mx-0 text-sm sm:text-base">
              {profile.bio}
            </p>

            {/* Stats */}
            <div className="flex gap-8 justify-center sm:justify-start pt-2">
               <div className="flex flex-col items-center sm:items-start group">
                 <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{profile.stats.posts}</span>
                 <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">Quests</span>
               </div>
               <div 
                 onClick={() => profileUser?.followers?.length > 0 && setFollowListType('followers')}
                 className={`flex flex-col items-center sm:items-start group ${profileUser?.followers?.length > 0 ? 'cursor-pointer' : ''}`}
               >
                 <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{profile.stats.followers}</span>
                 <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">Allies</span>
               </div>
               <div 
                 onClick={() => profileUser?.following?.length > 0 && setFollowListType('following')}
                 className={`flex flex-col items-center sm:items-start group ${profileUser?.following?.length > 0 ? 'cursor-pointer' : ''}`}
               >
                 <span className="text-xl sm:text-2xl font-bold text-white group-hover:text-rose-400 transition-colors uppercase tracking-tight">{profile.stats.following}</span>
                 <span className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold">Following</span>
               </div>
            </div>

            {/* Action Buttons (Mobile) */}
            <div className="sm:hidden flex gap-3 pt-4">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-medium hover:bg-slate-700 hover:border-cyan-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all flex justify-center items-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                  <Link to="/settings" className="flex items-center px-4 py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all">
                    <Settings size={20} />
                  </Link>
                </>
              ) : (
                <>
                  <button 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all shadow-lg text-center ${
                      isFollowing 
                        ? "bg-slate-800 border border-slate-700 text-slate-300" 
                        : isFollower
                          ? "bg-purple-500 text-white shadow-purple-500/30"
                          : "bg-cyan-500 text-slate-950 shadow-cyan-500/30"
                    }`}
                  >
                    {isFollowing ? "Following" : isFollower ? "Follow Back" : "Follow"}
                  </button>
                  <button 
                    onClick={handleMessageClick}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800/80 backdrop-blur-md border border-slate-700 text-white font-bold hover:bg-slate-700 hover:border-cyan-500 shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all text-center"
                  >
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-slate-800/60 bg-slate-900/30 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex justify-center gap-6 sm:gap-16">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 relative font-semibold transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''} />
                  <span className="hidden sm:block uppercase tracking-widest text-sm">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeProfileTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_-2px_15px_rgba(34,211,238,0.6)]"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dynamic Tab Content */}
        <div className="min-h-[300px]">
          {activeTab === 'posts' && (
            <ProfileGrid 
              posts={finalUserPosts} 
              loading={loadingUserPosts}
              emptyStateIcon={Camera}
              emptyStateTitle="No Quests Yet"
              emptyStateMessage="When you share photos of your adventures, they will appear here on your profile grid."
            />
          )}

          {activeTab === 'saved' && isOwnProfile && (
            <ProfileGrid 
              posts={finalSavedPosts} 
              loading={false}
              emptyStateIcon={FolderOpen}
              emptyStateTitle="Archive Empty"
              emptyStateMessage="Only you can see what you've saved. Tap the bookmark icon on any post to save it here."
            />
          )}

          {activeTab === 'tagged' && (
            <ProfileGrid 
              posts={finalTaggedPosts} 
              loading={loadingTaggedPosts}
              emptyStateIcon={Tag}
              emptyStateTitle="No Tags Here"
              emptyStateMessage="When your allies tag you in their photos, they'll appear here."
            />
          )}
        </div>
      </div>
      
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={handleSaveProfile}
        isSaving={isSaving}
      />

      <FollowListModal 
        isOpen={followListType !== null}
        onClose={() => setFollowListType(null)}
        title={followListType === 'followers' ? 'Allies' : 'Following'}
        uids={followListType === 'followers' ? profileUser?.followers : profileUser?.following}
      />
    </div>
  );
}