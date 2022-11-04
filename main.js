const express = require('express');
const app = express();
const port = 7000;
const Router = require('./router/router')

app.use(express.json())

app.use('/',Router)

app.listen(port,()=>{
    console.log(`SERVER RUNNING AT http://localhost:${port}`);
})