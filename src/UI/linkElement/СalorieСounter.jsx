import { useState, useEffect } from 'react';
import '../../styles/calorieСounter.css';

export default function CalorieCounter() {
  // --- 1. ДАННЫЕ ПОЛЬЗОВАТЕЛЯ ---
  const [userInfo, setUserInfo] = useState(() => {
    const savedData = localStorage.getItem('my_info');
    return savedData ? JSON.parse(savedData) : {
      gender: 'male', age: '20', weight: '70',
      height: '170', activity: '1.375', goal: 'maintain'
    };
  });
  const [target, setTarget] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  const [diary, setDiary] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    fat: '',
    carbs: ''
  });
  useEffect(() => {
    localStorage.setItem('my_info', JSON.stringify(userInfo));
    
    const w = Number(userInfo.weight) || 0;
    const h = Number(userInfo.height) || 0;
    const a = Number(userInfo.age) || 0;
    if (w === 0 || h === 0 || a === 0) return;

    const bmr = userInfo.gender === 'male'
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161;

    let targetCalories = bmr * Number(userInfo.activity);
    if (userInfo.goal === 'lose') targetCalories -= targetCalories * 0.2;
    if (userInfo.goal === 'gain') targetCalories += targetCalories * 0.2;
    targetCalories = Math.round(targetCalories);

    setTarget({
      calories: targetCalories,
      protein: Math.round((targetCalories * 0.3) / 4),
      fat: Math.round((targetCalories * 0.3) / 9),
      carbs: Math.round((targetCalories * 0.4) / 4),
    });
  }, [userInfo]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFood = () => {
    if (!formData.name.trim() || !formData.calories) {
      alert('Пожалуйста, введите название и калорийность!');
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: formData.name,
      calories: Number(formData.calories) || 0,
      protein: Number(formData.protein) || 0,
      fat: Number(formData.fat) || 0,
      carbs: Number(formData.carbs) || 0,
    };

    setDiary([...diary, newEntry]);
    
    setFormData({ name: '', calories: '', protein: '', fat: '', carbs: '' });
  };

  const removeFromDiary = (id) => {
    setDiary(diary.filter(item => item.id !== id));
  };

  const totalEaten = diary.reduce((acc, item) => ({
    calories: acc.calories + item.calories,
    protein: acc.protein + item.protein,
    fat: acc.fat + item.fat,
    carbs: acc.carbs + item.carbs,
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

  const remainingCalories = target.calories - totalEaten.calories;

  return (
    <div className="calorie-dashboard">
      <div className="dashboard-header">
        <div className="header-inputs">
          <select name="gender" value={userInfo.gender} onChange={(e) => setUserInfo({...userInfo, gender: e.target.value})}>
            <option value="male">Муж</option>
            <option value="female">Жен</option>
          </select>
          <div className="input-group"><span>Возраст:</span><input type="number" name="age" value={userInfo.age} onChange={(e) => setUserInfo({...userInfo, age: e.target.value})} /></div>
          <div className="input-group"><span>Вес:</span><input type="number" name="weight" value={userInfo.weight} onChange={(e) => setUserInfo({...userInfo, weight: e.target.value})} /></div>
          <div className="input-group"><span>Рост:</span><input type="number" name="height" value={userInfo.height} onChange={(e) => setUserInfo({...userInfo, height: e.target.value})} /></div>
          <select name="activity" value={userInfo.activity} onChange={(e) => setUserInfo({...userInfo, activity: e.target.value})}>
            <option value="1.2">Мин. активность</option>
            <option value="1.375">Небольшая</option>
            <option value="1.55">Средняя</option>
            <option value="1.725">Высокая</option>
          </select>
          <select name="goal" value={userInfo.goal} onChange={(e) => setUserInfo({...userInfo, goal: e.target.value})}>
            <option value="lose">Похудеть</option>
            <option value="maintain">Поддержать</option>
            <option value="gain">Набрать</option>
          </select>
        </div>
        <div className="header-results">
          <span>Цель Б: {target.protein}г</span>
          <span>Ж: {target.fat}г</span>
          <span>У: {target.carbs}г</span>
        </div>
      </div>
      <div className="dashboard-body">
        <div className="panel-left">
          <h3>Добавить прием пищи</h3>
          
          <div className="manual-form">
            <input 
              type="text" 
              name="name" 
              placeholder="Что съели? (например, Яблоко)" 
              value={formData.name} 
              onChange={handleFormChange} 
            />
            
            <div className="form-row">
              <input type="number" name="calories" placeholder="Ккал" value={formData.calories} onChange={handleFormChange} />
              <span>ккал</span>
            </div>
            
            <div className="form-row-bju">
              <input type="number" name="protein" placeholder="Белки" value={formData.protein} onChange={handleFormChange} />
              <input type="number" name="fat" placeholder="Жиры" value={formData.fat} onChange={handleFormChange} />
              <input type="number" name="carbs" placeholder="Углев." value={formData.carbs} onChange={handleFormChange} />
            </div>

            <button className="btn-add-food" onClick={handleAddFood}>
              + Добавить в дневник
            </button>
          </div>
        </div>
        <div className="panel-center">
          <h3>Съедено сегодня</h3>
          {diary.length === 0 ? (
            <p className="empty-diary">Пока ничего не добавлено. Заполните форму слева.</p>
          ) : (
            <ul className="food-diary-list">
              {diary.map((item) => (
                <li key={item.id}>
                  <div className="diary-item-info">
                    <span className="diary-name">{item.name}</span>
                    <span className="diary-macros">
                      Б:{item.protein} Ж:{item.fat} У:{item.carbs}
                    </span>
                  </div>
                  <div className="diary-item-right">
                    <span>{item.calories} ккал</span>
                    <button className="btn-delete-item" onClick={() => removeFromDiary(item.id)}>✖</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel-right">
          <h3 className={remainingCalories < 0 ? "remaining-calories negative" : "remaining-calories"}>
            Ост: {remainingCalories} ккал
          </h3>
          
          <div className="macros-circle">
            <div className="circle-inner">
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Съедено</span>
              <strong>{totalEaten.calories}</strong>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>из {target.calories}</span>
            </div>
          </div>
          
          <div className="stats-text">
            <p>Белки: <span>{totalEaten.protein} / {target.protein} г</span></p>
            <p>Жиры: <span>{totalEaten.fat} / {target.fat} г</span></p>
            <p>Углеводы: <span>{totalEaten.carbs} / {target.carbs} г</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}