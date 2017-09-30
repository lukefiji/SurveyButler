const sendgrid = reqiuire('sendgrid');
const helper = sendgrid.mail;

/** Mailer class */
class Mailer extends helper.Mail {
  /**
   * Create a Mailer instance
   * @param {Object} survey - Mongoose Survey model
   * @param {function} content - Email template to use
   */
  constructor({ subject, recipients }, content) {
    super();

    // SendGrid setup
    this.from_email = new helper.Email('no-reply@surveybutler.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);
  }
}

module.exports = Mailer;
