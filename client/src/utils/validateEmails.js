const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Validate emails
 * @param {string} emails - Comma-separated list of emails
 * @return {string} - Invalid emails
 */
export default emails => {
  // Split and trim emails into an array, then filter for invalid emails
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => re.test(email) === false);

  if (invalidEmails.length) {
    return `These emails are invalid: ${invalidEmails}`;
  }

  // TODO: Warn about comma at end of emails

  // Return nothing if all emails are valid
  return;
};
