# Northcoders News API

### Link to trello board: https://trello.com/b/cDr18U3e/nc-news

## ENV files

To link Database files, create .env.test and .env.development files with the relevant database, as shown here:

PGDATABASE=database_name_here

Ensure these files are included in your .gitignore

## Run database

Execute the script in the terminal with 'npm run setup-dbs' 

Alternatively, run your PSQL file manually:

    psql -f db/setup.sql

