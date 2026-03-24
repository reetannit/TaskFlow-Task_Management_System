import { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineExclamation,
} from 'react-icons/hi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get('/tasks/analytics/summary');
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="loader-spinner" />
        <span className="loader-text">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="empty-state">
        <HiOutlineExclamation />
        <h3>Unable to load analytics</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  const statusChartData = {
    labels: ['Todo', 'In Progress', 'Done'],
    datasets: [
      {
        data: [
          analytics.statusBreakdown.todo,
          analytics.statusBreakdown['in-progress'],
          analytics.statusBreakdown.done,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const priorityChartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          analytics.priorityBreakdown.low,
          analytics.priorityBreakdown.medium,
          analytics.priorityBreakdown.high,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
          font: { family: 'Inter', size: 12 },
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { family: 'Inter' },
        },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Inter' } },
      },
    },
  };

  return (
    <>
      <div className="top-bar">
        <h1>Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="analytics-grid">
        <div className="stat-card total">
          <div className="stat-icon">
            <HiOutlineClipboardList />
          </div>
          <div className="stat-value">{analytics.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon">
            <HiOutlineCheckCircle />
          </div>
          <div className="stat-value">{analytics.statusBreakdown.done}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon">
            <HiOutlineClock />
          </div>
          <div className="stat-value">
            {analytics.statusBreakdown.todo + analytics.statusBreakdown['in-progress']}
          </div>
          <div className="stat-label">Pending</div>
        </div>

        <div className="stat-card overdue">
          <div className="stat-icon">
            <HiOutlineExclamation />
          </div>
          <div className="stat-value">{analytics.overdueTasks}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="chart-card" style={{ marginBottom: 20 }}>
        <h3>Completion Progress</h3>
        <div className="completion-bar">
          <div className="completion-bar-track">
            <div
              className="completion-bar-fill"
              style={{ width: `${analytics.completionPercentage}%` }}
            />
          </div>
          <div className="completion-value">
            {analytics.completionPercentage}% Complete
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Tasks by Status</h3>
          <div style={{ maxWidth: 300, margin: '0 auto' }}>
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Tasks by Priority</h3>
          <Bar data={priorityChartData} options={barOptions} />
        </div>
      </div>
    </>
  );
};

export default Analytics;
