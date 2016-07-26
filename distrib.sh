#!/bin/bash

find . -name "*.pyc" -delete

rm -fr PokemonGoMap-OSX.zip
node_modules/.bin/electron-packager . "GoF Bot" --platform=darwin --arch=x64 --icon=pokemon.icns --overwrite --prune --osx-sign.identity="Mac Developer: Mike Christopher (35938FGD4K)" --ignore=PokemonGoMap-Lin-x64.zip --ignore=PokemonGoMap-OSX.zip --ignore=PokemonGoMap-Win.zip --ignore=map/ve --ignore="map/Easy Setup" --ignore=distrib.sh --ignore=pywin --ignore=package_python.sh
cd "PGoF Bot-darwin-x64"
zip -9ryv ../PokemonGoMap-OSX.zip .
cd ..

rm -fr PokemonGoMap-Win.zip
node_modules/.bin/electron-packager . "GoF Bot" --platform=win32 --arch=ia32 --icon=pokemon.ico --overwrite --prune --ignore=map/ve --ignore=PokemonGoMap-Lin-x64.zip --ignore=PokemonGoMap-OSX.zip --ignore=PokemonGoMap-Win.zip --ignore="map/Easy Setup" --ignore=distrib.sh --ignore=package_python.sh
cd "GoF Bot-win32-ia32"
zip -9rv ../PokemonGoMap-Win.zip .
cd ..

rm -fr PokemonGoMap-Lin-x64.zip
node_modules/.bin/electron-packager . "GoF Bot" --platform=linux --arch=x64 --icon=pokemon.ico --overwrite --prune --ignore=map/ve --ignore=PokemonGoMap-Lin-x64.zip --ignore=PokemonGoMap-OSX.zip --ignore=PokemonGoMap-Win.zip --ignore="map/Easy Setup" --ignore=distrib.sh --ignore=package_python.sh --ignore=pywin
cd "GoF Bot-linux-x64"
zip -9ryv ../PokemonGoMap-Lin-x64.zip .
cd ..
