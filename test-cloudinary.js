const { uploadImage } = require("./src/libs/utils/cloudinary");
const fs = require("fs");

const filePath = "./public/nt.png"; // Replace with the actual path
const buffer = fs.readFileSync(filePath);
const file = {
  name: "charge controller.jpg",
  arrayBuffer: () => Promise.resolve(buffer),
};
uploadImage(file)
  .then((result) => console.log("Success:", result))
  .catch((error) => console.error("Error:", error));
