### Encrypt.so / encrypt.dll error
Follow this link and download library for your OS.
https://github.com/PokemonGoMap/PokemonGo-Map/tree/develop/pogom/libencrypt
On login screen select your file **or** rename the file to encrypt.so and place it in gofbot folder

### Missing module X
Running `npm install` should fix it. If you get an error with word 'permission' in it try `sudo npm install`

### Error encoding ascii...
Make a clean install. Go to your config.json and set health_check to false

### Command brew not found
Please follow instructions for your OS.

### Can't install please help call me on skype
Without providing information ( commit, os, logs) we can't help you. Remember that this project is run by volunteers and no one owes you nothing. Please be kind and respectfull to each other

### Bot behaves incorrectly
That is probably bot's problem, not this project's, please submit issues to the Go to https://github.com/PokemonGoF/PokemonGo-Bot

### Why don't bot do backflips
Go to https://github.com/PokemonGoF/PokemonGo-Bot and propose your suggestion
We are just making a wrapper for python bot

### Why no one responds
It's probably beacuse you provided too little information. Please follow instructions that you see when opening new issue

### No module named pgoapi
Check out https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/issues/51#issuecomment-236888095

### How do I edit the config?
_This is just a temporary solution. In future versions we will enhance the ability to edit the config_

#### Mac
1. Download [PokemonGofBot.app](https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/releases)
2. Right click PokemonGofBot.app and click _"Show Package Contents"_
3. Goto `Contents/Resources/app/gofbot/configs/config.json`
4. Follow [this](https://github.com/PokemonGoF/PokemonGo-Bot/blob/dev/docs/configuration_files.md#sniping-movetolocation) guide to edit the `config.json`

#### Windows
Currently we do not know how to edit the config for Windows; however, in future versions we will add the ability to edit the config in the desktop applicacion. 
