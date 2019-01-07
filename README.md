# amorphic-starter-app

A simple Notes app using amorphic with an angular frontend

This application also utilizes an AmorphicSerializer and AmorphicDeserializer to serialize the Supertype/Amorphic objects into JSON from the amorphic side and then deserialize those objects on the angular front end into POJOs (plain javascript objects).

By default the angular app runs on `localhost:4200`. The daemon runs on `localhost:3001`

It's necessary to install redis. Please use brew (Homebrew) to install.

Also npm needs to be installed on your machine.

1. Create a Postgres DB amorphic_notes with role nodejs and password nodejs
    `CREATE ROLE nodejs WITH LOGIN PASSWORD 'nodejs'`
    `ALTER USER nodejs CREATEDB`
    `create database amorphic_notes owner nodejs`
2. run `npm install` in both `./angular-client` and `./angular-daemon`
3. run `npm start` in `./angular-client/` to run the angular front end
4. run redis-server
5. run `npm run compile` in `./angular-daemon/` to compile to the `./angular-daemon/dist/` 
6. run `npm run copyStatics` in `./angular-daemon/` to copy over static files and metadata
7. run `npm start` in `./angular-daemon/` to start the daemon app

You can lint the projects by cd'ing into each application, and after npm installing, running
the `npm run lint` command.

You can run the unit tests in the daemon app by running the `npm test` command within `angular-daemon`. 
You can run coverage by running `npm run coverage` within `angular-daemon`