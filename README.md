![screenshot](http://i.imgur.com/tzMaWv4.png)
<p align="center">
  <a href="https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/releases/download/v0.0.2-alpha/PikaBot-0.2-alpha-mac.zip"><img src="http://i.imgur.com/pRNJGt6.png"></a> 
  <a href="https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/releases/download/v0.0.2-alpha/PikaBot-0.2-alpha-win.zip"><img src="http://i.imgur.com/CSz91B9.png"></a>
</p>
# Pokemon GO Bot Desktop
**Development branch is not working for now, please be patient. You can download working 0.0.2 release.**

Desktop Pokemon GO Bot based on [PokemonGo-Bot](https://github.com/PokemonGoF/PokemonGo-Bot)  

Join us at #desktop-porting channel at [our slack chat](https://pokemongo-bot.herokuapp.com/)


## Warning
 - Just getting started, many things are not stable. Help is much appreciated
 - Currently no linux build. If someone with linux wants to work to try to package the application, that would be great
 - To Linux users: Many are having issues getting the bot running. As of right now, it does not seem to be supported, but it eventually will


## Installing from binaries
Extract the application from the .zip file for your platform.
Start the app and select the location of your `encrypt` file.

You can also rename and move the encrypt file to the `gofbot` folder inside the app (windows: `resources/app/gofbot/encrypt.dll` / OSX: `Resources/app/gofbot/encrypt.so`).

### Obtaining encrypt file
You can find the pre-compiled file for your platform [here](https://github.com/PokemonGoMap/PokemonGo-Map/tree/develop/pogom/libencrypt).

### Building encrypt yourself
Run  
```
wget http://pgoapi.com/pgoencrypt.tar.gz && tar -xf pgoencrypt.tar.gz && cd pgoencrypt/src/ && make
```
Then copy `libencrypt.so` to the `gofbot` folder and rename to encrypt.so

## FAQ
Refer to [this issue](https://github.com/PokemonGoF/PokemonGo-Bot-Desktop/issues/138).

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

*Don't forget to add yourself when doing PR*

## Credits
[PokemonGo-DesktopMap](https://github.com/mchristopher/PokemonGo-DesktopMap) Amazing job done by  Mike Christopher

## Disclaimer
©2016 Niantic, Inc. ©2016 Pokémon. ©1995–2016 Nintendo / Creatures Inc. / GAME FREAK inc. © 2016 Pokémon/Nintendo Pokémon and Pokémon character names are trademarks of Nintendo. The Google Maps Pin is a trademark of Google Inc. and the trade dress in the product design is a trademark of Google Inc. under license to The Pokémon Company. Other trademarks are the property of their respective owners.
[Privacy Policy](http://www.pokemon.com/us/privacy-policy/)

[PokemonGo-Bot](https://github.com/PokemonGoF/PokemonGo-Bot) is intended for academic purposes and should not be used to play the game *PokemonGo* as it violates the TOS and is unfair to the community. Use the bot **at your own risk**.

[PokemonGoF](https://github.com/PokemonGoF) does not support the use of 3rd party apps or apps that violate the TOS.

## Licensing
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
©2016 X Consortium

[![Analytics](https://ga-beacon.appspot.com/UA-81468120-1/desktop-welcome-page)](https://github.com/igrigorik/ga-beacon)
