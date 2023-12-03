require("dotenv").config();
const AWS = require("aws-sdk");
exports.uploadToS3 = (data, filename) => {
  const BUSKET_NAME = "expenseapptracker1";
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_SECRET_KEY;
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  const params = {
    Bucket: BUSKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((res, rej) => {
    s3bucket.upload(params, async (err, s3res) => {
      try {
        if (err) {
          console.log("uploading err", err);
          rej(err);
        } else {
          res(s3res.Location);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });
};
