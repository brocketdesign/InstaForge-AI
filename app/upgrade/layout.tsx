import DashboardLayout from '../dashboard/layout';

export default function UpgradePageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
