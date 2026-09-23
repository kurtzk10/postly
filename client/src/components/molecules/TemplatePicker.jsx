import TemplateOption from './TemplateOption.jsx'

export default function TemplatePicker({ templates, selectedId, imageUrl, onChange }) {
  return (
    <fieldset className="min-w-0">
      <legend className="font-semibold">
        Pick a template <span aria-hidden="true" className="lg:hidden">→</span>
      </legend>
      {/* A contained sideways scroll on phones; a 3-up grid on desktop. */}
      <div className="-mx-2 mt-2 flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
        {templates.map((t) => (
          <TemplateOption
            key={t.id}
            template={t}
            imageUrl={imageUrl}
            checked={selectedId === t.id}
            onChange={onChange}
          />
        ))}
      </div>
    </fieldset>
  )
}
