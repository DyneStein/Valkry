import React, { useState, useRef, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Save, User, Mail, AtSign, ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getStorage } from 'firebase/storage';
import { updateUserAvatar } from '../services/userStats';

const ProfilePage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [displayName, setDisplayName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [copied, setCopied] = useState(false);

    // Sync state when user data loads
    useEffect(() => {
        if (user) {
            setDisplayName(user.name || '');
            setAvatarPreview(user.avatar || null);
        }
    }, [user]);

    // Redirect if not authenticated
    if (!authLoading && !user) {
        return <Navigate to="/signin" replace />;
    }

    // Compress image for faster uploads
    const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(resolve, 'image/jpeg', quality);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Image must be smaller than 10MB' });
                return;
            }

            // Show preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Compress the image for upload
            setMessage({ type: 'info', text: 'Optimizing image...' });
            const compressedBlob = await compressImage(file);
            const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
            setAvatarFile(compressedFile);
            setMessage({ type: '', text: '' });
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            let photoURL = user?.avatar;

            // Upload image if new file selected
            if (avatarFile) {
                const storage = getStorage();
                const storageRef = ref(storage, `avatars/${user.id}/${Date.now()}`);
                await uploadBytes(storageRef, avatarFile);
                photoURL = await getDownloadURL(storageRef);
            }

            // Update Firebase Auth profile
            await updateProfile(auth.currentUser, {
                displayName: displayName,
                photoURL: photoURL
            });

            // Also update userStats and leaderboard with new avatar
            if (photoURL) {
                await updateUserAvatar(user.id, photoURL);
            }

            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Refresh the page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        }

        setSaving(false);
    };

    return (
        <div className="page">
            <div className="container" style={{ paddingTop: '56px', paddingBottom: '56px', maxWidth: '500px' }}>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-ghost"
                    style={{ marginBottom: '24px', padding: '8px 0' }}
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <p className="caption" style={{ marginBottom: '8px' }}>Settings</p>
                    <h1 className="headline">Your Profile</h1>
                </div>

                {/* Avatar Upload */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            margin: '0 auto 16px',
                            background: avatarPreview ? `url(${avatarPreview}) center/cover` : 'var(--bg-elevated)',
                            border: '2px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                        {!avatarPreview && (
                            <span style={{ fontSize: '40px', color: 'var(--text-tertiary)' }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                        <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Camera size={16} color="white" />
                        </div>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <p className="caption">Click to upload a photo</p>
                </div>

                {/* Form */}
                <div className="card" style={{ background: 'var(--bg-elevated)' }}>
                    {/* Display Name */}
                    <div style={{ marginBottom: '20px' }}>
                        <label className="caption" style={{ display: 'block', marginBottom: '8px' }}>
                            Display Name
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={16} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)'
                            }} />
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="input"
                                style={{ paddingLeft: '40px' }}
                                placeholder="Your name"
                            />
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div style={{ marginBottom: '20px' }}>
                        <label className="caption" style={{ display: 'block', marginBottom: '8px' }}>
                            Email
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)'
                            }} />
                            <input
                                type="email"
                                value={user?.email || ''}
                                className="input"
                                style={{ paddingLeft: '40px', opacity: 0.6 }}
                                disabled
                            />
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                            Email cannot be changed
                        </p>
                    </div>

                    {/* User ID (for Friends) */}
                    <div style={{ marginBottom: '20px' }}>
                        <label className="caption" style={{ display: 'block', marginBottom: '8px' }}>
                            Your User ID
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 14px',
                            background: 'var(--bg-secondary)',
                            borderRadius: '10px',
                            border: '1px solid var(--border)'
                        }}>
                            <code className="mono" style={{ flex: 1, fontSize: '12px', color: 'var(--text)', wordBreak: 'break-all' }}>
                                {user?.id}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(user?.id);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                style={{
                                    padding: '6px 12px',
                                    background: copied ? 'var(--green)' : 'var(--accent)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                {copied ? <CheckCircle size={12} /> : <Copy size={12} />}
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '6px' }}>
                            Share this ID with friends so they can add you
                        </p>
                    </div>

                    {/* Handle (Read-only) */}
                    <div style={{ marginBottom: '24px' }}>
                        <label className="caption" style={{ display: 'block', marginBottom: '8px' }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <AtSign size={16} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-tertiary)'
                            }} />
                            <input
                                type="text"
                                value={user?.handle || ''}
                                className="input"
                                style={{ paddingLeft: '40px', opacity: 0.6 }}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div style={{
                            padding: '12px 16px',
                            borderRadius: '10px',
                            marginBottom: '20px',
                            background: message.type === 'success' ? 'rgba(48, 209, 88, 0.1)'
                                : message.type === 'info' ? 'rgba(0, 113, 227, 0.1)'
                                    : 'rgba(255, 69, 58, 0.1)',
                            color: message.type === 'success' ? 'var(--green)'
                                : message.type === 'info' ? 'var(--accent)'
                                    : 'var(--red)',
                            fontSize: '14px'
                        }}>
                            {message.text}
                        </div>
                    )}

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving || !displayName.trim()}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px', opacity: saving ? 0.7 : 1 }}
                    >
                        <Save size={16} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
