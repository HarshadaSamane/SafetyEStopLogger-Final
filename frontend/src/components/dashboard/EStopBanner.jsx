import React from 'react';

const EStopBanner = ({ count, onReview }) => (
    <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <span className="inline-block w-3 h-3 rounded-full bg-red-600 animate-pulse" />
            <div>
                <div className="font-semibold text-red-700">E‑STOP ACTIVE</div>
                <div className="text-sm text-red-700/80">
                    {count} incident{count > 1 ? 's' : ''} require attention. Please acknowledge or close.
                </div>
            </div>
        </div>
        <button onClick={onReview} className="px-3 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700">
            Review Incidents
        </button>
    </div>
);

export default EStopBanner;
