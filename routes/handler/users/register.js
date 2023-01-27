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
    const text = `Verification ${registerUser.data.data["username"]}`;

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

    // transport.sendMail(mailOptions, function (err, info) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log("Preview URL: %s", info);
    //     return res.json(response.data);
    //   }
    // });
    // await api
    //   .post("/users/register", req.body)
    //   .then((response) => {
    //     const __dirname = path.resolve();
    //     const filePath = path.join(__dirname, "./templateEmail.html");
    //     const source = fs.readFileSync(filePath, "utf-8").toString();
    //     const template = Handlebars.compile(source);
    //     const replacements = {
    //       username: "Ridho Amdeni",
    //     };

    //     const htmlToSend = template(replacements);

    //     var transport = nodemailer.createTransport({
    //       host: "smtp.mailtrap.io",
    //       port: 2525,
    //       auth: {
    //         user: "c43966911d4589",
    //         pass: "62e829476c17e7",
    //       },
    //     });

    //     const mailOptions = {
    //       from: '"Fred Foo 👻" <foo@example.com>', // sender address
    //       to: "bar@example.com, baz@example.com", // list of receivers
    //       subject: "Hello ✔", // Subject line
    //       text: "Hello world?", // plain text body
    //       html: htmlToSend, // html body
    //     };

    //     transport.sendMail(mailOptions, function (err, info) {
    //       if (err) {
    //         console.log(err);
    //       } else {
    //         console.log("Preview URL: %s", info);
    //         return res.json(response.data);
    //       }
    //     });
    //   })
    //   .catch((error) => {
    //     return res.json(error.response.data);
    //   });
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
