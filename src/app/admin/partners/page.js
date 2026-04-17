import PartnerManager from './PartnerManager';

export default function AdminPartnersPage() {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '2rem' }}>পার্টনার লোগো ম্যানেজমেন্ট</h1>
      <PartnerManager />
    </div>
  );
}
