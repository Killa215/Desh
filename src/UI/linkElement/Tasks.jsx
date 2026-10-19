import { useState, useEffect } from 'react';
import '../../styles/tasks.css';

export default function Tascks() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('my_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  const [draftTask, setDraftTask] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('my_tasks', JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    const taskToEdit = tasks.find(t => t.id === selectedTaskId);
    setDraftTask(taskToEdit ? { ...taskToEdit } : null);
  }, [selectedTaskId, tasks]);


  const handleAddTask = () => {
    const newTask = {
      id: Date.now().toString(),
      title: 'Новая задача',
      description: '',
      deadline: '',
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setSelectedTaskId(newTask.id);
  };

  const toggleComplete = (e, id) => {
    e.stopPropagation();
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDraftChange = (field, value) => {
    setDraftTask(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!draftTask) return;
    setTasks(tasks.map(task => 
      task.id === draftTask.id ? draftTask : task
    ));
  };

  const handleCancel = () => {
    const originalTask = tasks.find(t => t.id === selectedTaskId);
    if (originalTask) {
      setDraftTask({ ...originalTask });
    }
  };

  const deleteTask = (id) => {
    if (window.confirm('Удалить задачу?')) {
      setTasks(tasks.filter(task => task.id !== id));
      if (selectedTaskId === id) setSelectedTaskId(null);
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tascks-container">
      
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <div className="tasks-sidebar">
        <div className="sidebar-header">
          <button className="btn-icon" onClick={handleAddTask} title="Добавить задачу">➕</button>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Поиск..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <ul className="tasks-list">
          {filteredTasks.length === 0 ? (
            <p style={{ padding: '10px', color: '#64748b', fontSize: '14px' }}>Задач нет</p>
          ) : (
            filteredTasks.map(task => (
              <li 
                key={task.id} 
                className={`task-item ${task.id === selectedTaskId ? 'active' : ''}`}
                onClick={() => setSelectedTaskId(task.id)}
              >
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={(e) => toggleComplete(e, task.id)} 
                />
                <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                  {task.title || 'Без названия'}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* ПРАВАЯ ПАНЕЛЬ */}
      <div className="task-details">
        {draftTask ? (
          <>
            <div className="details-header">
              <h2 style={{ margin: 0, fontSize: '18px',background: 'none' }}>Редактирование</h2>
              <button className="btn-delete" onClick={() => deleteTask(draftTask.id)}>
                Удалить
              </button>
            </div>

            <div className="form-group">
              <label>Название</label>
              <input 
                type="text" 
                className="details-input"
                value={draftTask.title}
                onChange={(e) => handleDraftChange('title', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Срок выполнения</label>
              <input 
                type="date" 
                className="details-input"
                value={draftTask.deadline}
                onChange={(e) => handleDraftChange('deadline', e.target.value)}
              />
            </div>

            <div className="form-group" style={{ flexGrow: 1 }}>
              <label>Описание / Текст задачи</label>
              <textarea 
                className="details-textarea"
                value={draftTask.description}
                style={{resize: 'none', height: '100%'}}
                onChange={(e) => handleDraftChange('description', e.target.value)}
                placeholder="Введите подробности..."
              />
            </div>
            <div className="details-footer">
              <button className="btn-cancel" onClick={handleCancel}>
                Отмена
              </button>
              <button className="btn-save" onClick={handleSave}>
                Сохранить
              </button>
            </div>
          </>
        ) : (
          <div className="no-task-selected">
            Выберите задачу из списка слева или создайте новую
          </div>
        )}
      </div>

    </div>
  );
}