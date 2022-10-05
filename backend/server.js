const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();
app.use(fileUpload());

app.post("/uploadFile", (req, res) => {
  let filePath;
  if (req.files === null) {
    res.status(400).json({ message: "No file was uploaded" });
  } else {
    const uploadedFile = req.files.file;

    filePath = __dirname + "/client/public/uploads/" + uploadedFile.name;
    uploadedFile.mv(filePath, (err) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.json({
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          fileType: uploadedFile.mimetype,
        });
      }
    });
  }
});

app.listen(5000, () => console.log("Hey, your server started......"));
