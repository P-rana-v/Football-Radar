import { useState } from "react"
import nations from "./nations.json"
import code from "./nation_code.json"

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
                    <button type="submit" className="btn search-button mb-2"><i className="fa fa-search" aria-hidden="true"></i></button>
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
    return(
        <div className="search-result">
            <h2>{props.data.name}</h2>
            <img className="logo" alt={nations[props.data.nation.split(" ")[1]]} src={`https://flagcdn.com/h60/${code[nations[props.data.nation.split(" ")[1]]]}.png`}></img>
            <img className="logo" alt={props.data.team} src={`/teams/${props.data.league.replace(/\s/g,'')}/${props.data.team.replace(/\s/g,'')}.png`}></img>
            <img className="logo" alt={props.data.league} src={`/leagues/${props.data.league.replace(/\s/g,'')}.png`}></img>
        </div>
    )
}

export default Search;