1. Firstly run `npm run production-init-db` to initialize the database.
2. Then go to `mongodb atlas` to check that there are exactly 30 documents and 1 user.
3. Next run `npm run production` to launch the production server. 
4. A server is launched at `http://localhost:3000`
Demonstration State
1. Registration
    1. Create an account with username `nchen3`, email `nchen3@wpi.edu` and password `12345678`
    2. Then create an account with the same username and email `nchen3`, email `nchen3@wpi.edu` -> should receive an error
    3. Then create an account with invalid password 123 -> should receive an error
2. Login
   1. Login using nchen3 account
3. Products Page - Main
   1. Check favorite list (should be empty) and there should be 4 pages of results
   2. Favoite List is empty
   3. Each product displays the corresponding brand and type
4. Products Page - Filter
5. Product Detail page
   1. Show description and the gallery
   2. Check favorite button
6. Go back to Products Page - Check Filter list