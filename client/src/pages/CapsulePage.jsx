import { useEffect, useState } from "react";
import { api } from "../api/client";
import { usePostcards } from "../context/postcards.js";
import { toDateKey } from "../lib/dates";
import Button from "../components/atoms/Button";
import Spinner from "../components/atoms/Spinner"
import CapsuleVault from "../components/organisms/CapsuleVault";
import SealCapsuleForm from "../components/organisms/SealCapsuleForm.jsx";
import CapsuleRevealModal from "../components/organisms/CapsuleRevealModal";
import FlashbackStrip from "../components/organisms/FlashbackStrip";

// =============================================================================
// CapsulePage.jsx: the /capsule screen. It OWNS the capsules list and puts
// the other five pieces on the page. (Wireframe page 5.)
// Written by: me (kurtzk10). Hints by the AI; the code is mine.
// =============================================================================

export default function CapsulePage() {
  const { postcards } = usePostcards();
  const [capsules, setCapsules] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const todayKey = toDateKey(new Date());

  useEffect(() => {
    let cancelled = false
    api('/capsules')
      .then((data) => {
        if (cancelled) return;
        setCapsules(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus('error');
        setError(err.message);
      });
    return () => {
      cancelled = true
    }
  }, [])

  function handleSealed(capsule) {
    setCapsules((list) => (
      [...list, capsule].sort((a, b) => a.unlockAt.localeCompare(b.unlockAt))
    ));
    setFormOpen(false)
  }

  async function handleOpen(capsule) {
    try {
      const opened = await api(`/capsules/${capsule.id}/open`, { method: 'POST' });
      setCapsules((list) => list.map((c) => (c.id === opened.id ? opened : c)));
      setRevealed(opened);
    } catch (err) {
      setError(err.message);
    }
  }

  const sealedCount = capsules.filter((c) => c.isLocked).length;
  const readyCount = capsules.filter((c) => !c.isLocked).length;


  return (
    <div className="space-y-8">
      <h1 className="text-heading">Time capsule</h1>
      <p>Seal a postcard and a note for a future date · {sealedCount} sealed, {readyCount} ready to open</p>

      {status === 'loading' && <Spinner label="Loading your capsules" />}

      {status === 'error' && (
        <p role="alert" className="rounded-xl bg-surface p-4 font-semibold text-red-800">{error}</p>
      )}

      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="order-last space-y-4 lg:order-none">
          {!formOpen && (
            <Button variant="ghost" className="w-full lg:hidden" onClick={() => setFormOpen(true)}>
              + New capsule
            </Button>
          )}
          <div className={formOpen ? '' : 'hidden lg:block'}>
            <SealCapsuleForm postcards={postcards} onSealed={handleSealed} />
          </div>
        </div>

        <CapsuleVault capsules={capsules} todayKey={todayKey} onOpen={handleOpen} />
        <div className="order-first lg:order-last lg:col-span-2">
          <FlashbackStrip />
        </div>
      </div>
      {revealed && <CapsuleRevealModal capsule={revealed} onClose={() => setRevealed(null)} />}
    </div>
  )
}