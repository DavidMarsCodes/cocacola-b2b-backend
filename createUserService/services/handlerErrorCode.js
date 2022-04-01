const errorCodes = {
  password_invalid: 2002,
  password_required: 2003,
  first_name_invalid: 2004,
  first_name_required: 2005,
  last_name_invalid: 2006,
  last_name_required: 2007,
  email_invalid: 2008,
  email_required: 2009,
  cellphone_invalid: 2010,
  cellphone_required: 2011,
  field_selected_to_login_invalid: 2012,
  field_selected_to_login_required: 2013,
  client_required: 2014,
};

const resetCodes = error => {
  const newCode = errorCodes[error.msg];
  error.code = newCode || error.code;
  return error;
};

module.exports = resetCodes;