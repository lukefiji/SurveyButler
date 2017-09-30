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
    this.sgApi = sendgrid(process.env.SENDGRID_API_KEY);
    this.from_email = new helper.Email('no-reply@surveybutler.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    // addContent() comes from Mail class
    this.addContent(this.body);
    this.addClickTracking();
    this.addRecipients();
  }

  /** Format addresses for SendGrid
   * @param {[object]} recipients - Recipients array 
   */
  formatAddresses(recipients) {
    return recipients.map(({ email }) => {
      // Map email helper over each recipient
      return new helper.Email(email);
    });
  }

  // Set up click tracking
  addClickTracking() {
    const trackingSettings = new helper.TrackingSettings();
    const clickTracking = new helper.ClickTracking(true, true);

    trackingSettings.setClickTracking(clickTracking);
    this.addTrackingSettings(trackingSettings);
  }

  // Processing recipients
  addRecipients() {
    const personalize = new helper.Personalization();

    // Take each recipient helper and add to personalize object
    this.recipients.forEach(recipient => {
      personalize.addTo(recipient);
    });

    // Add personalize object
    this.addPersonalization(personalize);
  }

  // Send to SendGrid
  async send() {
    // Configure SendGrid request
    const request = this.sgApi.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: this.toJSON()
    });

    const response = this.sgApi.API(request);
    return response;
  }
}

module.exports = Mailer;
