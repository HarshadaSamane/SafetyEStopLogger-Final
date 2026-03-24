import React from 'react';

const CreateStationForm = ({ newStation, setNewStation, onCancel, onSubmit }) => (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Station</h3>

        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
                    <input
                        type="text"
                        value={newStation?.name ?? ''}
                        onChange={(e) => setNewStation({ ...newStation, name: e.target.value })}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Station A"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={newStation?.location ?? ''}
                        onChange={(e) => setNewStation({ ...newStation, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Building A, Floor 2"
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Create Station
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
);

export default CreateStationForm;