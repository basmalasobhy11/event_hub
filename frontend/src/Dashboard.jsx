import { useEffect, useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { api } from './api';
import './Dashboard.css';

const SENTIMENT_COLORS = {
  positive: '#042874',
  neutral: '#888780',
  negative: '#580808ff',
};

export default function Dashboard() {
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('bookingsCount');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    api.analyticsSummary()
      .then(setSnapshot)
      .catch((err) => setError(err.message));
  }, []);

  const rows = useMemo(() => {
    if (!snapshot) return [];

    const filtered = snapshot.eventsTable.filter((row) =>
      row.title.toLowerCase().includes(search.toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;

      return a[sortKey] > b[sortKey]
        ? dir
        : a[sortKey] < b[sortKey]
        ? -dir
        : 0;
    });
  }, [snapshot, search, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  if (error) {
    return (
      <p style={{ color: 'crimson' }}>
        Failed to load analytics: {error}
      </p>
    );
  }

  if (!snapshot) {
    return <p>Loading analytics...</p>;
  }

  const sentimentData = Object.entries(snapshot.sentimentTotals).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const columns = [
    ['title', 'Event'],
    ['bookingsCount', 'Bookings'],
    ['revenue', 'Revenue'],
    ['reviewCount', 'Reviews'],
    ['avgSentimentScore', 'Avg sentiment'],
  ];

  return (
    <div className="dashboard">

      <p className="last-generated">
        Last generated:{' '}
        {new Date(snapshot.generatedAt).toLocaleString()}
      </p>

      <div className="charts-container">

        <div className="chart-card">
          <h3>Bookings over time</h3>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={snapshot.bookingsTimeseries}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#378ADD"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h3>Review sentiment</h3>

          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                >
                  {sentimentData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        SENTIMENT_COLORS[entry.name] || '#888'
                      }
                    />
                  ))}
                </Pie>

                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="events-section">

        <h3>Events</h3>

        <input
          className="search-input"
          placeholder="Filter by event title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="table-container">
          <table className="events-table">

            <thead>
              <tr>
                {columns.map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key)}
                  >
                    {label}

                    {sortKey === key
                      ? sortDir === 'asc'
                        ? ' ↑'
                        : ' ↓'
                      : ''}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.eventId}>

                  <td>
                    {row.title}
                  </td>

                  <td>
                    {row.bookingsCount}
                  </td>

                  <td>
                    ${row.revenue}
                  </td>

                  <td>
                    {row.reviewCount}
                  </td>

                  <td>
                    {row.avgSentimentScore}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {rows.length === 0 && (
          <p>No events match your filter.</p>
        )}

      </div>

    </div>
  );
}