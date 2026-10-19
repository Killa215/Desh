import CurrencyBlock from './CurrencyBlock';
import '../../styles/currencyChart.css'; 


export default function CurrencyChart() {
  return (
    <div className="currency-chart-container">
      <CurrencyBlock currencyCode="usd" currencyLabel="USD / RUB" />
      <CurrencyBlock currencyCode="eur" currencyLabel="EUR / RUB" />
      <CurrencyBlock currencyCode="cny" currencyLabel="CNY / RUB" />
    </div>
  );
}
