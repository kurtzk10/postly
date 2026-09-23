import { useState } from 'react'
import Button from '../atoms/Button.jsx'
import PostcardFront from '../molecules/PostcardFront.jsx'
import PostcardBack from '../molecules/PostcardBack.jsx'

// Desktop shows both faces at once. Phones show one face and a flip button.
export default function PostcardPreview({ imageUrl, caption, templateSlug, dateLabel, heading = 'Live preview' }) {
  const [face, setFace] = useState('front')

  return (
    <section aria-labelledby="preview-heading" className="space-y-4 rounded-xl bg-surface p-4">
      <h2 id="preview-heading" className="font-semibold">
        {heading}
      </h2>

      <div className={face === 'back' ? 'hidden lg:block' : ''}>
        <p className="mb-2 text-small text-primary-strong">Front</p>
        <PostcardFront imageUrl={imageUrl} templateSlug={templateSlug} alt="Postcard front" />
      </div>
      <div className={face === 'front' ? 'hidden lg:block' : ''}>
        <p className="mb-2 text-small text-primary-strong">Back</p>
        <PostcardBack caption={caption} dateLabel={dateLabel} />
      </div>

      <div className="text-center lg:hidden">
        <Button variant="ghost" onClick={() => setFace(face === 'front' ? 'back' : 'front')}>
          Show {face === 'front' ? 'back' : 'front'}
        </Button>
      </div>
    </section>
  )
}
