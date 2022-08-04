# Sarah's News API

### Link to hosted site : https://news-api-08-22.herokuapp.com/api/

## Project summary

A simple news API which allows users to view and interact with news articles, comments, topics and users. Endpoints allow users to get and query databases, post and delete comments, and update comment votes.
For full functionality descriptions please click the following link:

### https://news-api-08-22.herokuapp.com/api/

This project makes use of postgreSQL and node.js, view minimum version requirements [here](#version).

## Set-up

### Cloning

1. From the repo, select the clone button (Green 'Code')
2. Copy the command line, either HTTPS or SSH
3. In your terminal, navigate to your local directory where you want to clone the repo
4. In your terminal, type

```
git clone <clone_command_here>
```

5. Check you have linked to your new repo using

```
git remote -v
```

You should have a (fetch) and (pull) remote to your own github repo.
Fini!

### Install Dependencies

In the terminal, run:

```
npm install
```

You can view dependencies in the package.json file.

### Seed your local database

Execute the script in the terminal:

```
'npm run setup-dbs'
```

Alternatively, run your PSQL file manually:

```
psql -f db/setup.sql
```

### ENV files

To link Database files, create .env.test and .env.development files with the relevant database, as shown here:

```
PGDATABASE=database_name_here
```

Ensure these files are included in your .gitignore

## Version

Upon creation, this app is running on the following versions:

### Node.js = v18.4.0

To check your version, use this command:

```
node -v
```

### Postgres = 14.3

To check your version, use this command:

```
psql --version
```
