# Evernote dump

Dump your Evernote notebooks and notes to your computer. This project is currently under development process, in a very beta stage.

### Installation
You need to have git, node and npm installed on your computer.

1. Clone the repo: `git clone https://github.com/JoseMariaMoreno/evernote-dump.git`
2. Install the dependencies: `npm install`
3. Compile typescript: `npm run compile`
4. Run tests: `npm test`

### Execute

1. Get a developer token from your Evernote accound.
2. Create a json config file named config.json with this structure:
```
{
    "token": "your-developer-token",
    "dataPath": "where-you-want-to-dump-all-data"
}
```
4. Run `npm run dump` or `node js/dump.js`


9999