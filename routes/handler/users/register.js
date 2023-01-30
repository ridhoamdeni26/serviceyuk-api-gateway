const apiAdapter = require("../../apiAdapter");
const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const { URL_SERVICE_USER } = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    const __dirname = path.resolve();
    const filePath = path.join(
      __dirname,
      "/routes/handler/users/templateEmail.html"
    );
    const source = fs.readFileSync(filePath, "utf-8").toString();
    const template = Handlebars.compile(source);

    const registerUser = await api.post("/users/register", req.body);
    const email = registerUser.data.data["email"];
    const subject = "Verification Email";

    const replacements = {
      username: registerUser.data.data["username"],
      confirmLink: `${URL_SERVICE_USER}/users/confirm/${registerUser.data.data["confirmation_code"]}`,
      iconImage: __dirname,
    };

    const htmlToSend = template(replacements);

    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "c43966911d4589",
        pass: "62e829476c17e7",
      },
    });

    const mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email,
      subject: subject,
      html: htmlToSend,
    };

    if (registerUser) {
      transport.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          return res.json(registerUser.data);
        }
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Register User not Successfully",
      });
    }
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(500).json({
        status: "error",
        message: "service unavailable",
      });
    }

    const { status, data } = error.response;
    return res.status(status).json(data);
  }
};
