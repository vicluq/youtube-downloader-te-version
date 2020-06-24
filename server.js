const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
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
    res.setHeader('Content-Type', 'text/html');
    res.render('home', (err, html) => {
        if(err) {
            res.status(400).send(`<h1>troubleshoot</h1> >> \n\n <pre>${err}</pre>`);
        } else {
            res.status(200).send(html)
        }
    })
})

app.get('/', (req, res) => {
    res.status(301).redirect(`${req.protocol}://${req.hostname}:${port}/downloader`)
})

app.use((req, res) => {
    res.status(404).send('Not Found 404')
})

app.listen(port, () => { 
    console.log(`server up on PORT ${port}`)
 })