import UploadDropzone from '../molecules/UploadDropzone.jsx'
import TemplatePicker from '../molecules/TemplatePicker.jsx'
import FormField from '../molecules/FormField.jsx'

export const CAPTION_MAX = 140

export default function CaptureForm({ input, templates, uploadStatus, uploadError, onFile, onChange }) {
  return (
    <div className="min-w-0 space-y-8">
      <UploadDropzone
        previewUrl={input.imageUrl || input.localPreviewUrl}
        uploadStatus={uploadStatus}
        error={uploadError}
        onFile={onFile}
      />
      <div className="rounded-xl bg-surface p-4">
        <TemplatePicker
          templates={templates}
          selectedId={input.templateId}
          imageUrl={input.imageUrl || input.localPreviewUrl}
          onChange={(templateId) => onChange({ templateId })}
        />
      </div>
      <div className="rounded-xl bg-surface p-4">
        <FormField
          id="caption"
          label="Caption"
          value={input.caption}
          onChange={(caption) => onChange({ caption })}
          placeholder="Write something about today…"
          maxLength={CAPTION_MAX}
        />
      </div>
    </div>
  )
}
