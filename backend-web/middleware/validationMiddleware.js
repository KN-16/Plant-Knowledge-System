import { validationResult } from 'express-validator';
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// const handleValidationErrorsForSingleFile = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     // If there was a file uploaded, delete it to prevent orphaned files
//     if (req.file) {
//       deleteFile(`/uploads/${req.file.filename}`);
//       console.log('Deleted uploaded file due to validation errors.');
//     }
//     console.log('Validation errors:', errors.array());
//     return res.status(400).json({
//       success: false,
//       message: 'Validation failed',
//       errors: errors.array(),
//     });
//   }
//   next();
// };

export default handleValidationErrors;
// export { handleValidationErrorsForSingleFile };