
# Simple NodeJS TaskPoster app (Backend) created by AdonisJS Framework 

# Purpose 
This Version of App is just created for testing purposes,
some templates are created, but disabled in code



# Adonis fullstack application
This is the fullstack boilerplate for AdonisJs, it comes pre-configured with.

1. Bodyparser
2. Session
3. Authentication
4. Web security middleware
5. CORS
6. Edge template engine
7. Lucid ORM
8. Migrations and seeds

## Setup

Use the adonis command to install the blueprint

```bash
adonis new yardstick
```

or manually clone the repo and then run `npm install`.


### Migrations

Run the following command to run startup migrations.

```js
adonis migration:run
```


#### Database and MailServer
app uses the mysql database and redis, make sure mysql and redis servers are running properly
and give the adequate credentials ( in a .env file just like the example provided in root directory
of the current project) 
config directory contains the detailed configuration of the components such 
as redis,mysql,bull ... tweak them with information of your own servers.

in order to test the app, the servers are set to run on localhost.
