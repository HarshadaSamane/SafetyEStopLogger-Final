import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, ChevronDown, KeyRound } from 'lucide-react';


const Navbar = ({ onManageUsers, onLogout, onChangePassword }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);
    const btnRef = useRef(null);


    // Change Password modal state
    const [showPwdModal, setShowPwdModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');


    // prefer the parent-provided onLogout if available
    const handleLogout = () => {
        if (typeof onLogout === 'function') {
            onLogout();
            return;
        }
        try {
            logout();
        } finally {
            navigate('/login');
        }
    };

    const isAdmin = String(user?.role || '').toLowerCase() === 'admin';
    const displayName = user?.fullName || user?.name || user?.email || 'Account';
    const displayRole = user?.role || 'User';

    const handleManageUsersClick = (e) => {
        e?.preventDefault?.();
        e?.stopPropagation?.();

        if (typeof onManageUsers === 'function') {
            // 🔒 No navigation; ask the Dashboard to open the Users view
            onManageUsers();
        } else {
            // Fallback: navigate with a query param if no prop is provided
            navigate('/dashboard?view=users', { replace: false });
        }
        setOpen(false);
    };

    // Close menu on outside click
    useEffect(() => {
        const onDocClick = (e) => {
            if (!open) return;
            const target = e.target;
            if (
                menuRef.current &&
                !menuRef.current.contains(target) &&
                btnRef.current &&
                !btnRef.current.contains(target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [open]);


    // Open Change Password modal
    const openChangePwd = () => {
        setOpen(false);
        setFormError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPwdModal(true);
    };

    // Submit Change Password
    const submitChangePassword = async (e) => {
        e?.preventDefault?.();
        setFormError('');

        // Basic validations
        if (!currentPassword || !newPassword || !confirmPassword) {
            setFormError('Please fill in all fields.');
            return;
        }
        if (newPassword.length < 8) {
            setFormError('New password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setFormError('New password and confirm password do not match.');
            return;
        }

        try {
            setSubmitting(true);
            if (typeof onChangePassword === 'function') {
                await onChangePassword({ currentPassword, newPassword });
                // Parent will show toast; we just close the modal
                setShowPwdModal(false);
            } else {
                // Fallback if parent is not wired
                setFormError('Change password is not configured.');
            }
        } catch (err) {
            // Show a safe inline error (parent may also toast)
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Failed to change password.';
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <nav className="bg-white shadow-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xl">ES</span>
                            </div>
                            <span className="ml-3 text-xl font-bold text-gray-900">
                                Safety E-Stop System
                            </span>
                        </div>
                    </div>

                    {/* Right: Account */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                ref={btnRef}
                                onClick={() => setOpen((v) => !v)}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Account"
                            >
                                <User className="w-5 h-5 text-blue-600" />
                                <div className="flex flex-col items-start">
                                    <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                                        {displayName}
                                    </p>
                                    <p className="text-xs text-gray-600">{displayRole}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </button>

                            {/* Dropdown */}
                            {open && (
                                <div
                                    ref={menuRef}
                                    className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50 overflow-hidden"
                                >

                                    {/* Change Password (visible for any logged-in user) */}
                                    {/*<button*/}
                                    {/*    onClick={openChangePwd}*/}
                                    {/*    className="w-full text-left px-4 py-2 hover:bg-gray-50 inline-flex items-center gap-2"*/}
                                    {/*>*/}
                                    {/*    <KeyRound className="w-4 h-4 text-gray-700" />*/}
                                    {/*    Change Password*/}
                                    {/*</button>*/}


                                    {isAdmin && (
                                        <button
                                            onClick={handleManageUsersClick}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50"
                                        >
                                            Manage Users
                                        </button>
                                    )}
                                    {isAdmin && <div className="h-px bg-gray-100" />}
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600 inline-flex items-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPwdModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => !submitting && setShowPwdModal(false)}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-4">Change Password</h3>

                        <form onSubmit={submitChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    className="w-full rounded-lg border px-3 py-2"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border px-3 py-2"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    disabled={submitting}
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters.</p>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    className="w-full rounded-lg border px-3 py-2"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={submitting}
                                    required
                                />
                            </div>

                            {formError && (
                                <p className="text-sm text-red-600">{formError}</p>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => !submitting && setShowPwdModal(false)}
                                    className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Updating…' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </nav>
    );
};

export default Navbar;