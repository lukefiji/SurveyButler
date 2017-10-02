module.exports = survey => {
  return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Your input would really help us out!</h3>
          <p>Please answer the following question:</p>
          <p>${survey.body}</p>
          <div>
            <a href="${process.env
              .EMAIL_REDIRECT_URL}/api/surveys/${survey.id}/yes">Yes</a>
          </div>
          <div>
            <a href="${process.env
              .EMAIL_REDIRECT_URL}/api/surveys/${survey.id}/no">No</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
