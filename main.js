const express = require('express'),
	cors = require('cors'),
	secure = require('ssl-express-www');
const app = express();
const bodyParser = require("body-parser");
const PORT = 3000;

const mainrouter = require("./routes/mainrouter.js"),
	apirouter = require("./routes/api.js");
const SECRET_KEY = "6LfmBbgqAAAAADUUDsvnYqXtUWcsOk5MOnw491gg";
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
app.use('/', mainrouter);
app.use('/api', apirouter);

app.listen(PORT, (error) => {
	if (!error)
		console.log("APP LISTEN TO PORT " + PORT)
	else
		console.log("ERROR OCCUIRED")
});

module.exports = app
