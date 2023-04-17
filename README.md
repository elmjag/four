# Four-in-row Game

A simple two player '4-in-a-row' game.
An example of a React and Redux web application.
The backend is written in python.

## Installing

Make sure [micromamba](https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html) is installed.
Clone this repository and create conda environment with:

    micromamba create -f environment.yml

This will install all required python packages and nodejs.
Install nodejs packages with:

    cd src
    npm install

Build the front-end application

    npm run build

## Running

Start the backend with:

    ./four.py

Open http://localhost:8080 in your web-browser.

To run front-end application in development mode:

    cd src
    npm start

The development version of the app will be served at http://localhost:3000.
