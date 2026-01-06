import DashboardLayout from '../dashboard/layout';

export default function GeneratePageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
