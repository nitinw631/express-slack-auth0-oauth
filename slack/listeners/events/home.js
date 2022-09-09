

const {
  HomeTab, Elements,
  Header,
  Divider,
  Section
} = require('slack-block-builder');

const appHomeOpenedCallback = async ({ client, event, body }) => {

  console.log('Yes it worked');
  const header = HomeTab({ callbackId: 'home', privateMetaData: 'open' }).blocks(

    Header({ text: 'Quick actions' }),
    Divider(),
    Section({
      text: 'Hey there! Today’s a great day to recognize your coworker.'
    }).accessory(
      Elements.Button({ text: 'Send a recognition' }).value('open_recognition').actionId('open_recognition')
    ),
  );
  try {
    await client.views.publish({
      user_id: event.user,
      view: header.buildToJSON(),
    });
    return;
  }
  catch (error) {
    console.error(error);
  }
};

module.exports = { appHomeOpenedCallback };