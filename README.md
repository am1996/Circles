# Circles
----------
### Social Media website created using MERN Stack.

# Backend API points
--------------------
## /post points:
- /            : retrieve all posts of people you are following. <get request>
- /user        : get all posts created by the logged in user. <get request>
- /search      : search for a post. <get request>
- /add         : add post <post request>
- /delete/<id> : delete post with <id> <post request>
- /like/<id>   : like a post with <id> <get request>
- /<id>        : get details of post <id> <get request>

## /User points:
- /login       : login user provides tokens <post request>
- /register        : add user. <post request>
- /refreshtoken      : get new access token using refresh token. <post request>
- /search         : search for user <post request>
- / : get user data <id> <post request>
- /changeemail   : change email <post request>
- /changefullname        : change fullname <post request>
- /changepassword : change password <post request>
- /follow/<id> : follow user <get request>
- /<id> : show user profile based on <id> <get request>
