'use client'

interface SaveButtonProps {
  onSave: () => void
  isSaving?: boolean
  label?: string
  savingLabel?: string
}

export const SaveButton = ({ onSave, isSaving = false, label = 'Save Changes', savingLabel = 'Saving...' }: SaveButtonProps) => (
  <button
    onClick={onSave}
    disabled={isSaving}
    className="px-8 py-4 bg-primary-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary-800 transition-all shadow-xl hover:shadow-primary-900/20 disabled:opacity-50"
  >
    {isSaving ? savingLabel : label}
  </button>
)
