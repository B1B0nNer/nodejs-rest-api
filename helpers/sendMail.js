const nm = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const { EMAIL, PASS } = process.env;

if (!EMAIL || !PASS){
    console.error("One or more required environment variables are missing.");
  process.exit(1);
}

const transporter = nm.createTransport({
    service: "Gmail",
    auth: {
        user: EMAIL,
        pass: PASS
    }
})

const sendEmail = async(data) => {
    const email = { ...data, from: EMAIL};
    try{
        await transporter.sendMail(email);
        return true;
    } catch(error){
        console.log(error.message);
        return false;
    }
}

module.exports = sendEmail;