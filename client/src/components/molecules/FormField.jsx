import Label from '../atoms/Label.jsx'
import TextArea from '../atoms/TextArea.jsx'

export default function FormField({ id, label, value, onChange, placeholder, maxLength }) {
  const countId = `${id}-count`
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <TextArea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-describedby={countId}
      />
      <p id={countId} className="text-right text-small text-primary-strong">
        {value.length} / {maxLength}
      </p>
    </div>
  )
}
