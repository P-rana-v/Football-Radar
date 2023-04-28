import { useContext, useState } from "react"
import nations from "./nations.json"
import code from "./nation_code.json"
import { ChangeScreen } from "./App"

function Search() {    
    let searchValue=""
    let [results,setResults]=useState([])
    const handleSubmit = (event) => {
        event.preventDefault()
        fetch(`/players?name=${searchValue}`)
        .then(item => item.json())
        .then(item=> {
            let temp=item.map((items,index)=> {
                return <Results data={items} key={index} />
            })
            setResults(temp)
        })
    }
    const handleChange = (event) => {
        searchValue=event.target.value
    }
    return(
        <>
        <div className="search">
            <div className="sidebar">
    
            </div>
            <nav>
                <form onSubmit={handleSubmit} className="nav-form">
                    <input className="search-bar" type="text" onChange={handleChange}></input>
                    <button type="submit" className="btn button mb-2"><i className="fa fa-search" aria-hidden="true"></i></button>
                </form>
            </nav>
        </div>
        <div className="results">
        {results}
    </div>
    </>
    )
}

function Results(props) {
    let [,setScreen]=useContext(ChangeScreen)
    const handleClick = (event) => {
        let tempPercentile={}
        fetch(`./data/leagues/${props.data.league.replace(/\s/g,'')}/${props.data.position.substring(0,2)}.json`)
        .then(item => item.json())
        .then(item => {
            Object.keys(item).forEach(stat=> {
                let length=item[stat].length
                let index=item[stat].indexOf(props.data[stat])
                console.log(item)
                tempPercentile[stat]=(index/length)*100
            })
            setScreen([1,props.data,tempPercentile])
        })
    }
    return(
        <div className="search-result" onClick={handleClick}>
            <div className="search-heading">
                <div>
                    <img className="logo" alt={props.data.team} src={`/teams/${props.data.league.replace(/\s/g,'')}/${props.data.team.replace(/\s/g,'')}.png`}></img>
                    <h2>{props.data.name}</h2>
                </div>
                <div>
                    <img className="logo" alt={props.data.league} src={`/leagues/${props.data.league.replace(/\s/g,'')}.png`}></img>
                    <img className="logo flag" alt={nations[props.data.nation.split(" ")[1]]} src={`https://flagcdn.com/h60/${code[nations[props.data.nation.split(" ")[1]]]}.png`}></img>
                </div>
            </div>
            <h5>{props.data.team} &emsp; Position: {props.data.position} &emsp; Age: {props.data.age.slice(0,2)}</h5>
        </div>
    )
}

export default Search;