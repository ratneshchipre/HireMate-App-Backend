const cloudinary = require("../utils/cloudinary");

const uploadToCloudinary = (buffer, folder, fileMimeType) => {
  return new Promise((resolve, reject) => {
    let resourceType = "auto";
    const options = {
      folder: folder,
    };

    if (fileMimeType === "application/pdf") {
      resourceType = "raw";
    } else if (fileMimeType.startsWith("image/")) {
      resourceType = "image";
    }

    options.resource_type = resourceType;

    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      })
      .end(buffer);
  });
};

module.exports = uploadToCloudinary;
