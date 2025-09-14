import { AdminAppEditForm } from '@/components/admin/AdminAppEditForm';

interface EditAppPageProps {
  params: {
    id: string;
  };
}

export default function EditAppPage({ params }: EditAppPageProps) {
  return <AdminAppEditForm appId={params.id} />;
}
