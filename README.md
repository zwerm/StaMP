# **Sta**ndardised **M**essaging **P**rotocol (StaMP)

StaMP is a messaging protocol designed to make working with multiple messaging platforms easier, 
 by providing a standardised data format for how message objects are represented.

It also includes interfaces, classes, and types for working with StaMP.

StaMP is driven by **M**essaging **L**anguage **L**ocalisers (MLLs), which transform messages from one locale to another.

Usually message processing services will have a *StaMPardiser*, while message sending/receiving services will have a *ThirdPartyLocaliser*.

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
