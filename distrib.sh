#!/bin/bash

find . -name "*.pyc" -delete

# rm -rf PikaBot-OSX
# node_modules/.bin/electron-packager . "PikaBot" --platform=darwin --arch=x64 --icon=resources/image/icons/pokemon.icns --overwrite --prune --ignore=PikaBot-Lin-x64.zip --ignore=PikaBot-OSX.zip --ignore=PikaBot-Win.zip --ignore=map/ve --ignore="map/Easy Setup" --ignore=distrib.sh --ignore=pywin --ignore=package_python.sh
# cd "PikaBot-darwin-x64"
# zip -9ryv ../PikaBot-OSX.zip .
# cd ..

# rm -fr PikaBot-Win.zip
node_modules/.bin/electron-packager . "PikaBot" --platform=win32 --arch=ia32 --icon=resources/image/icons/pokemon.ico --overwrite --prune --ignore=map/ve --ignore=PikaBot-Lin-x64.zip --ignore=PikaBot-OSX.zip --ignore=PikaBot-Win.zip --ignore="map/Easy Setup" --ignore=distrib.sh --ignore=package_python.sh
# cd "GoF Bot-win32-ia32"
# zip -9rv ../PikaBot-Win.zip .
# cd ..

# rm -fr PokemonGoMap-Lin-x64.zip
# node_modules/.bin/electron-packager . "PikaBot" --platform=linux --arch=x64 --icon=pokemon.ico --overwrite --prune --ignore=map/ve --ignore=PokemonGoMap-Lin-x64.zip --ignore=PokemonGoMap-OSX.zip --ignore=PokemonGoMap-Win.zip --ignore="map/Easy Setup" --ignore=distrib.sh --ignore=package_python.sh --ignore=pywin
# cd "GoF Bot-linux-x64"
# zip -9ryv ../PokemonGoMap-Lin-x64.zip .
# cd ..
