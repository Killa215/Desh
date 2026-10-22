import '../styles/screen.css'
import Main from '../UI/linkElement/Main'
import Tasks from '../UI/linkElement/Tasks'
import СalorieСounter from '../UI/linkElement/СalorieСounter'


export default function Screen({active}){

  return (
    <div className="screen-content">
      {active === 'Main' && <Main/>}
      {active === 'Tasck' && <Tasks/>}
      {active === 'СalorieСounter' && <СalorieСounter/>}
    </div>
  );
}