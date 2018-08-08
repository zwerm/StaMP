# **Sta**ndardised **M**essaging **P**rotocol (StaMP)

StaMP is a messaging protocol designed to make working with multiple messaging platforms easier, 
 by providing a standardised data format for how message objects are represented.

# draft-01
This package serves as a first informal draft of the protocol.

It also includes interfaces, classes, and types for working with StaMP.

StaMP is driven by **M**essaging **L**anguage **L**ocalisers (MLLs), which transform messages from one locale to another.

Usually message processing services will have a *StaMPardiser*, while message sending/receiving services will have a *ThirdPartyLocaliser*.

#### The Message types

#### The StaMPardiser interface

A StaMPardiser is a special type of MLL that accepts messages of locale type T, and returns messages of locale type StaMP.
Thus, a StaMPardiser ensures that messages returned by services, such as NLPs, are always StaMP compliant.

A StaMPardiser must implement the `StaMPardiser<T>` interface, which requires the following methods:

    stampardise(messages: Array<T>): Array<StaMP.Protocol.Messages.StaMPMessage>;


#### The ThirdPartyLocaliser interface

A ThirdPartyLocaliser (TPLr) is the more generic MLL, that accept messages of locale type StaMP, and return messages of locale type T.  
The job of a ThirdPartyLocaliser is to transform StaMP-compliant messages into messages that are compliant
 with the standards of whatever third-party messaging platform the service is talking to.

Normally TPLrs are not seen on frontend services - Instead they're commonly seen on the services responsible for submitting
messages for the user to a third-party platform, such as Facebook.

A ThirdPartyLocaliser must implement the `ThirdPartyLocaliser<T>` interface, which requires the following methods:

    localise(messages: Array<StaMP.Protocol.Messages.StaMPMessage>): Array<T>;

#### Examples
Facebook serves as a good example of why StaMP is useful; They have their own messaging standards, which are not StaMP-compliant.

A third-party messaging system for Facebook would have the following steps:

1. Receive message from Facebook
2. Process message, extracting desired data
3. Submit data to processing services, such as NLPs
4. Receive resulting data from processing services
    * Note that the resulting data may itself include StaMP-compliant messages, depending on the processing service(s).  
5. Create StaMP-compliant messages as required
6. Submit StaMP-compliant messages to the Facebook `ThirdPartyLocaliser<FacebookMessage>`
    * This `ThirdPartyLocaliser` returns messages of type `FacebookMessage`, which is not defined in this standard.
7. Submit the Facebook-compliant messages back to Facebook, to be sent and displayed to the user

Of the steps listed, only first and last two steps are unique to Facebook. 
By comparision here is the equivalent steps for a third-party messaging system for Slack:

1. Receive message from Slack
2. Process message, extracting desired data
3. Submit data to processing services, such as NLPs
4. Receive resulting data from processing services
    * Note that the resulting data may itself include StaMP-compliant messages, depending on the processing service(s).  
5. Create StaMP-compliant messages as required
6. Submit StaMP-compliant messages to the Slack `ThirdPartyLocaliser<SlackMessage>`
    * This `ThirdPartyLocaliser` returns messages of type `SlackMessage`, which is not defined in this standard.
7. Submit the Facebook-compliant messages back to Slack, to be sent and displayed to the user 

As you can see, they are not much different, because internally everything is StaMP-compliant, regardless of source or destination.
Note that this doesn't exclude or prevent any special treatment of messages based on sources:
StaMP messages include meta-data about their original source.

By including this metadata, it makes StaMP a loss-less standard; 
Your services can still perform platform-dependent logic while continuing to be StaMP-compliant.

# Message builder
This package includes a library to easily build StaMP messages.

To use it in your project, require the `MessageBuilder` class.
```javascript
const StaMPBuilder = require('@stampit/stamp/MessageBuilder');
```

#### Text message
Text messages are the most basic response from a server.
```javascript
StaMPBuilder.createTextMessage('hello world');
```
They can have an additional argument to provide instructions for speech synthesis in [SSML](https://en.wikipedia.org/wiki/Speech_Synthesis_Markup_Language).
```javascript
StaMPBuilder.createTextMessage('hello world', '<p>hello <emphasis level="strong">world</emphasis></p>');
```

#### Image message
Sends an image response from the server.
```javascript
// Displays a cute kitten 
StaMPBuilder.createImageMessage('https://i.imgur.com/qOFRvNm.jpg');
```
Use the second argument to provide instructions for speech synthesis in [SSML](https://en.wikipedia.org/wiki/Speech_Synthesis_Markup_Language).
```javascript
// Describes the picture in speech
StaMPBuilder.createImageMessage('https://i.imgur.com/qOFRvNm.jpg', '<p>A black and white kitten looking out of a window.</p>');
```

#### Quick reply message
Use quick reply messages to suggest responses to a user. This message type always includes a standard text message which is send to the user first. 
```javascript
StaMPBuilder.createQuickReplyMessage('Try one of these:', [
    StaMPBuilder.createQuickReply('I need help'),
    StaMPBuilder.createQuickReply('Start over', 'reset'),
]);
```
The second argument can be used to send a different payload back to the server than what is displayed to the user. This can be useful for navigation intents that mainly react to certain keywords. 

Quick replies event support images. You always need to provide a `title` for accessibility and as a fallback.
```javascript
StaMPBuilder.createQuickReplyMessage('Try one of these:', [
    StaMPBuilder.createQuickReply('I like this', 'like', 'https://example.com/thumbs-up.png'),
]);
``` 

#### Card message
Cards are the most complex form of response a server can create. They combine various pieces of information to one semantic block.
```javascript
StaMPBuilder.createCardMessage('Abbey Road', 'The Beatles', 'https://example.com/abbey-road-cover.jpg');
```
This will create a output similar to this:

Please note that the `subtitle` and `imageUrl` parameters are optional and can be omitted.

Cards can also have buttons, which are very similar to quick replies.
```javascript
StaMPBuilder.createCardMessage('Abbey Road', 'The Beatles', null, [
    StaMPBuilder.createCardButton('Buy album', 'Buy upc:733966091699'),
    StaMPBuilder.createCardButton('Play album', 'Play spotify:album:4slBy2W4HhYDvRIgktSV8d'),
]);
```
This will create a output similar to this:

The second argument on the card button can be used to pass a specific value on, like a product id.  
In this example we set the Universal Product Code and the Spotify Uri. It is up to a NLU and engine to make use of these values.

#### Location message
Used to send a location or map view to the user.
```javascript
// Show Wellington, New Zealand on a map
StaMPBuilder.createLocationMessage(-41.28664, 174.77557);
```

#### Query message
Query messages are send from a user to a server. They represent the utterance of a user in a NLU.
```javascript
StaMPBuilder.createQueryMessage('Get started');
```
Sometimes you'd like to send a different message than shown in the message window. You can do this using the second argument.
```javascript
StaMPBuilder.createQueryMessage('Hello bot!', 'Get started');
```
In this case the bot engine receives the second string as value, however a client should render the first string.

#### Event message
Clients can send events to a supported processing engine. Events are just another way of triggering intents in a NLU.
```javascript
StaMPBuilder.createEventMessage('WELCOME');
```
Some engines support an additional payload on events which can be used by the NLU to composite a response.
```javascript
StaMPBuilder.createEventMessage('WELCOME', {
    name: 'Jane'
});
```
In this example a NLU might choose to use the `name` property of the payload object to call the user by their name.

#### Typing message
Typing messages are typically send from the server to indicate to the user that the bot is working on a  response.
```javascript
StaMPBuilder.createTypingMessage('on', 'server');
StaMPBuilder.createTypingMessage('off', 'server');
```
They can also be send by a client (a user), however most receivers will ignore this information.
```javascript
StaMPBuilder.createTypingMessage('on', 'user');
StaMPBuilder.createTypingMessage('off', 'user');
```

