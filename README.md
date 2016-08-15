![screenshot](http://i.imgur.com/tzMaWv4.png)
<p align="center">
  <a href="https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/releases/download/v0.0.2-alpha/PikaBot-0.2-alpha-mac.zip"><img src="http://i.imgur.com/pRNJGt6.png"></a>
  <a href="https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/releases/download/v0.0.2-alpha/PikaBot-0.2-alpha-win.zip"><img src="http://i.imgur.com/CSz91B9.png"></a>
</p>
# Pokemon GO Bot Desktop
**THE BOT IS CURRENTLY UNDERGOING A MAJOR BUILD SYSTEM REVAMP PLEASE BE PATIENT**

Desktop Pokemon GO Bot based on [PokemonGo-Bot](https://github.com/PokemonGoF/PokemonGo-Bot)  

Join us at #desktop-porting channel at [our slack chat](https://pokemongo-bot.herokuapp.com/)


## Warning
 - Just getting started, many things are not stable. Help is much appreciated
 - Currently no linux build. If someone with linux wants to work to try to package the application, that would be great
 - To Linux users: Many are having issues getting the bot running. As of right now, it does not seem to be supported, but it eventually will

## Getting Started

###Install

#### macOS
```
git clone --recursive https://github.com/PokemonGoF/PokemonGo-Bot-Desktop
brew install python node wget
cd PokemonGo-Bot-Desktop
npm install
```

If `npm install` crashes with errors related to `pip`, the following script may solve your problems :

    cat > ~/.pydistutils.cfg << EOF
    [install]
    prefix=
    EOF

#### Linux
Install [Node.js](https://nodejs.org/en/)
```
git clone --recursive https://github.com/PokemonGoF/PokemonGo-Bot-Desktop
sudo apt-get install python wget
cd PokemonGo-Bot-Desktop
npm install
```

#### Windows
Install [git bash](https://git-scm.com/downloads)  
Install [Python 2.7](https://www.python.org/downloads/)  
Install [Node.js](https://nodejs.org/en/)  
Set your $PATH
```
git clone --recursive https://github.com/PokemonGoF/PokemonGo-Bot-Desktop
cd PokemonGo-Bot-Desktop
npm install
```

### Run
```
npm start
```

### Update
```
git pull
npm install
```

### Get encrypt.so
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
ProjectBarks
solderzzc  
JacerOmri  
ariestiyansyah  
GodLesZ  
sniok  
mmnsgo  
Outpox  
JulienTant


*Don't forget to add yourself when doing PR*

## Credits
[PokemonGo-DesktopMap](https://github.com/mchristopher/PokemonGo-DesktopMap) Amazing job done by  Mike Christopher

## Licensing

The source icons belong to © Nintendo/Creatures Inc./GAME FREAK Inc.

This project is licensed under the MIT License.

[![Analytics](https://ga-beacon.appspot.com/UA-81468120-1/desktop-welcome-page)](https://github.com/igrigorik/ga-beacon)
