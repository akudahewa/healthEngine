var invaidRequestCode = 422;
var internalServerErrorCode = 500;
var missingCategory = 'invalid or missing category parameter in request';
var internalServerError = ' Internal server error';
var missingRequestParameter = 'Missing request parameter';
var missingDate = 'Booking date is missed';
var invalidDate = 'Invalid date';
var missingSession = 'Booking session is missing';
var invalidSession = 'Invalid session';
var unavilableDr = 'Doctor is unavailable given time';
var bookingExceed = 'Appoinment full';

var bookableObject = 'bookableObject';

exports.INVALID_REQ_CODE = invaidRequestCode;
exports.MiSSING_CATEGORY  = missingCategory;
exports.INTERNAL_SERVER_ERROR_CODE = internalServerErrorCode;
exports.INTERNAL_SERVER_ERROR = internalServerError;
exports.BOOKABLE_OBJECT = bookableObject;
exports.MISSING_REQ_PARAMS = missingRequestParameter;
exports.MISSING_DATE = missingDate;
exports.INVAILD_DATE = invalidDate;
exports.MISSING_SESSION = missingSession;
exports.INVALID_SESSION = invalidSession;
exports.DR_UNAVAILABLE = unavilableDr;
exports.BOOKING_FULL = bookingExceed;