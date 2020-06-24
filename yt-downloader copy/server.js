const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const ytdl = require('ytdl-core')
const lr = require('livereload')

dotenv.config()
const port = process.env.PORT || 3003;

const fw = lr.createServer({ 
    exts: ['js', 'css', 'pug'],
    debug: true
 }, () => {
     console.log('File changes on course');  
 });

 fw.watch(path.resolve(__dirname));

const app = express();

app.use(require('connect-livereload')());
app.use(express.static(path.resolve(__dirname + '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'pug');
app.engine('pug', require('pug').renderFile)


app.get('/downloader', (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.status(200).render('home')
})

app.post('/downloader/download', (req, res, next) => {
    console.log(req.body);
    if (ytdl.validateURL(req.body.video_url)) {
        console.log('Valid ULR');
        
        next()
    } else {
        res.setHeader('Content-Type', 'text/html')
        res.status(400).render('home', { error: 'Enter a valid url' })
    }
})

app.post('/downloader/download', (req, res) => {
    
    const vidQuality = req.body.format === 'mp4' ? req.body['quality-mp4'] : req.body['quality-webm']
    console.log(Number.parseInt(vidQuality));
    
    const video = ytdl(req.body.video_url, { format: req.body.format, quality: Number.parseInt(vidQuality) })
    
    ytdl.getInfo(req.body.video_url, (err, info) => {
        if (err) {
            res.status(400).send('error on fetching video data')
        } else {
            console.log('ready to respond');
            
            res.setHeader('Content-Type', `video/${req.body.format}`);
            res.setHeader('Content-Disposition', `attachment; filename='${parseFilename(info.player_response.videoDetails.title, req.body.format)}'`);
            res.status(202)
            video.pipe(res);
        }
    })
})

app.get('/', (req, res) => {
    res.status(301).redirect(`${req.protocol}://${req.hostname}:${port}/downloader`)
})

app.use((req, res) => {
    res.status(404).send('Not Found 404')
})

function parseFilename (filename, format) {

    const parsedName = filename.replace('/|/g', '_').replace(/-/g, '').split(' ').join('_').trim()  + '.' + format;
    console.log(parsedName);
    
    return parsedName;
}

app.listen(port, () => { 
    console.log(`server up on PORT ${port}`)
 })

