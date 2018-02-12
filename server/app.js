const path = require('path'),
    express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    PORT = 8123
    ;

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api', (req, res) => {
    res.send(`Hello World`);
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}`);
})
