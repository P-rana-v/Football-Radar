import { useState } from "react";
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import data from "./stddata.json"
import key from "./key.json"
const keys=JSON.parse(JSON.stringify(key))

function App() {
  let max={}
  const iter = ['MP','Starts','Min','90s','Gls','Ast','G-PK','PK','PKatt','CrdY','CrdR','G+A','G+A-PK','xG','npxG','xA','npxG+xA','xG+xA']
  iter.forEach(item => {
    let tempMax=0
    let tempMax2=0
    let arrFlag=0
    Object.keys(data).forEach(item2 => {
      let value=data[item2][0][item]
      if (Array.isArray(value)) {
        arrFlag=1
        if (value[0]>tempMax) {
          tempMax=value[0]
        }
        if (value[1]>tempMax2) {
          tempMax2=value[1]
        }
      }
      else
        value=Number(value)
      if (value>tempMax) {
        tempMax=value
      }
    if (arrFlag===1) {
      max[item]=tempMax
      max[item+"90"]=tempMax2
    }
    else 
      max[item]=tempMax    
  })})
  console.log(max)
  const [name,changeName]= useState('')
  const [chart,changeChart]=useState([])
  let tempData
  let radarData=[]
  let statsSelect=[]
  for (let i=1; i<=8; i++) {
    statsSelect.push(<Inputs key={i}/>)
  }
  const handleChange = (event) => {
    changeName(event.target.value)
  }
  const handleClick = () => {
    tempData=JSON.parse(JSON.stringify(data))[name]
    Object.keys(tempData[0]).forEach (i=> {
      if (Array.isArray(tempData[0][i])) {
        tempData[0][i+"90"]=tempData[0][i][1]
        tempData[0][i]=tempData[0][i][0]
      }
    })
    console.log(tempData[0])
    Object.keys(tempData[0]).forEach( property => {
      if (keys[property]) {
        radarData.push({
          heading: keys[property],
          value: (tempData[0][property]/max[property])*100
        })
      }
    })
    changeChart(radarData)
  }
  return (
    <div>
      <input onChange={handleChange} placeholder="Enter a player name" />
      <button onClick={handleClick} type="submit">submit</button>
      {statsSelect}
      <RadarChart width={730} height={250} data={chart}>
        <PolarGrid />
        <PolarAngleAxis dataKey="heading" />
        <PolarRadiusAxis domain={[0,100]} angle={30} />
        <Radar name={name} dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        <Legend />
      </RadarChart>
    </div>
  );
}

export default App;

const Inputs = () => {
  let options=Object.values(keys).map(item => <option key={item}>{item}</option>)
  return (
    <select>
      {options}
    </select>
  )
}