// src/pages/Analytics/index.jsx
import { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import UserMetrics from "../../components/common/UserMatrics";
import { userMetrics } from "../../constants/userMatrics";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("Yearly");
  const analytics = {
    platformOverview: {
      activeUsers: 1320,
      newSignups: 140,
      totalUsers: 4520,
      activeEvents: 18,
      totalEvents: 72,
    },
    eventsOverview: {
      today: 2,
      upcoming: 10,
      all: 72,
    },
    eventsMetrics: userMetrics,
    userMetrics,
  };
  const allData = analytics?.eventsMetrics || {};
  const userMetricsData = analytics?.userMetrics;

  const data = () => {
    switch ((selectedPeriod || "").toLowerCase()) {
      case "yearly":
        return (allData.yearly || []).map((item) => ({
          date: item.year,
          count: item.newUsers ?? 0,
        }));
      case "monthly":
        return (allData.monthly || []).map((item) => ({
          date: item.month,
          count: item.newUsers ?? 0,
        }));
      case "weekly":
        return (allData.weekly || []).map((item) => ({
          date: item.week,
          count: item.newUsers ?? 0,
        }));
      default:
        return [];
    }
  };

  const metricCards = [
    { title: "Active Users", value: analytics?.platformOverview?.activeUsers ?? "0" },
    { title: "New Signups", value: analytics?.platformOverview?.newSignups ?? "0" },
    { title: "Total Users", value: analytics?.platformOverview?.totalUsers ?? "0" },
    { title: "Active Events", value: analytics?.platformOverview?.activeEvents ?? "0" },
    { title: "Total Events", value: analytics?.platformOverview?.totalEvents ?? "0" },
  ];

  const secondRowCards = [
    { title: "Today", value: analytics?.eventsOverview?.today ?? "0" },
    { title: "Upcoming", value: analytics?.eventsOverview?.upcoming ?? "0" },
    { title: "All", value: analytics?.eventsOverview?.all ?? "0" },
  ];

  return (
    <div className="w-full bg-white  space-y-10">
      {/* Top Metrics */}
      <section className="space-y-6">
        <h2 className="text-[32px] sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Platform Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {metricCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#F5EDE8] rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <UserMetrics data={userMetricsData} />

      {/* Second Metrics Row */}
      <section className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Events Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {secondRowCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-[#F5EDE8] rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-2">
                {card.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Chart */}
      <section className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-[#F5EDE8] rounded-t-lg p-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Events Metrics
          </h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="mt-2 sm:mt-0 appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="Yearly">Yearly</option>
            <option value="Monthly">Monthly</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <div className="w-full h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#AA6239" />
            </BarChart>
          </ResponsiveContainer>

        </div>
      </section>
    </div>
  );
};

export default Analytics;