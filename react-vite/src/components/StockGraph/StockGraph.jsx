import { useEffect,  useState } from 'react';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, Tooltip, CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import "./StockGraph.css"




ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip);




export default function StockGraph() {
    const stockPrice = useSelector(state => state.stocks.currentStock.updated_price)
    const [ pricesArr, setPricesArr ] = useState(["initial"])
    const currColor = pricesArr[0] > pricesArr[pricesArr.length - 1] ? "rgba(255, 0, 0, 1)" : "rgba(14, 170, 0, 1)"


    useEffect(() => {
      setPricesArr(getPricesArray(stockPrice))
    }, [stockPrice])




    function getDaysArray() {
      const result = [];
      const today = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(today.getFullYear() - 1);
   
      for (let date = new Date(oneYearAgo); date <= today; date.setDate(date.getDate() + 1)) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        result.push(`${year}-${month}-${day}`);
      }
   
      return result;
    }








    function getPricesArray (currPrice) {
      let res = []
      for(let i = 0; i < 365 ; i ++){
          res.unshift(currPrice)
          currPrice = currPrice * (1 + (Math.random() * (0.1 - -0.1) + -0.1))
      }
      return res
    }








    const data = {
      labels: getDaysArray(),
      datasets: [
        {
          label: undefined,
          data: pricesArr,
          borderColor: currColor,
          borderWidth: 1,
          backgroundColor: currColor,
          fill: false,
        },
      ]
    };




    const options = {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
          display: false,
        },
      scales: {
          x: {
            ticks: {
                display: false,
              },
            grid: {
                drawBorder: false,
                display: false,
            },
            border: {
                display: false
            }
          },
          y: {
            ticks: {
                display: false,
              },
            grid: {
              drawBorder: false,
              display: false,
            },
            border: {
                display: false
            }
          },
        },
        pointStyle: false,
        plugins: {
            legend: {
              display: false,
              labels: {
                display: false,
              }


            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw
                        return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    }
                }
            }
        }
    };




    return (
      <div style={{ width: '100%', margin: '0px' }} className="stock-chart-container">
        <Line style={{width: "100%"}}data={data} options={options} />
      </div>
    );
}


