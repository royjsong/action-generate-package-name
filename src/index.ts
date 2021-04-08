import * as core from '@actions/core'
import {getInputs} from './input-helper'
import * as fs from 'fs'
import dataFormat from 'dateformat'
import archiver from 'archiver'

async function run(): Promise<void> {
    try {
        const inputs = getInputs()        
        const versionFilePath = process.env['GITHUB_WORKSPACE'] + "/version.json"
        try {
            if (fs.existsSync(versionFilePath)) {
                console.log("found version.json file.")
            }
        } catch(err) {
            console.error("Not Found version.json")
        }
        console.log(`versionFilePath : ${versionFilePath}`)
        const data = fs.readFileSync(versionFilePath)
        let versionJson = JSON.parse(data.toString())        
        const version  = versionJson.major + "." + versionJson.minor + "." + versionJson.patch
        const date = dataFormat(new Date(), "yyyymmdd")
        console.log(`version : ${version}`)
        console.log(`fileName : ${inputs.fileName}`)
        console.log(`gitSha : ${inputs.gitSha}`)
        console.log(`date : ${date}`)

        const packageName = inputs.fileName + "_" + version + "_" + inputs.gitSha.slice(0, 6) + "_" + date
        core.setOutput("packageName", packageName);

        const archiveIgnorePath = process.env['GITHUB_WORKSPACE'] + '/.archiveignore'
        try {
            if (fs.existsSync(archiveIgnorePath)) {
                console.log("found archiveignore file.")
            }
        } catch(err) {
            console.error("Not Found .archiveignore")
        }

        const lines: string[] = require('fs').readFileSync(archiveIgnorePath, 'utf-8').split('\n').filter(Boolean);
        lines.push(packageName + ".zip")
        console.log(`.achiveignore :  ${lines}`)        
    
        const output = fs.createWriteStream(process.env['GITHUB_WORKSPACE'] + '/' + packageName + "-release.zip")
        const archive = archiver('zip', {
            zlib: {level : 9 }
        })
        archive.pipe(output);
        archive.glob('**/*', {
            cwd: process.env['GITHUB_WORKSPACE'],
            ignore: lines,
            dot: true,
        });
        archive.finalize();
    } catch (err) {
        core.setFailed(err.message)
    }
}

run()