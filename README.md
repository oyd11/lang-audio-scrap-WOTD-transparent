
== Installation ==
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

=== what is it? ===
The script loops dates, and downloads XML's from urls like:
```
curl https://wotd.transparent.com/rss/11-27-2017-swedish-widget.xml
```
(as seen as request in the chrome 'inspect' lane when choosing a date)

Then - the script downloads the linked .mp3 files (daily sentences) (using cURL)

It's the audio material presented in https://wotd.transparent.com / https://www.transparent.com/word-of-the-day/ 

There's a translation table of human readable language names to the names of the XML's urls.

=== Next steps ===

- speech-synth source (english) sentence, and make playlists with everything

=== current language list ===
Arabic
Balinese
Balinese for Indonesian Speakers
Chinese
Dari
Dutch
English for Portuguese Speakers
English for Spanish Speakers
Esperanto
French
German
Hebrew
Hindi
Indonesian
Irish
Italian
Japanese
Korean
Latin
Norwegian
Pashto
Polish
Portuguese
Russian
Spanish
Swedish
Turkish
Urdu





