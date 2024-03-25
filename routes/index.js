import sessionLocals from "./middleware/sessionlocals.js";
import adminsOnly from "./middleware/admin.js";

import login from "./users/login.js";
import register from "./users/registration.js";
import resetpassword from "./users/resetpassword.js";
import logout from "./users/logout.js";
import user_management from "./administration/users.js";


function route(app) {
    app.use("/", sessionLocals);
    app.use("/login", login);
    app.use("/register", register);
    app.use("/resetpassword", resetpassword);

    app.use("/logout", logout);


    app.use("/users", adminsOnly);
    app.use("/users", user_management);
    app.use("/configuration", adminsOnly);
    app.use("/", (req, res) => {
        res.redirect("/dashboard");
    });
}

export default route;