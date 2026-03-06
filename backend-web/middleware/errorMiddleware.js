// Handle 404 Not Found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  // Sometimes errors come with a status code, otherwise default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyPattern)[0];
    message = `Duplicate field value entered: ${field} must be unique.`;
  }

  // Handle Multer file size limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 400;
    message = 'File size is too large. Maximum 5MB allowed.';
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    // Provide stack trace only in development
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
import fs from "fs";
import path from "path";

const cleanupUploadedFilesOnError = async (err, req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const filePath = file.path; // multer đã lưu sẵn full path
                try {
                    await fs.promises.unlink(filePath);
                } catch (unlinkErr) {
                    console.error("Không thể xóa file:", filePath);
                }
            }
        }

        if (req.file) {
            try {
                await fs.promises.unlink(req.file.path);
            } catch (unlinkErr) {
                console.error("Không thể xóa file:", req.file.path);
            }
        }
    } catch (cleanupError) {
        console.error("Cleanup error:", cleanupError);
    }

    next(err); // chuyển tiếp sang error handler chính
};
export { notFound, errorHandler, cleanupUploadedFilesOnError };