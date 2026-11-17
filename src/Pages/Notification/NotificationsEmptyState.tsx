import { Bell } from "lucide-react";

function NotificationsEmptyState() {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white px-6 py-14 text-center shadow-sm">
      <span className="mx-auto grid size-14 place-items-center rounded-full bg-blue-50 text-blue-600">
        <Bell aria-hidden="true" size={24} />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-gray-900">
        You&apos;re all caught up
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        New activity from your community will show up here.
      </p>
    </section>
  );
}

export default NotificationsEmptyState;
