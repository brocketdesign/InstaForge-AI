import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { UserProfile } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect('/');
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <UserProfile
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none',
            },
          }}
        />
      </div>
    </div>
  );
}
