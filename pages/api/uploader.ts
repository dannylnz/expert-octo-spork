import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs/promises'
import { exec } from 'child_process';
import { rejects } from 'assert';

export const config = {
    api:{
        bodyParser:false
    }
}
let originalFilename : string | null = ""
const options: formidable.Options = {}
const executeIngest = (pathToIngest:string|null) => {
    
    exec(`tsx -r dotenv/config scripts/ingest-data.ts /docs/filesFromWeb/${pathToIngest}`, (err, output) => {
        // once the command has completed, the callback function is called
        if (err) {
            // log and return if we encounter an error
            console.error("could not execute command: ", err)
            return
        }
        // log the output received from the command
        console.log("Output: \n", output)
    })
}

const readFile = (req:NextApiRequest, saveLocally?:boolean)
:Promise<{fields:formidable.Fields, files:formidable.Files}> => {
   
    if(saveLocally){
        options.uploadDir = path.join(process.cwd(), "/docs/filesFromWeb")
        options.filename = (name, ext,path,form) => {
            originalFilename ="_" +path.originalFilename;
            return "_" +path.originalFilename;
        }
    }
    const form = formidable(options);
    return new Promise((resolve,reject) => {
        form.parse(req,(err,fields,files)=>{
            if(err){
                return reject(err)
            }
            resolve({fields,files})
        })
    })
}

const handler:NextApiHandler = async (req, res) => {
   try {
        await fs.readdir(path.join(process.cwd()+"/docs","/filesFromWeb"))
   } catch (error) {
        await fs.mkdir(path.join(process.cwd()+"/docs","/filesFromWeb"))
   }
   await readFile(req,true);
   res.json({done:"ok", originalFilename:originalFilename})
   executeIngest(originalFilename)
}

export default handler;