# TheSocialBracket

## Context

This was a final project for CS242 at the University of Illinois. It is written using MeteorJS.

## So..... What is this?

Glad you asked! This is a social media take on March Madness brackets. Instead of Duke and UCLA though,
anything could be a bracket entry, and instead of a 60 minute basketball game, we utilize the power 
of social media. Someone wanting to create a bracket will first have to choose a question ("Who is the best
actress of the 90's?" or "What is the best Indiana Jones movie?" (a bracket in which Raiders of the Lost
Ark would be an overwhelming favortie). I'm hoping to have this hosted with Galaxy at some point in the
next couple of months.

## Setup

Create a new meteor package and copy this directory directly into the new root directory using

```bash
meteor create socialbracket
git pull....
```

### Required Meteor components

The following Meteor components are required:

- kadira:flow-router
- kadira:blaze-layout
- meteor/session
- meteor/accounts-ui
- meteor/accounts-password

All of these can be run using 

```bash
meteor add kadira:flow-router kadira:blaze-layout session accounts-ui accounts-password
```

### Forking

Feel free to fork this branch and play around with the code as much as you want! :)
