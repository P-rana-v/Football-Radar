import { createContext, useContext, useState } from "react"
import { ChangeScreen } from "./App"
import { Chart } from "chart.js/auto"
import { PolarArea } from "react-chartjs-2"
const Percentile= createContext()


function Details() {
    let [statsList,] = useState(["goals","assists","expected goals(xG)","expected assisted goals(xAG)","npxG + xAG","progressive carries","progressive passes","non penalty expected goals(npxG)"])
    let percentile = useState({})
    let [screen,setScreen]=useContext(ChangeScreen)
    let stats=[]
    let chartData={
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor : [
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)'
                ],
                borderColor : [
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)',
                    'rgba(255,255,255,0.2)'
                ],
                hoverBackgroundColor : [
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)'
                ],
                hoverVorderColor : [
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)',
                    'rgba(255,255,255,0.4)'
                ],
                borderWidth : 1
            }
        ]
    }
    const chartOptions = {
        responsive: true,
        scales: {
          r: {
            ticks: {
                stepSize: 25,
                backdropColor: "rgba(0,0,0,0)"
            },
            max:100,
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 14
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false
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
            <div className="details-nav">
                <div className="flex-left">
                    <img className="logo" alt={screen[1].team} src={`/teams/${screen[1].league.replace(/\s/g,'')}/${screen[1].team.replace(/\s/g,'')}.png`}></img>
                    <h2>{screen[1].name}</h2>
                </div>
                <button onClick={handleClick} className="btn mb-2 button back">GO Back</button>
            </div>
            <div className="stats"> 
                {buttons}
                <PolarArea data={chartData} options={chartOptions} />
                {stats}
            </div>
        </Percentile.Provider>
    )
}

function Button(props) {
    let [,setPercentile]=useContext(Percentile)
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
        })
    }
    return (
        <>
            {props.league!=="all" && <button onClick={handleClick} className="btn mb-2 button back">vs {props.position} in {props.league}</button>}
            {props.league==="all" && <button onClick={handleClick} className="btn mb-2 button back">vs all {props.position}</button>}
        </>
    )
}

function Stats(props) {
    let [screen] = useContext(ChangeScreen)
    return(
        <>
            <h3>{`${props.keys} : ${screen[1][props.keys]} : ${props.percentile[props.keys]}`}</h3>
        </>
    )
}


export default Details