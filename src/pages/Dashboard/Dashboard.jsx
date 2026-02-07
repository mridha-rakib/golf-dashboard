
import { useState } from "react";
import UserMetrics from "../../components/common/UserMatrics";
import { clubs as clubData } from "../../constants/clubs";
import { userMetrics } from "../../constants/userMatrics";
import { dummyUsers } from "../../constants/users";

const Dashboard = () => {
  const userMetricsData = userMetrics;
  const [newClubName, setNewClubName] = useState("");
  const [clubs, setClubs] = useState(clubData || []);

  const totalGolfers = dummyUsers.filter((user) => user.role !== "golf_club").length;
  const totalClubs = dummyUsers.filter((user) => user.role === "golf_club").length;
  const activeUsers = dummyUsers.filter((user) => user.status !== "Banned").length;
  const activeGolfers = dummyUsers.filter(
    (user) => user.role !== "golf_club" && user.status !== "Banned"
  ).length;
  const activeClubs = dummyUsers.filter(
    (user) => user.role === "golf_club" && user.status !== "Banned"
  ).length;

  const metricCards = [
    {
      title: "Active Users",
      value: activeUsers,
      helper: "All roles",
    },
    {
      title: "Active Golfers",
      value: activeGolfers,
      helper: "Verified golfers",
    },
    {
      title: "Active Golf Clubs",
      value: activeClubs,
      helper: "Verified clubs",
    },
    {
      title: "Total Golfers",
      value: totalGolfers,
      helper: "All registrations",
    },
    {
      title: "Total Golf Clubs",
      value: totalClubs,
      helper: "All registrations",
    },
    {
      title: "New Clubs This Month",
      value: Math.max(1, Math.floor(totalClubs / 3)),
      helper: "Simulated",
    },
  ];

  const handleCreateClub = (e) => {
    e.preventDefault();
    if (!newClubName.trim()) return;
    setClubs((prev) => [
      {
        clubname: newClubName.trim(),
        members: [],
      },
      ...prev,
    ]);
    setNewClubName("");
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track active members, registrations, and club creation at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {metricCards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#F1E7E0] p-5 shadow-sm">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#9D4C1D] mb-2">
                  {card.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-2">{card.helper}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#F1E7E0] rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">New Registration Metrics</h2>
                <p className="text-sm text-gray-500">Breakdown by yearly, monthly, and weekly growth.</p>
              </div>
            </div>
            <UserMetrics data={userMetricsData} />
          </div>
        </section>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-[#FFF7F2] via-white to-[#F5EDE8] border border-[#F1E7E0] rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Create New Golf Club</h3>
            <p className="text-sm text-gray-500 mb-4">
              Add newly registered golf clubs and keep them active.
            </p>
            <form onSubmit={handleCreateClub} className="space-y-3">
              <input
                type="text"
                value={newClubName}
                onChange={(e) => setNewClubName(e.target.value)}
                placeholder="Club name"
                className="w-full rounded-xl border border-[#E7D9CF] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#9D4C1D]"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#9D4C1D] text-white py-2 font-semibold hover:bg-[#7a3814] transition"
              >
                Create Club
              </button>
            </form>
          </div>

          <div className="bg-white border border-[#F1E7E0] rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Newest Clubs</h4>
            <div className="space-y-3">
              {clubs.slice(0, 5).map((club, index) => (
                <div key={`${club.clubname}-${index}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{club.clubname}</p>
                    <p className="text-xs text-gray-500">Pending activation</p>
                  </div>
                  <button className="text-xs px-3 py-1 rounded-full bg-[#F5EDE8] text-[#9D4C1D] font-semibold">
                    Activate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
