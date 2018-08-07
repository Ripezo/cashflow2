/*
 * Last edit: 2017/03/19;
 */

var Preloader = function(files = [])
{
    this.filesLoaded = 0;
    this.files = files;
    this.rawFiles = [];
    this.loadFiles();
};
 
Preloader.prototype.constructor = Preloader;

Preloader.prototype.loadFiles = function()
{
   if(this.files.length)
   {
        var fileType = this.files[this.filesLoaded].split('.');
        if(fileType.length < 2)
        {
            alert('Error. Este archivo no posee extensión. [ "'+this.files[this.filesLoaded]+'" ].');
        }
        else
        {
            fileType = fileType[fileType.length -  1];
            this.rawFiles.push({ type: fileType });
            if(fileType == 'js' || 'css')
            {
                this.loadJS(this.files[this.filesLoaded]);
            }
            else
            {
                alert('Error. Este preloader no soporta la extensión [ .'+fileType+' ].');
            }
        }
   }
   else
   {
        alert('No hay archivos para cargar.');
   }    
};
 
Preloader.prototype.loadJS = function(fileURL)
{
    this.addProgressBar();

    this.loader = new XMLHttpRequest();
    this.loader.addEventListener('progress', this.onProgressHandler.bind(this));
    this.loader.addEventListener('load', this.onLoadHandler.bind(this));
    this.loader.addEventListener('error', this.onErrorHandler.bind(this));
    this.loader.addEventListener('abort', this.onAbortHandler.bind(this));
    this.loader.open('GET', fileURL);
    this.loader.send();
};
 
Preloader.prototype.onLoadHandler = function(event)
{
    this.rawFiles[this.filesLoaded].rawContent = event.target.response;
    this.filesLoaded++;
    if(this.files.length == this.filesLoaded)
    {
        this.progressBar.fill.style.width = this.progresBarWidth + 'px';
        this.addFilesToDOM();
        //console.log('Todos los archivos han sido cargados.');
    }
    else
    {
        
        this.loadFiles();
    }
};

Preloader.prototype.addFilesToDOM = function()
{
    this.removePreloader();

    for(var f = 0; f < this.rawFiles.length; f++)
    {
        if(this.rawFiles[f].type == 'css')
        {
            var css = document.createElement('style');
                css.type = 'text/css';
                css.rel = 'stylesheet';
                css.appendChild(document.createTextNode(this.rawFiles[f].rawContent));
            document.head.appendChild(css);
        }
        else if(this.rawFiles[f].type == 'js')
        {
            var js = document.createElement('script');
                js.type = 'text/javascript';
                js.appendChild(document.createTextNode(this.rawFiles[f].rawContent));
            document.body.appendChild(js);
        }
    }
};
 
Preloader.prototype.addProgressBar = function()
{
    if(this.progressBar)
    {
        this.progressBar.fill.style.width = '0px';
    }
    else
    {
        this.progresBarWidth = 320;
        this.progresBarHeight = 8;
     
        this.progressBar = document.createElement('div');
        this.progressBar.id = 'progress-bar';
        this.progressBar.style = 'border:1px solid #aaa; position:absolute; top: 50%; left:50%; width: '+this.progresBarWidth+'px; height:'+this.progresBarHeight+'px; transform: translate(-50%, -50%); overflow: hidden; box-sizing: border-box;';
        document.body.appendChild(this.progressBar);
     
        this.progressBar.fill = document.createElement('div');
        this.progressBar.fill.style = 'height: '+this.progresBarHeight+'px; width: 0; background-color: #eee; float: left;';
        this.progressBar.appendChild(this.progressBar.fill);
     
        this.progressBar.progressValue = this.currentPercent = this.temporaryPercent = 0;
        window.onIntervalHandler = setInterval(this.onIntervalHandler.bind(this), 1000/120);
    }
};
 
Preloader.prototype.onIntervalHandler = function()
{
    if(this.temporaryPercent + 1 < this.progresBarWidth)
    {
        this.setPercent(this.progressBar.progressValue);
    }
    else
    {
        this.removePreloader();
    }
};
 
Preloader.prototype.setPercent = function(progressValue)
{
    this.currentPercent = progressValue * this.progresBarWidth;
    this.temporaryPercent += (this.currentPercent - this.temporaryPercent) * 0.05;
    this.progressBar.fill.style.width = this.temporaryPercent+'px';
};
 
Preloader.prototype.onProgressHandler = function(event)
{
    if(event.lengthComputable) this.progressBar.progressValue = event.loaded / event.total;
};

Preloader.prototype.onErrorHandler = function()
{
    console.log('onErrorHandler');
};
 
Preloader.prototype.onAbortHandler = function()
{
    console.log('onAbortHandler');
};
 
Preloader.prototype.removePreloader = function()
{
    clearInterval(window.onIntervalHandler);
    document.body.removeChild(document.getElementById('preloader'));
    document.body.removeChild(document.getElementById('progress-bar'));
};

new Preloader(['js/scripts.js','css/styles.css']); // Array de archivos para cargar.