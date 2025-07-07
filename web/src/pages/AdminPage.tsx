import AdminContestForm from '../components/AdminContestForm';

export default function AdminPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: Create Contest</h1>
      <AdminContestForm />
    </div>
  );
}
