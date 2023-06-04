require('dotenv').config();
require('../util/database');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')

// import routes
const userRoutes = require('../routes/user');

const app = express();

// middlewares
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// app.use(express.static(path.join(__dirname,'public')));
//app.use(errorController.get404);

app.use('/user',userRoutes);

// Run Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on ", PORT);
});
