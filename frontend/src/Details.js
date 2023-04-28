import { createContext, useContext, useState } from "react"
import { ChangeScreen } from "./App"
// eslint-disable-next-line no-unused-vars
import { Chart } from "chart.js/auto"
import { PolarArea } from "react-chartjs-2"
const Percentile= createContext()
const Comparison= createContext()


function Details() {
    let [statsList,] = useState(["matches played","goals + assists","goals","yellow cards","red cards","assists","expected goals(xG)","expected assisted goals(xAG)","npxG + xAG","progressive carries","progressive passes","non penalty expected goals(npxG)"])
    let [screen,setScreen]=useContext(ChangeScreen)
    let stats=[]
    let compText=useState(`vs all ${screen[1].position.substring(0,2)} in ${screen[1].league.replace(/\s/g,'')}`)
    let percentile = useState(screen[2])
    let chartData={
        labels: [],
        title: "aa",
        datasets: [
            {
                data: [],
                backgroundColor : [
                    'rgba(38,132,222,0.7)',
                    'rgba(255,255,255,0.7)',
                ],
                hoverBackgroundColor : [
                    'rgba(38,132,222,1)',
                    'rgba(255,255,255,1)',
                ],
                borderWidth : 1,
                borderColor: 'rgba(255,255,255,1)',
                borderAlign: "inner",
            }
        ]
    }
    const chartOptions = {
        responsive: true,
        scales: {
          r: {
            backgroundColor: "rgba(20,20,20,1)",
            ticks: {
                stepSize: 25,
                backdropColor: "rgba(0,0,0,0)",
                color: "rgba(255,255,255,1)",
                display: false
            },
            max:100,
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 14,
              },
              color: "rgba(255,255,255,1)"
            },
            angleLines: {
                display: true,
                color: 'rgba(255,255,255,1)',
            },
            grid: {
                color: 'rgba(255,255,255,1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            align: "center"
          }
        }
    }
    for (let keys in screen[1]) {
        stats.push(<Stats percentile={percentile[0]} key={keys} keys={keys}/>)
        if (statsList.includes(keys)){
            chartData.labels.push(keys)
            chartData.datasets[0].data.push(percentile[0][keys])
        }
    }
    let positions = screen[1].position.split(',')
    let buttons=[]
    positions.forEach(position=> {
        buttons.push(<Button data={screen[1]} position={position} league={screen[1].league.replace(/\s/g,'')} key={`${position}${screen[1].league.replace(/\s/g,'')}`} />)
        buttons.push(<Button data={screen[1]} position={position} league={"all"} key={`${position}all`} />)
    })
    const handleClick = () => {
        setScreen([0,{}])
    }
    return (
        <Percentile.Provider value={percentile}>
            <Comparison.Provider value={compText}>
                <div className="details-nav">
                    <div className="flex-left">
                        <img className="logo" alt={screen[1].team} src={`/teams/${screen[1].league.replace(/\s/g,'')}/${screen[1].team.replace(/\s/g,'')}.png`}></img>
                        <h2>{screen[1].name}</h2>
                    </div>
                    <button onClick={handleClick} className="btn mb-2 button back">GO Back</button>
                </div>
                <div className="stats"> 
                    <div className="button-div">
                        {buttons}
                    </div>
                    <div className="main-section">
                        <div className="section chart">
                            <h6>{compText}</h6>
                            <PolarArea data={chartData} options={chartOptions} />
                        </div>
                        <div className="section">
                            <table>
                                <tr className="table-row">
                                    <th>Stat</th>
                                    <th>Value</th>
                                    <th>Per 90</th>
                                    <th>Percentile</th>
                                </tr>
                                {stats}
                            </table>
                            
                        </div>
                    </div>
                </div>
            </Comparison.Provider>
        </Percentile.Provider>
    )
}

function Button(props) {
    let [,setPercentile]=useContext(Percentile)
    let [,setCompText]=useContext(Comparison)
    let tempPercentile={}
    const handleClick = () => {
        let url
        if (props.league==="all") {
            url=`./data/overall/${props.position}.json`
        }
        else {
            url=`./data/leagues/${props.league}/${props.position}.json`
        }
        fetch(url)
        .then(item => item.json())
        .then(item => {
            Object.keys(item).forEach(stat=> {
                let length=item[stat].length
                let index=item[stat].indexOf(props.data[stat])
                console.log(item)
                tempPercentile[stat]=(index/length)*100
            })
            setPercentile(tempPercentile)
            if(props.league==='all') {
                setCompText(`vs all ${props.position}`)
            }
            else {
                setCompText(`vs all ${props.position} in ${props.league}`)
            }
        })
    }
    return (
        <>
            {props.league!=="all" && 
                <button className="button btn back" onClick={handleClick}>
                    vs {props.position} in {props.league}
                </button>
            }
            {props.league==="all" && 
                <button className="button btn back" onClick={handleClick}>
                    vs all {props.position}
                </button>
            }
        </>
    )
}

function Stats(props) {
    let cells
    let [screen] = useContext(ChangeScreen)
    let value=screen[1][props.keys]
    let per90=Number(value)/Number(screen[1]["90s played"])
    if (!Number.isNaN(Number(value))) {
        value=Number(value)
        cells = <>
            <td>{Math.round((value + Number.EPSILON)*1000)/1000}</td>
            <td>{Math.round((per90 + Number.EPSILON)*1000)/1000}</td>
        </>
    }
    else {
        cells = <>
            <td>{value}</td>
            <td></td>
        </>
    }
    let percentile=Number(props.percentile[props.keys])
    return(
        <tr className="table-row">
            <td>{props.keys}</td>
            {cells}
            {props.percentile[props.keys]!== undefined &&
                <td>
                    <div className="percentile-cell">
                        {Math.round((percentile + Number.EPSILON)*1000)/1000}
                        <div className="percentile"><div style={{"width": `${percentile}%`,"background-color": "rgba(38,132,222,0.7)"}}></div></div>
                    </div>
                </td>}
            {props.percentile[props.keys]=== undefined && <td></td>}
        </tr>
    )
}


export default Details