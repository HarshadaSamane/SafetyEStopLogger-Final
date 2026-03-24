import React from 'react';

const EditStationModal = ({ editStation, setEditStation, onClose, onSubmit }) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Edit Station</h3>
            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
                    <input
                        type="text"
                        value={editStation.name}
                        onChange={(e) => setEditStation({ ...editStation, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        value={editStation.location || ''}
                        onChange={(e) => setEditStation({ ...editStation, location: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div className="flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default EditStationModal;