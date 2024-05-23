# Circles
----------
### Social Media website created using MERN Stack.

# Backend API points
--------------------
## /post points:
- / : retrieve all posts of people you are following. &lt;get request&gt;
- /user : get all posts created by the logged in user. &lt;get request&gt;
- /search : search for a post. &lt;get request&gt;
- /add : add post &lt;post request&gt;
- /delete/&lt;id&gt; : delete post with &lt;id&gt; &lt;post request&gt;
- /like/&lt;id&gt; : like a post with &lt;id&gt; &lt;get request&gt;
- /&lt;id&gt; : get details of post &lt;id&gt; &lt;get request&gt;

## /User points:
- /login : login user provides tokens &lt;post request&gt;
- /register : add user. &lt;post request&gt;
- /refreshtoken : get new access token using refresh token. &lt;post request&gt;
- /search : search for user &lt;post request&gt;
- / : get user data &lt;post request&gt;
- /changeemail : change email &lt;post request&gt;
- /changefullname : change fullname &lt;post request&gt;
- /changepassword : change password &lt;post request&gt;
- /follow/&lt;id&gt; : follow user &lt;get request&gt;
- /&lt;id&gt; : show user profile based on &lt;id&gt; &lt;get request&gt;
