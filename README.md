
# 'Say' script on MacOS:
requires:
 * 'say' (macos util)
 * 'sox'

 example runs:
 ```
 julia transparent-say-lang.jl swedish 14
 julia transparent-say-lang.jl italian
 julia transparent-say-lang.jl japanese end
 julia transparent-say-lang.jl spanish rand

 ```

# html version:
```
open ./transparent-html/all.html
```
# scrap scripts:


## Installation
Required installations: (tested on macos, should work on any un\*x)
```
cURL
node.js + npm
```

clone this repo,
```
npm install
node ./date-iterate.js
```

### what is it?
The script loops dates, and downloads XML's from urls like:
```
curl https://wotd.transparent.com/rss/11-27-2017-swedish-widget.xml
```
(as seen as request in the chrome 'inspect' lane when choosing a date)

Then - the script downloads the linked .mp3 files (daily sentences) (using cURL)

It's the audio material presented in https://wotd.transparent.com / https://www.transparent.com/word-of-the-day/

There's a translation table of human readable language names to the names of the XML's urls.

This could be a bunch of bash/awk/grep lines, but I've decided to try node.js for it for having a clean date iterator. npm is easy to search, etc. I see now it's also easy with gnu-`date`, anyhow, this already runs, and can keep the rest of the steps in the same framework.
```
d=2017-01-01
d=$(date -I -d "$d + 1 day") # etc etc
 ```

 never liked writing Bash scripts, might be a good task to try Closh-clojure-shell, but couldn't get it installed.

### Next steps  (TODO)

 * script should check for existing files before downloading, to allow monthly update/etc
 * find earliest date per language
 * speech-synth source (english) sentence
 * Makefile
 * with/without audio d/l option
 * make playlists with everything
 * make spaced repetition playlists
 * similar for innovative-language WOTD
 * spaced rep for 50langs + dliflc (free resources)

### current language list
* arabic
* balinese
* balinese for indonesian speakers
* chinese
* dari
* dutch
* english for portuguese speakers
* english for spanish speakers
* esperanto
* french
* german
* hebrew
* hindi
* indonesian
* irish
* italian
* japanese
* korean
* latin
* norwegian
* pashto
* polish
* portuguese
* russian
* spanish
* swedish
* turkish
* urdu



### thanks:

@quatrix for the chrome-webkid innitiation
