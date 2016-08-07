![screenshot](http://i.imgur.com/tzMaWv4.png)
# Pokemon GO Bot Desktop
**Bot is working**  
Desktop Pokemon GO Bot based on [PokemonGo-Bot](https://github.com/PokemonGoF/PokemonGo-Bot)  
Join us at #desktop-porting channel at [our slack chat](https://pokemongo-bot.herokuapp.com/)


## Warning
 - Just getting started, many things are not stable. Help is much appreciated
 - Currently no linux build. If someone with linux wants to work to try to package the application, that would be great
 - To Linux users: Many are having issues getting the bot running. As of right now, it does not seem to be supported, but it eventually will

## Getting Started

###Install
```
git clone --recursive https://github.com/PokemonGoF/PokemonGo-Bot-Desktop
brew install python node
pip install virtualenv
cd PokemonGo-Bot-Desktop
npm install
```

###Run
```
npm start
```

###Update
```
git pull
git submodule update
npm install
```

###Get encrypt.so
Create a new separate folder somwhere  
Run  
```
wget http://pgoapi.com/pgoencrypt.tar.gz && tar -xf pgoencrypt.tar.gz && cd pgoencrypt/src/ && make
```
Then copy libencrypt.so to the gofbot folder and rename to encrypt.so

## Waffle Channel
We sync the status in [Waffle](https://waffle.io/PokemonGoF/PokemonGo-Bot-Desktop)

## Contributors
JVenberg  
solderzzc  
ProjectBarks  
JacerOmri  
ariestiyansyah  
GodLesZ  
sniok  

*Don't forget to add yourself when doing PR*

##Credits
[PokemonGo-DesktopMap](https://github.com/mchristopher/PokemonGo-DesktopMap) Amazing job done by  Mike Christopher

## Licensing

The source icons belong to © Nintendo/Creatures Inc./GAME FREAK Inc.

This project is licensed under the MIT License.

[![Analytics](https://ga-beacon.appspot.com/UA-81468120-1/desktop-welcome-page)](https://github.com/igrigorik/ga-beacon)
