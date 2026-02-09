
import { useEffect, useMemo, useState } from "react";
import UserMetrics from "../../components/common/UserMatrics";
import ErrorNotice from "../../components/common/ErrorNotice";
import { listClubs, listGolfers } from "../../services/clubService";

const Dashboard = () => {
  const [clubs, setClubs] = useState([]);
  const [golfers, setGolfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(null);

  useEffect(() => {
    let alive = true;
    const loadDashboard = async () => {
      setLoading(true);
      setPageError(null);
      try {
        const [clubList, golferList] = await Promise.all([
          listClubs(),
          listGolfers(),
        ]);
        if (!alive) return;
        setClubs(clubList ?? []);
        setGolfers(golferList ?? []);
      } catch (err) {
        if (!alive) return;
        setPageError(err);
        setClubs([]);
        setGolfers([]);
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadDashboard();
    return () => {
      alive = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalGolfers = golfers.length;
    const totalClubs = clubs.length;
    const activeGolfers = golfers.filter(
      (user) => String(user?.accountStatus || "").toLowerCase() === "active",
    ).length;
    const activeClubs = totalClubs;
    const activeUsers = activeGolfers + activeClubs;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newClubsThisMonth = clubs.filter((club) => {
      const createdAt = club?.createdAt ? new Date(club.createdAt) : null;
      return createdAt && createdAt >= startOfMonth;
    }).length;

    return {
      totalGolfers,
      totalClubs,
      activeGolfers,
      activeClubs,
      activeUsers,
      newClubsThisMonth,
    };
  }, [clubs, golfers]);

  const buildRegistrationMetrics = (items) => {
    const dates = (items ?? [])
      .map((item) => new Date(item?.createdAt))
      .filter((date) => !Number.isNaN(date.getTime()));

    const now = new Date();
    const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - (4 - i));
    const yearly = years.map((year) => ({
      year,
      newUsers: dates.filter((d) => d.getFullYear() === year).length,
    }));

    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      return date;
    });
    const monthly = months.map((date) => ({
      month: date.toLocaleString("en-US", { month: "short" }),
      newUsers: dates.filter(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth(),
      ).length,
    }));

    const weeks = Array.from({ length: 8 }, (_, i) => {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (7 - i) * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 7);
      return { start, end, label: `Week ${i + 1}` };
    });
    const weekly = weeks.map((range) => ({
      week: range.label,
      newUsers: dates.filter(
        (d) => d >= range.start && d < range.end,
      ).length,
    }));

    return { yearly, monthly, weekly };
  };

  const userMetricsData = useMemo(() => {
    return buildRegistrationMetrics([...clubs, ...golfers]);
  }, [clubs, golfers]);

  const metricCards = [
    {
      title: "Active Users",
      value: metrics.activeUsers,
      helper: "All roles",
    },
    {
      title: "Active Golfers",
      value: metrics.activeGolfers,
      helper: "Verified golfers",
    },
    {
      title: "Active Golf Clubs",
      value: metrics.activeClubs,
      helper: "Verified clubs",
    },
    {
      title: "Total Golfers",
      value: metrics.totalGolfers,
      helper: "All registrations",
    },
    {
      title: "Total Golf Clubs",
      value: metrics.totalClubs,
      helper: "All registrations",
    },
    {
      title: "New Clubs This Month",
      value: metrics.newClubsThisMonth,
      helper: "This month",
    },
  ];

  const newestClubs = useMemo(() => {
    return [...clubs]
      .filter((club) => club?.name || club?.clubname)
      .sort((a, b) => {
        const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      })
      .slice(0, 5);
  }, [clubs]);


  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Track active members, registrations, and club creation at a glance.
        </p>
      </div>

      {loading && (
        <div className="text-sm text-gray-500 mb-6">Loading dashboard data...</div>
      )}
      {pageError && <ErrorNotice error={pageError} className="mb-6" />}

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
          <div className="bg-white border border-[#F1E7E0] rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Newest Clubs</h4>
            <div className="space-y-3">
              {newestClubs.map((club, index) => (
                <div key={`${club.name || club.clubname}-${index}`} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {club.name || club.clubname}
                    </p>
                    <p className="text-xs text-gray-500">
                      {club?.createdAt
                        ? `Created ${new Date(club.createdAt).toLocaleDateString()}`
                        : "Pending activation"}
                    </p>
                  </div>
                  <button className="text-xs px-3 py-1 rounded-full bg-[#F5EDE8] text-[#9D4C1D] font-semibold">
                    Activate
                  </button>
                </div>
              ))}
              {!newestClubs.length && (
                <div className="text-sm text-gray-500">No clubs found.</div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
