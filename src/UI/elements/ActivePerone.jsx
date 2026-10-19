import { useState, useEffect, Fragment } from 'react';
import '../../styles/activePerone.css'; 

const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
]

const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function ActivePerone() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [visitHistory, setVisitHistory] = useState([])

  useEffect(() =>{
    const STORAGE_KEY = 'userVisitHistory'; 
    const savedHistory = localStorage.getItem(STORAGE_KEY)
    let history = savedHistory ? JSON.parse(savedHistory) : []
    const todayStr = new Date().toISOString().split('T')[0];
    if (!history.includes(todayStr)) {
      history.push(todayStr);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    setVisitHistory(
      history.map(dateStr => new Date(dateStr + 'T00:00:00')).reverse()
    );
  }, [])


  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const activeDaysSet = new Set(
    visitHistory.map(date => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    })
  )
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;
  const cells = Array.from({ length: totalCells }, (_, i) => {
    const day = i - startOffset + 1;
    return (day > 0 && day <= daysInMonth) ? day : null;
  });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(currentYear, newMonth, 1));
  };

  return (
    <div className="activeBlock">
      <div className="calendar-controls">
        <select value={currentMonth} onChange={handleMonthChange}>
          {MONTHS.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="calendar-grid">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="calendar-header">
            {day}
          </div>
        ))}
        {weeks.map((week, weekIndex) => (
          <Fragment key={weekIndex}>
            {week.map((day, dayIndex) => {
              let isActive = false
              if(day){
                const cellMonth = String(currentMonth + 1).padStart(2, '0')
                const cellDay = String(day).padStart(2, '0')
                const cellDateString = `${currentYear}-${cellMonth}-${cellDay}`

                isActive = activeDaysSet.has(cellDateString)
              }
              return(
              <div 
                key={`${weekIndex}-${dayIndex}`} 
                className={`calendar-cell ${!day ? 'empty' : ''} ${isActive ? 'active-day' : '' }`}
              >
                {day || ''}
              </div>)
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}