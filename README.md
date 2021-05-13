# loginsystem
A login an registration page made using nodejs, express, sql, and ejs


Created follow the this tutorial: https://www.youtube.com/watch?v=-RCnNyD0L-s 

Mongo Db connection made using: https://www.youtube.com/watch?v=bxsemcrY4gQ


Current issue:

if (!this._passport) { throw new Error('passport.initialize() middleware not in use'); }
                                 ^

Error: passport.initialize() middleware not in use
    at IncomingMessage.req.login.req.logIn (C:\Users\scott\Documents\OneDrive - Gonzaga University\Junior year\Server Project\loginsystem\node_modules\passport\lib\http\request.js:46:34)
    at Strategy.strategy.success (C:\Users\scott\Documents\OneDrive - Gonzaga University\Junior year\Server Project\loginsystem\node_modules\passport\lib\middleware\authenticate.js:253:13)
    at verified (C:\Users\scott\Documents\OneDrive - Gonzaga University\Junior year\Server Project\loginsystem\node_modules\passport-local\lib\strategy.js:83:10)
    at C:\Users\scott\Documents\OneDrive - Gonzaga University\Junior year\Server Project\loginsystem\server.js:164:20
