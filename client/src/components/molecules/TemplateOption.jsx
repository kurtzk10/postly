import PostcardFront from './PostcardFront.jsx'

// A radio button styled as a small preview of the template.
export default function TemplateOption({ template, imageUrl, checked, onChange }) {
  const id = `template-${template.slug}`
  return (
    <div className="w-36 shrink-0 lg:w-auto">
      <input
        type="radio"
        id={id}
        name="template"
        value={template.id}
        checked={checked}
        onChange={() => onChange(template.id)}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className="block cursor-pointer rounded-lg border-2 border-transparent p-2 transition hover:bg-bg peer-checked:border-primary-strong peer-checked:bg-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-strong"
      >
        <PostcardFront imageUrl={imageUrl} templateSlug={template.slug} compact />
        <span className="mt-2 block text-center text-small font-semibold">{template.name}</span>
      </label>
    </div>
  )
}
