#!/usr/bin/env node

const csv = require("csv-parser")
const fs = require("fs")
const { resolve } = require("path")
const { readdir } = require("fs").promises

//get all files in directory
async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true })
    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name)
        return dirent.isDirectory() ? getFiles(res) : res
    }))
    return Array.prototype.concat(...files)
}

//really simple argument parser
const argv = (key) => {
    if (process.argv.includes(`--${key}`)) return true
    const value = process.argv.find(element => element.startsWith(`--${key}=`))
    if (!value) return null
    return value.replace(`--${key}=`, "")
}

//mappings map
const fieldsMap = []
const methodsMap = []
const paramsMap = []

//deobfuscate whole directory
const start = () => {
    console.log("Started Deobfuscating. This may take a while...")
    getFiles(argv("dir")).then(files => {
        files.forEach(file => {
            fs.readFile(file, "utf8", (err, data) => {
                if (err) throw err
                fs.writeFile(file, deobfuscate(data), "utf-8", (err) => {
                    if (err) throw err
                    console.log(`Deobfuscated ${file}`)
                })
            })
        })
    })
}

//load mappings
fs.createReadStream(`mappings/${argv("version")}/fields.csv`)
    .pipe(csv())
    .on("data", (data) => { fieldsMap.push(data) }) //fields
    .on("end", () => {
        fs.createReadStream(`mappings/${argv("version")}/methods.csv`)
            .pipe(csv())
            .on("data", (data) => { methodsMap.push(data) }) //methods
            .on("end", () => {
                fs.createReadStream(`mappings/${argv("version")}/params.csv`)
                    .pipe(csv())
                    .on("data", (data) => { paramsMap.push(data) }) //params
                    .on("end", () => {
                        console.log("Loaded mappings")
                        start() //once everything is loaded, start deobfuscating
                    })
            })
    })

//deobfuscate text from searge to mcp 
const deobfuscate = (data) => {
    fieldsMap.forEach(field => data = data.replace(new RegExp(field.searge, "g"), field.name))
    methodsMap.forEach(method => data = data.replace(new RegExp(method.searge, "g"), method.name))
    paramsMap.forEach(param => data = data.replace(new RegExp(param.param, "g"), param.name))

    return data
}