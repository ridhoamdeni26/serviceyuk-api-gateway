const apiAdapter = require("../../apiAdapter");
const nodemailer = require("nodemailer");
const Handlebars = require("handlebars");

const { URL_SERVICE_USER } = process.env;

const api = apiAdapter(URL_SERVICE_USER);

module.exports = async (req, res) => {
  try {
    await api
      .post("/users/register", req.body)
      .then((response) => {
        var transport = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "c43966911d4589",
            pass: "62e829476c17e7",
          },
        });

        const mailOptions = {
          from: "sender@gmail.com", // Sender address
          to: "receiver@gmail.com", // List of recipients
          subject: "Node Mailer", // Subject line
          text: "Hello People!, Welcome to Bacancy!", // Plain text body
        };

        transport.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log(info);
          }
        });
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return res.json(response.data);
      })
      .catch((error) => {
        return res.json(error.response.data);
      });
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
