import '../styles/screen.css'
import Main from '../UI/linkElement/Main'
import Tasks from '../UI/linkElement/Tasks'
import LinksApi from '../UI/linkElement/LinksApi'

export default function Screen({active}){

  return (
    <div className="screen-content">
      {active === 'Main' && <Main/>}
      {active === 'a' && <Tasks/>}
      {active === 's' && <LinksApi/>}
    </div>
  );
}