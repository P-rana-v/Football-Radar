const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")
const fs = require("fs")

const url="https://fbref.com/en/comps/Big5/stats/players/Big-5-European-Leagues-Stats"
let playerData=[]
async function scrape() {
    try {
        const {data}=await axios.get(url)
        const $=cheerio.load(data)
        const table= $("#stats_standard tbody tr")
        table.each((index,element)=>{
            const elements=$(element)
            let id=elements.children("th").text()
            if(!id.startsWith("RkPlayer")) {
                playerData.push({
                    id:id,
                    name:elements.children("td:nth-of-type(1)").text(),
                    nation:elements.children("td:nth-of-type(2)").text(),
                    position:elements.children("td:nth-of-type(3)").text(),
                    team:elements.children("td:nth-of-type(4)").text(),
                    league:elements.children("td:nth-of-type(5)").text(),
                    age:elements.children("td:nth-of-type(6)").text(),
                    born:elements.children("td:nth-of-type(7)").text(),
                    MP:elements.children("td:nth-of-type(8)").text(),
                    starts:elements.children("td:nth-of-type(9)").text(),
                    mins:elements.children("td:nth-of-type(10)").text(),
                    _90s:elements.children("td:nth-of-type(11)").text(),
                    goals:elements.children("td:nth-of-type(12)").text(),
                    assists:elements.children("td:nth-of-type(13)").text(),
                    GplusA:elements.children("td:nth-of-type(14)").text(),
                    GminusPK:elements.children("td:nth-of-type(15)").text(),
                    PK:elements.children("td:nth-of-type(16)").text(),
                    PKatt:elements.children("td:nth-of-type(17)").text(),
                    yellow:elements.children("td:nth-of-type(18)").text(),
                    red:elements.children("td:nth-of-type(19)").text(),
                    xG:elements.children("td:nth-of-type(20)").text(),
                    npxG:elements.children("td:nth-of-type(21)").text(),
                    xAG:elements.children("td:nth-of-type(22)").text(),
                    npxGplusxAG:elements.children("td:nth-of-type(23)").text(),
                    prgC:elements.children("td:nth-of-type(24)").text(),
                    prgP:elements.children("td:nth-of-type(25)").text(),
                    prgR:elements.children("td:nth-of-type(26)").text(),
                    g90:elements.children("td:nth-of-type(27)").text(),
                    a90:elements.children("td:nth-of-type(28)").text(),
                })
            }   
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

scrape()

let app = express()

app.get('/players',(req,res)=>{
    let file=fs.readFileSync('./data.json')
    let fileData=JSON.parse(file)
    let finalData
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

app.listen(5000,()=>{
    console.log("Server listening in port 5000");
})

