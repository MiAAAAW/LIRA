import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Switch } from '@/Components/ui/switch';

export default function SectionToggle({ sectionKey, isVisible }) {
  const [checked, setChecked] = useState(isVisible);
  const [loading, setLoading] = useState(false);

  const handleToggle = (newValue) => {
    setChecked(newValue);
    setLoading(true);

    router.post('/admin/settings/toggle-section', {
      section: sectionKey,
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => setLoading(false),
      onError: () => {
        setChecked(!newValue); // revert on error
        setLoading(false);
      },
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        disabled={loading}
        className="data-[state=checked]:bg-green-600"
      />
      <span className="text-xs text-muted-foreground">
        {checked ? 'Visible' : 'Oculto'}
      </span>
    </div>
  );
}
