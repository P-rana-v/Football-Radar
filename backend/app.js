const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

const url="https://fbref.com/en/comps/Big5/stats/players/Big-5-European-Leagues-Stats"
let playerData=[]
let format={
    "matches played":[],
    "matches started":[],
    "minutes played":[],
    "90s played":[],
    "goals":[],
    "assists":[],
    "goals + assists":[],
    "non penalty goals":[],
    "penalty goals":[],
    "penalties attempted":[],
    "yellow cards":[],
    "red cards":[],
    "expected goals(xG)":[],
    "non penalty expected goals(npxG)":[],
    "expected assisted goals(xAG)":[],
    "npxG + xAG":[],
    "progressive carries":[],
    "progressive passes":[],
    "progressive passes recieved":[],
}
let percentile = {
    leagues : {
        esLaLiga : {
            FW : JSON.parse(JSON.stringify(format)),
            MF : JSON.parse(JSON.stringify(format)),
            DF : JSON.parse(JSON.stringify(format)),
            GK : JSON.parse(JSON.stringify(format)),
        },
        deBundesliga : {
            FW : JSON.parse(JSON.stringify(format)),
            MF : JSON.parse(JSON.stringify(format)),
            DF : JSON.parse(JSON.stringify(format)),
            GK : JSON.parse(JSON.stringify(format)),
        },
        engPremierLeague : {
            FW : JSON.parse(JSON.stringify(format)),
            MF : JSON.parse(JSON.stringify(format)),
            DF : JSON.parse(JSON.stringify(format)),
            GK : JSON.parse(JSON.stringify(format)),
        },
        frLigue1 : {
            FW : JSON.parse(JSON.stringify(format)),
            MF : JSON.parse(JSON.stringify(format)),
            DF : JSON.parse(JSON.stringify(format)),
            GK : JSON.parse(JSON.stringify(format)),
        },
        itSerieA : {
            FW : JSON.parse(JSON.stringify(format)),
            MF : JSON.parse(JSON.stringify(format)),
            DF : JSON.parse(JSON.stringify(format)),
            GK : JSON.parse(JSON.stringify(format)),
        }
    },
    overall : {
        FW : JSON.parse(JSON.stringify(format)),
        MF : JSON.parse(JSON.stringify(format)),
        DF : JSON.parse(JSON.stringify(format)),
        GK : JSON.parse(JSON.stringify(format)),
    }
}
async function scrape() {
    try {
        const {data}=await axios.get(url)
        const $=cheerio.load(data)
        const table= $("#stats_standard tbody tr")
        table.each((index,element)=>{
            const elements=$(element)
            let id=elements.children("th").text()
            if(!id.startsWith("RkPlayer")) {
                let extractedData = {
                    "id":id,
                    "name":elements.children("td:nth-of-type(1)").text(),
                    "nation":elements.children("td:nth-of-type(2)").text(),
                    "position":elements.children("td:nth-of-type(3)").text(),
                    "team":elements.children("td:nth-of-type(4)").text(),
                    "league":elements.children("td:nth-of-type(5)").text(),
                    "age":elements.children("td:nth-of-type(6)").text(),
                    "date of birth":elements.children("td:nth-of-type(7)").text(),
                    "matches played":elements.children("td:nth-of-type(8)").text(),
                    "matches started":elements.children("td:nth-of-type(9)").text(),
                    "minutes played":elements.children("td:nth-of-type(10)").text().replace(/,/g, ''),
                    "90s played":elements.children("td:nth-of-type(11)").text(),
                    "goals":elements.children("td:nth-of-type(12)").text(),
                    "assists":elements.children("td:nth-of-type(13)").text(),
                    "goals + assists":elements.children("td:nth-of-type(14)").text(),
                    "non penalty goals":elements.children("td:nth-of-type(15)").text(),
                    "penalty goals":elements.children("td:nth-of-type(16)").text(),
                    "penalties attempted":elements.children("td:nth-of-type(17)").text(),
                    "yellow cards":elements.children("td:nth-of-type(18)").text(),
                    "red cards":elements.children("td:nth-of-type(19)").text(),
                    "expected goals(xG)":elements.children("td:nth-of-type(20)").text(),
                    "non penalty expected goals(npxG)":elements.children("td:nth-of-type(21)").text(),
                    "expected assisted goals(xAG)":elements.children("td:nth-of-type(22)").text(),
                    "npxG + xAG":elements.children("td:nth-of-type(23)").text(),
                    "progressive carries":elements.children("td:nth-of-type(24)").text(),
                    "progressive passes":elements.children("td:nth-of-type(25)").text(),
                    "progressive passes recieved":elements.children("td:nth-of-type(26)").text(),
                }
                let positions = extractedData.position.split(',')
                playerData.push(extractedData)
                positions.forEach(position => {
                    Object.keys(format).forEach(stat => {
                        percentile.leagues[extractedData.league.replace(/\s/g,'')][position][stat].push(extractedData[stat])
                        percentile.overall[position][stat].push(extractedData[stat])
                    })
                })
            }   
        })
        let positions=["FW","MF","DF","GK"]
        positions.forEach(position => {
            Object.keys(format).forEach(stat=> {
                percentile.overall[position][stat].sort((a,b)=>a-b)
                Object.keys(percentile.leagues).forEach(league => {
                    percentile.leagues[league][position][stat].sort((a,b)=>a-b)
                })
            })
            Object.keys(percentile.leagues).forEach(league=> {
                let temp=percentile.leagues[league][position]
                fs.writeFileSync(`./public/data/leagues/${league}/${position}.json`,JSON.stringify(temp))
            })
            let temp=percentile.overall[position]
            fs.writeFileSync(`./public/data/overall/${position}.json`,JSON.stringify(temp))
        })
        fs.writeFile('./data.json',JSON.stringify(playerData),err=>{
            console.log(err)
        })
        console.log("success")      
    }
    catch (err) {
        console.log(err)
    }
}

let app = express()

app.use(express.static('public'))

app.get('/players',(req,res)=>{
    fs.readFile('./data.json','utf-8',(err,data)=>{
        let finalData
        let fileData=JSON.parse(data)
        if(req.query.name) {
            finalData=fileData.filter((item)=> {
                if (item.name.toUpperCase().includes(req.query.name.toUpperCase())) {
                    return true
                }
                else {
                    return false
                }
            })
        }
        else {
            finalData=fileData
        }
        res.json(finalData)
    })
})

app.listen(5000,()=>{
    console.log("Server listening in port 5000");
})

scrape()