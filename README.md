# Interactive Notebook ![GitHub release](https://img.shields.io/github/release/salah3x/notebook-ui.svg?color=%23f441be) ![GitHub](https://img.shields.io/github/license/salah3x/notebook-ui.svg?color=%232196F3)

An Interactive Notebook UI for [notebook-server](https://github.com/salah3x/notebook-server).

---

## Pre-requisite

- Run the notebook server on your machine (Follow the [installation instructions](https://github.com/salah3x/notebook-server#installation)).
- Install the `Oracle JET cli`, assuming `node` and `npm` are already installed:

  `$ npm install -g @oracle/ojet-cli`

## Build-Run-Deploy

- First clone the repo:

  `$ git clone git@github.com:salah3x/notebook-ui.git && cd notebook-ui`

- Serve the app on [http://localhost:8000/](http://localhost:8000/):

  `$ ojet serve`

- To deploy the app:

  - Build the project:

    `$ ojet build`

  - Copy the content of `web` directory to a static web host (e.g. AWS S3 or Firebase Hosting)

## Features

See [release notes](https://github.com/salah3x/notebook-ui/releases)

## Further help

To get more information about Oracle JET, check out the [the official docs](http://www.oraclejet.org).

---

This project was generated with [Oracle JET Command Line Interface](https://github.com/oracle/oraclejet) version 7.2.0
