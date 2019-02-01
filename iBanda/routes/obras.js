var express = require('express');
var router = express.Router();
var fs = require("fs");
var JSZip = require("jszip");
const fileUpload = require('express-fileupload');
var Obra = require("../controllers/obra")
var path = require("path")
var unzip = require("unzip")
const StreamZip = require('node-stream-zip');
var extract = require('extract-zip')

var deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

router.get("/carregarObra", (req,res)=>{
    res.render('carregarobras')
})


var moveFile = (file, dir2)=>{
    //include the fs, path modules

//gets file name and adds it to dir2
var f = path.basename(file);
var dest = path.resolve(dir2, f);
fs.createReadStream(file).pipe(fs.createWriteStream(dest));

/* fs.rename(file, dest, (err)=>{
if(err) throw err;
else console.log('Successfully moved');
}); */
};


router.post("/carregarFile", (req, res)=> {
    
    var filepath = path.join(__dirname,"/../",'/uploads/',req.files.samplefile.name)

    req.files.samplefile.mv('uploads/' + req.files.samplefile.name, function(err) {
        if (err)
            return res.status(500).send(err);
        else{const zip = new StreamZip({
            file: filepath,
            storeEntries: true})
        
            zip.on('ready', () => {
                console.log(filepath+"/iBanda-SIP.json")
                const data = zip.entryDataSync("iBanda-SIP.json");
                
                if(data){
                    var temp = JSON.parse(data.toString());

                    console.log(temp)

                    for(i=0;i<(temp.instrumentos).length;i++){
                        if(!(zip.entryDataSync(temp.instrumentos[i].partitura.path))){
                            console.log('Partitura não existe: '+ temp.instrumentos[i].partitura.path)
                            res.render("/carregarobras")
                        }
                        

                    }

                    if (!fs.existsSync("obras/"+temp.id)){
                        fs.mkdirSync("obras/"+temp.id);
                    }
                    if (!fs.existsSync("temp")){
                        fs.mkdirSync("temp");
                    }
                    var filepathobra = path.join(__dirname,'/../','/temp/')
                    var filepathobra2 = path.join(__dirname,'/../','/obras/')
                    extract(filepath,{dir: filepathobra},err =>{
                        if(err) throw err
                        else{
                            //moves the $file to $dir2
                            
                            
                            //move file1.htm from 'test/' to 'test/dir_1/'
                            const fileele = []
                            for(i=0;i<(temp.instrumentos).length;i++){
                                var extractto = filepathobra2 +temp.id+"/"
                                
                                if(!(fs.existsSync("obras/"+temp.id+"/"+temp.instrumentos[i].partitura.path))){
                                moveFile(filepathobra+temp.instrumentos[i].partitura.path, extractto);
                                
                                }
                            }
                            Obra.create(temp)
                            .then(dados => {
                                fs.access(filepath, error => {
                                    if (!error) {
                                        fs.unlinkSync(filepath);
                                    } else {
                                        console.log(error);
                                    }
                                });
                                deleteFolderRecursive(filepathobra)
                                console.log(dados)
                                res.jsonp(dados)})
                            .catch(erro => console.log('Erro na listagem: ' + erro))
                        }
                    })

                    
               
                    
            
            }else{
                    console.log("File dont exist")
                    fs.access(filepath, error => {
                        if (!error) {
                            fs.unlinkSync(filepath);
                        } else {
                            console.log(error);
                        }
                    });
                    
                    res.render('carregarobras')
                }
                zip.close();
               
               
               
               
        
            // Take a look at the files
                console.log('Entries read: ' + zip.entriesCount);
            })
        }
    })
   
        
        

      
}); 

module.exports = router;
