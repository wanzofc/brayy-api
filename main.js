const express = require('express'),
	cors = require('cors'),
	secure = require('ssl-express-www');
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;
const path = require('path'); // Tambahkan path module

const mainrouter = require("./routes/mainrouter.js"),
	apirouter = require("./routes/api.js");
const SECRET_KEY = "6LfhB7gqAAAAAA8L5KtoSqbx6QbDjiV_jejKzlGp";
const axios = require("axios");

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/verify-captcha", async (req, res) => {
  const token = req.body["g-recaptcha-response"]; // Ambil token dari form
  if (!token) {
    return res.status(400).send("Token reCAPTCHA tidak ditemukan.");
  }
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${token}`
    );
    if (response.data.success) {
      res.send("reCAPTCHA berhasil diverifikasi.");
    } else {
      res.status(400).send("Verifikasi reCAPTCHA gagal.");
    }
  } catch (error) {
    console.error("Error saat memverifikasi reCAPTCHA:", error);
    res.status(500).send("Terjadi kesalahan saat memverifikasi reCAPTCHA.");
  }
});


app.enable('trust proxy');
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
app.use(express.static("public"));
app.set("views", __dirname + "/view");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Melayani file di luar folder public
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/profile.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'profile.png'));
});

app.use('/', mainrouter);
app.use('/api', apirouter);

app.listen(PORT, (error) => {
	if (!error)
		console.log("APP LISTEN TO PORT " + PORT)
	else
		console.log("ERROR OCCUIRED")
});

module.exports = app
