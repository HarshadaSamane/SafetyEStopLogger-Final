import React from "react";

const AcknowledgeModal = ({
  open,
  form,
  setForm,
  onClose,
  onSubmit,
  loading,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-4">Acknowledge Incident</h3>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue was about? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.issue}
              onChange={(e) =>
                setForm((p) => ({ ...p, issue: e.target.value }))
              }
              placeholder="e.g., Conveyor jam at Station 3"
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={4}
              value={form.comment}
              onChange={(e) =>
                setForm((p) => ({ ...p, comment: e.target.value }))
              }
              placeholder="Add any context..."
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Saving…" : "Acknowledge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcknowledgeModal;