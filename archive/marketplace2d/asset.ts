import { readFileSync } from 'node:fs'
const asset = readFileSync('./asset.json','utf-8')
console.table(Object.entries(asset))
