
# Oakwood Roleplay Gamemode

  
  # Disclaimer
  This resource is very early in development, it's nowhere near playable state. Consider it a dev resource.
  Contributions are welcome and much appreciated. 
  I encourage you to join [MafiaHub Discord](https://discord.com/invite/eBQ4QHX) if you're interested in this resource and/or Mafia game series as a whole. (Kalmar#2110)
  

## Quick Start


| Requirement | Link |
| ------ | ------ |
| Oakwood Server | https://releases.mafiahub.dev/ |
| Node.js | https://nodejs.org/ |

  
  

### 1. Clone this repository

```sh
$ git clone https://github.com/lukasz-sz96/Oakwood-Roleplay roleplay

$ cd roleplay
```

### 2. Install required dependencies

```sh
$ npm install

OR

$ yarn
```

### 3. Import oakwood.sql file to your MySQL database
### 4. Launch your Oakwood server
### 5. Launch the gamemode
```sh
$ node index.js
```


#
### To give yourself admin permissions:
1. Connect to the server, and register your character using `/register <password>` command.
2. Disconnect from the server.
3. Modify your character's rank in `users` table - `9` is the highest rank.
4. Reconnect to the server, login with `/login <password>`
#