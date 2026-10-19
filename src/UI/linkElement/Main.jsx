import '../../styles/main.css'
import ActivePerone from '../elements/ActivePerone'
import CurrencyChart from '../elements/CurrencyChart'

export default function Main(){

  return (
    <div className="main">
      <div className="activePerson">
        <ActivePerone/>
      </div>
      <div className="currencyChart">
        <CurrencyChart/>
      </div>
    </div>
  );
}