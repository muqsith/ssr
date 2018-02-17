import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const PORT = 8123;

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(path.resolve(__dirname, 'public')));

app.listen(PORT, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Listening at http://localhost:${PORT}`);
    }
});
