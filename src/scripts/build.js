/**
 * build scripts
 * 
 * for building unbundled assets
 */

const {exec}  =require('child_process');
const fs = require('fs');
const webpackConfig = require('./../../webpack.config.js');

/**
 * Allowed arguments
 * 
 * @type {object}
 */
let ALLOWED_ARGUMENTS = {
    'asset' : true
}

/**
 * avialabel command help object
 * 
 * 
 */
const AVILABLE_COMMANDS = {
    'asset' : 'unbundle e-market.css to assets'
}

/**
 * get all argument passed to cli
 * 
 * @return {object}
 */
let argsPrepartion = () => {
    let argv = process.argv.slice(2);
    let args = {};
    if(argv.length) {
        argv.forEach((arg) => {
            if(arg.match(/=/)) {
                arg = arg.split('=');
                args[arg[0]]=arg[1]
            } else {
                args[arg] = 'true';
            }
        })
    }

    return args;
}

/**
 * check if provided arguments is allowed arguments 
 * 
 * 
 * @param {object} $original 
 * @param {object} $provided 
 * @return {boolean}
 */
function checkIfAllowedArg($original, $provided) {
    try{
        for(let arg in $provided) {
            if(!$original[arg]) {
                throw new Error('Unkown Argument '+arg)
            }
        }
    } catch(e) {
        console.log(e)
        console.log('Avialabes commands :')
        console.table(AVILABLE_COMMANDS)
        return false;
    }
    return true;
}


/**
 * run command if argument equal condition
 * 
 * @param {string} $arg 
 * @param {string} $condition 
 * @param {stirng} $command 
 */
function runCommandIfExist($arg, $condition=null, $command) {
    let args = argsPrepartion();
    if(Object.keys(args).length === 0) {

        console.log('Webpack start bundling')
        exec('webpack',(error,result) => {
            if(error) {
                console.log(error)
            }
            console.log(result)
        });
        return;
    }
    if(!checkIfAllowedArg(ALLOWED_ARGUMENTS,args)){
        return;
    }
    try{
        let arg = args[$arg] ;
        if(arg) {
            if(arg === $condition) {
                if(typeof $command !== 'function') {
                    throw new TypeError('$command must be function');
                }
                $command();
            }
        }else {
            throw ('Unkown argument provided '+$arg);
        }
    }catch(e) {
        console.log(e)
    }
    
}

/**
 * removing bootstrap and fontawesome before bundling
 * 
 * 
 */
function removeChunkAssets() {
    let entryFile = fs.readFileSync(webpackConfig.entry,'UTF-8');
    entryFile = entryFile.split("\n");
    entryFile = entryFile.filter((line,i) => {
        /* console.log(i)
        if(!line.match('bootstrap') && line.match('@fortawesome/fontawesome-free/js/all.js') === null) {
            return line;
        } */
        if(
            line.match('bootstrap') || 
            line.match('@fortawesome/fontawesome-free/js/all.js') || 
            line.match("./scss/vendor.scss") ||
            line.match("./scss/e-market.scss")
            ) {
            line = null;
        }
        return line
    })
    entryFile =entryFile.join("\n")
    return entryFile
}


runCommandIfExist('asset','true',()=>{
    // removing directory if exists
    fs.rmdirSync('./dist',{recursive:true});
    let originalFile = fs.readFileSync(webpackConfig.entry,'UTF-8');
    let _file = removeChunkAssets();
    fs.writeFileSync(webpackConfig.entry,_file);
    // start bundling js files
    exec('webpack', (e,s) => {
        if(e) {
            console.log(e)
        }
        console.log(s)
        // start compile scss files
        exec('sass ./src/scss/e-market.scss ./dist/css/e-market.css', (e) => {
            if(e) {
                console.log(e)
            }
            console.log('file ./src/scss/e-market.scss compiled successfully to ./dist/css/e-market.css')
        })
        fs.writeFileSync(webpackConfig.entry,originalFile);
    })
    
});
