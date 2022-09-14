import * as core from '@actions/core'
import {Inputs} from './constants'
import * as fs from 'fs'
import dataFormat from 'dateformat'
import archiver from 'archiver'

async function run(): Promise<void> {
    try {

        const fileName = core.getInput(Inputs.FILE_NAME, {required: true})        
        const version = core.getInput(Inputs.VERSION, {required: false})
        const ignorefiles = core.getInput(Inputs.IGNORE_FILES, {required: false})
        const gitSha = core.getInput(Inputs.GIT_SHA, {required: false})

        // const versionFilePath = process.env['GITHUB_WORKSPACE'] + "/version.json"
        // try {
            // if (fs.existsSync(versionFilePath)) {
                // console.log("found version.json file.")
            // }
        // } catch(err) {
            // console.error("Not Found version.json")
        // }
        // console.log(`versionFilePath : ${versionFilePath}`)
        // const data = fs.readFileSync(versionFilePath)
        // let versionJson = JSON.parse(data.toString())        
        // const version  = versionJson.major + "." + versionJson.minor + "." + versionJson.patch

        const date = dataFormat(new Date(), "yyyymmdd")        
        console.log(`fileName : ${fileName}`)
        console.log(`version : ${version}`)
        console.log(`gitSha : ${gitSha}`)
        console.log(`ignorefilesJson : ${ignorefiles}`)
        console.log(`date : ${date}`)

        const packageName = fileName + "_" + version + "_" + gitSha.slice(0, 6) + "_" + date
        console.log(`packageName : ${packageName}`)
    
        // const archiveIgnorePath = process.env['GITHUB_WORKSPACE'] + '/.archiveignore'
        // try {
            // if (fs.existsSync(archiveIgnorePath)) {
                // console.log("found archiveignore file.")
            // }
        // } catch(err) {
            // console.error("Not Found .archiveignore")
        // }

        // const lines: string[] = require('fs').readFileSync(archiveIgnorePath, 'utf-8').split('\n').filter(Boolean);
        // lines.push(packageName + ".zip")
        // console.log(`.achiveignore :  ${lines}`)        
    


        const packagePath = process.env['GITHUB_WORKSPACE']
        // if (!fs.existsSync(packagePath)) {            
        //     fs.mkdirSync(packagePath, {recursive: true})
        // }
        const filepath = packagePath + "/" + packageName + "-release.zip"

        var ignorefileArray: string[] = ignorefiles.split(",")
        ignorefileArray.push(filepath)

        const output = fs.createWriteStream(filepath)
        console.log(`filepath :  ${filepath}`)   
        const archive = archiver('zip', {
            zlib: {level : 9 }
        })
        archive.pipe(output);
        archive.glob('**/*', {
            cwd: process.env['GITHUB_WORKSPACE'],
            ignore: ignorefileArray,
            // dot: true,
        });
        archive.finalize();

        core.setOutput('packageName', packageName);
        core.setOutput('packagePath', packagePath);
    } catch (err) {
        core.setFailed((err as Error).message)
    }
}

run()