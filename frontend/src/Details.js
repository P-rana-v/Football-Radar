import { useContext } from "react"
import { ChangeScreen } from "./App"



function Details() {
    let [screen,setScreen]=useContext(ChangeScreen)
    let stats=[]
    for (let keys in screen[1]) {
        stats.push(<Stats key={keys} keys={keys}/>)
    }
    const handleClick = () => {
        setScreen([0,{}])
    }
    return (
        <>
            <div className="details-nav">
                <div className="flex-left">
                    <img className="logo" alt={screen[1].team} src={`/teams/${screen[1].league.replace(/\s/g,'')}/${screen[1].team.replace(/\s/g,'')}.png`}></img>
                    <h2>{screen[1].name}</h2>
                </div>
                <button onClick={handleClick} className="btn mb-2 button back">GO Back</button>
            </div>
            <div className="stats">
                {stats}
            </div>
        </>
    )
}

function Stats(props) {
    let [screen] = useContext(ChangeScreen)
    return(
        <h3>{`${props.keys} : ${screen[1][props.keys]}`}</h3>
    )
}


export default Details