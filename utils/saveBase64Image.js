// const fs = require("fs");
// const path = require("path");

// const saveBase64Image = (base64String, folderName, filenamePrefix = "image") => {
//   return new Promise((resolve, reject) => {
//     // Match the data URL pattern
//     const matches = base64String.match(/^data:(.+);base64,(.+)$/);
//     if (!matches || matches.length !== 3) {
//       return reject(new Error("Invalid base64 string"));
//     }

//     const mimeType = matches[1];
//     const base64Data = matches[2];
//     const extension = mimeType.split("/")[1]; // e.g. 'jpeg', 'png'

//     const relativeFolderPath = path.join("uploads", folderName);
//     const fullFolderPath = path.join(__dirname, "..", relativeFolderPath);

//     if (!fs.existsSync(fullFolderPath)) {
//       fs.mkdirSync(fullFolderPath, { recursive: true });
//     }

//     const filename = `${filenamePrefix}_${Date.now()}.${extension}`;
//     const relativePath = path.join(relativeFolderPath, filename); // <-- relative path to save
//     const fullPath = path.join(__dirname, "..", relativePath);

//     fs.writeFile(fullPath, base64Data, "base64", (err) => {
//       if (err) return reject(err);
//       resolve(relativePath); // 👈 return only the relative path
//     });
//   });
// };

// // utils/getPublicUrl.js
// const getPublicUrl = (relativePath) => {
//     const baseUrl = process.env.URL || "http://localhost:5000";
//     return `${baseUrl}/${relativePath.replace(/\\/g, "/")}`;
// };
  

  
// module.exports = {saveBase64Image, getPublicUrl};
