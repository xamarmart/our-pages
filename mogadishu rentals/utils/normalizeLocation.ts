export default function normalizeLocation(raw?: string | null) {
  const input = raw ?? '';
  if (!input) return { display: '', district: '' };
  const parts = input.split(',').map(p => p.trim()).filter(Boolean);
  const unique: string[] = [];
  parts.forEach(p => {
    if (!unique.some(u => u.toLowerCase() === p.toLowerCase())) unique.push(p);
  });
  return {
    display: unique.join(', '),
    district: unique[0] ?? ''
  };
}
