import { useEffect, useState } from 'react';
import './App.css';

const CurrencyList = () => {
  const [info, setInfo] = useState();
  const [temp, setTemp] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [currencyVal, setCurrencyVal] = useState([]);

  //useEffect: used when when we want to run something when the loaded
  // useEffect(() => {
  //   async function fetchData() {
  //     await sendRequest()
  //   }

  //   fetchData();
  // }, [currencies])


  const sendRequest = async () => {
    /* Fetching Data first */
    const raw = await fetch('https://open.er-api.com/v6/latest/USD')
    const json = await raw.json()
    setInfo(json)
    setTemp(json.rates)
    setCurrencies(Object.keys(temp))
    setCurrencyVal(Object.values(temp))

  }

  const simplify = (value) => {
    if (value >= 10) {
      value = (Math.round((value + Number.EPSILON) * 100) / 100)
    }

    else if (value < 10) {
      value = (Math.round((value + Number.EPSILON) * 1000) / 1000)
    }

    return value

  }

  const simplify30 = (value) => {
    if (value > 10000) {
      value = (Math.round((value + Number.EPSILON) * 0.01) / 0.01)
    }

    else if (value > 1000) {
      value = (Math.round((value + Number.EPSILON) * 0.1) / 0.1)
    }

    else if (value < 1000) {
      value = Math.round(value + Number.EPSILON)
    }


    return value

  }


  function FinishTable() {
    const dataArray = []
    for (let i = 1; i < currencies.length; i++) {
      const currency = currencies[i]
      const tempValue = currencyVal[i]
      dataArray.push(<tr> <td> {currency} </td> <td> {simplify(tempValue)} </td> <td> {(info && `Around ${simplify30(tempValue * 30)} ${currency}`)} </td> </tr>)
    }
    return dataArray
  }

  const Calculator = () => {
    // My note: next time make an option for from currency and to currency in order to convert values from two different currencies, not just USD

    const [currencyName, setCurrencyName] = useState();
    const [amount, setAmount] = useState();
    const [result, setResult] = useState();
    const convert = () => {
      setResult(temp[currencyName] * amount)
    }
    return (
      <form>
        <h1>
          {result && `${amount} USD is: ${simplify(result)} ${currencyName}`}
        </h1>
        <label>
          <p> Currency name (e.g. KRW, AUD ...)</p>
        </label>
        <input type='text' onChange={(event) => {
          event.preventDefault();
          setCurrencyName(event.target.value);
          console.log(currencyName)
        }}>

        </input>
        <label>
          <p>Amount (in usd)</p>
        </label>
        <input type='number' onChange={(event) => {
          event.preventDefault();
          setAmount(event.target.value);
          console.log(amount)
        }}>

        </input>
        <button onClick={(event) => {
          event.preventDefault();
          convert()
        }}>
          convert
        </button>
      </form>
    )
  }



  const Load = () => {
    return (
      <div>
        <br />
        <details>
          <summary>
            Currency Table

          </summary>
          <table>
            <thead>
              <tr>
                <th> Currency </th>
                <th> Equivalence to 1 USD </th>
                <th> A 30 dollar meal would be... </th>
              </tr>
            </thead>
            <tbody>
              {currencies && FinishTable()}
            </tbody>
          </table>
        </details>
        <Calculator></Calculator>
      </div>
    )
  }

  return (
    <div>
      <p> {info && `last updated: ${info.time_last_update_utc}`} </p>
      <button onClick={sendRequest}> Load information </button>
      <Load></Load>
    </div>
  )
}


function App() {
  return (
    <div className="App">
      <CurrencyList></CurrencyList>
    </div>
  );
}

export default App;
