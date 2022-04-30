# Quanta Code Assessment

## Instructions

In your terminal, run:

```docker-compose up```

You should now have a local Postgres database running with three tables:

- company
- address
- loan

Now run:

```npm run dev```

You should see a table with some rows in it. There's just one problem -- the pagination is happening on the front end. We want it to be handled on the back end.

## Problems

- re-write the api endpoint

Under api/loans you should see the loans controller. Re-write it in such a way that it accepts "page" and "pageSize" in the query.
Manipulate your query so that these variables handle pagination.

You can use any ORM or SQL generator you would like.

- add a search

There is also a controlled textfield on the page. Can you pass this to the API as well to filter the data?

- bonus round

Can you add a rollup function to the SQL? For example, if you are viewing 5 loans on the page, can you show the sum of the loans amounts? How would you handle this in SQL?
