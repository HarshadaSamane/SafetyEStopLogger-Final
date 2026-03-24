import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';

import { authAPI } from '../../api/apiService';

import { toast } from 'sonner';

import { UserPlus, Mail, Lock, User, Briefcase, Eye, EyeOff } from 'lucide-react';

const Register = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        fullName: '',

        employeeId: '',

        email: '',

        password: '',

        role: 'Operator',

    });

    const [loading, setLoading] = useState(false);

    // local state for password visibility

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            await authAPI.register(formData);

            toast.success('Registration successful! Please login.');

            navigate('/login');

        } catch (error) {

            toast.error(error.response?.data || 'Registration failed. Please try again.');

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-600 mt-2">Join the Safety E-Stop System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Full Name
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input

                                type="text"

                                name="fullName"

                                value={formData.fullName}

                                onChange={handleChange}

                                required

                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"

                                placeholder="John Doe"

                                autoComplete="name"

                                

                            />
                        </div>
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Employee ID
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input

                                type="text"

                                name="employeeId"

                                value={formData.employeeId}

                                onChange={handleChange}

                                required

                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"

                                placeholder="EMP12345"

                                autoComplete="off"

                                
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <input

                                type="email"

                                name="email"

                                value={formData.email}

                                onChange={handleChange}

                                required

                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"

                                placeholder="you@example.com"

                                autoComplete="email"

                                
                            />
                        </div>
                    </div>

                    {/* Password with show/hide toggle */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Password
                        </label>

                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />

                            <input

                                type={showPassword ? 'text' : 'password'}

                                name="password"

                                value={formData.password}

                                onChange={handleChange}

                                required

                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"

                                placeholder="••••••••"

                                autoComplete="new-password"

                                minLength={6 }

                            />

                            <button

                                type="button"

                                onClick={() => setShowPassword((v) => !v)}

                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"

                                aria-label={showPassword ? 'Hide password' : 'Show password'}

                                aria-pressed={showPassword}
                            >

                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">

                            Min 6 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
                        </p>
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">

                            Role
                        </label>
                        <select

                            name="role"

                            value={formData.role}

                            onChange={handleChange}

                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="Operator">Operator</option>
                            <option value="Supervisor">Supervisor</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <button

                        type="submit"

                        disabled={loading}

                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >

                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">

                        Already have an account?{' '}
                        <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">

                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>

    );

};

export default Register;
