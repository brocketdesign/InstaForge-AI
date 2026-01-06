import DashboardLayout from '../dashboard/layout';

export default function ProfilePageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
