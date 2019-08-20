# Holochain UI
A Holochain app (hApp) that you can add your own hApps to.

[![Build Status](https://travis-ci.org/holochain/personas-profiles.svg?branch=develop)](https://travis-ci.org/holochain/personas-profiles)
![GitHub last commit](https://img.shields.io/github/last-commit/holochain/personas-profiles.svg)
![GitHub](https://img.shields.io/github/license/holochain/personas-profiles.svg)

## Features
[Full description of Personas & Profiles](https://hackmd.io/pcDkiCJoQH-z6s_VS4LNRg)

## How to use

- [Install nix](https://nixos.org/nix/download.html)
- Clone this repository
  - git clone git@github.com:holochain/personas-profiles.git
- run nix-shell
  - ```nix-shell```
- Check you can test the zomes:
  - npm run hc:test

If the tests all pass you have setup correctly.

- Build the zomes
  - npm run hc:build
- Run the container and the web socket interface
  - npm run hc:start

You should get an output like
```
> holochain-ui@1.0.0 hc:start /Users/philipbeadle/holochain/hApps/holochain-ui
> mkdir -p tmp-storage && holochain_container -c ./container-config.toml

Using config path: ./container-config.toml
Successfully loaded 1 instance configurations
Starting all of them...
Starting instance "holo-chat"...
Starting interfaces...
Done
```

Now lets run the UI.
- cd ui-src
- npm install
- npm run ui:start:agent1

You should now be able to navigate to http://localhost:4001/ and see a list of your Personas and  Profiles with a Default entry in each.



## Built With
[Holonix](https://github.com/holochain/holonix)
[React](https://reactjs.org/)
[Redux](https://redux.js.org/)

TDD ([Test Driven Development](http://blog.cleancoder.com/uncle-bob/2017/10/03/TestContravariance.html))
 - [Cypress](https://www.cypress.io/)
 - [Storybook](https://storybook.js.org/)
