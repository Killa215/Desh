import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import '../../styles/CurrencyBlock.css'; 

const PERIODS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
};

export default function CurrencyBlock({ currencyCode, currencyLabel }) {
  const [period, setPeriod] = useState(PERIODS.WEEK);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDateRange = (selectedPeriod) => {
    const end = new Date();
    const start = new Date();
    switch (selectedPeriod) {
      case PERIODS.DAY:   start.setDate(end.getDate() - 1); break;
      case PERIODS.WEEK:  start.setDate(end.getDate() - 7); break;
      case PERIODS.MONTH: start.setMonth(end.getMonth() - 1); break;
      default: break;
    }
    const formatDate = (date) => date.toISOString().split('T')[0];
    return { startDate: formatDate(start), endDate: formatDate(end) };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { startDate, endDate } = getDateRange(period);

      const dates = [];
      let current = new Date(startDate);
      const end = new Date(endDate);
      while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
      }

      try {
        const promises = dates.map((dateStr) =>
          axios
            .get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${dateStr}/v1/currencies/${currencyCode}.json`)
            .then((res) => ({ date: dateStr, rate: res.data[currencyCode]?.rub }))
            .catch(() => null)
        );
        const results = await Promise.all(promises);
        setChartData(results.filter((item) => item !== null && item.rate));
      } catch (error) {
        console.error(error);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period, currencyCode]);

  let changePercent = null;
  if (chartData.length >= 2) {
    const first = chartData[0].rate;
    const last = chartData[chartData.length - 1].rate;
    changePercent = ((last - first) / first) * 100;
  }

  return (
    <div className="currency-block">
      <div className="chart-header">
        <div className="header-title">
          <h3>{currencyLabel}</h3>
          {changePercent !== null && (
            <span className={`change-badge ${changePercent >= 0 ? 'up' : 'down'}`}>
              {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%
            </span>
          )}
        </div>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value={PERIODS.DAY}>За день</option>
          <option value={PERIODS.WEEK}>За неделю</option>
          <option value={PERIODS.MONTH}>За месяц</option>
        </select>
      </div>

      <div className="chart-body">
        {loading ? (
          <div className="loading-indicator">Загрузка...</div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#f4f1de', fontSize: 11 }}
                tickFormatter={(tick) => new Date(tick).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#f4f1de', fontSize: 11 }}
                tickFormatter={(value) => value.toFixed(2)}
                width={45}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <Line type="monotone" dataKey="rate" stroke="#73ac7b" strokeWidth={2} dot={false} name="Курс" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="no-data">Нет данных</div>
        )}
      </div>
    </div>
  );
}