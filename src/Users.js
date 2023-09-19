const UsersApi = new Map();

module.exports = {

    Set: function(users) {

        UsersApi.clear();
        for (const user of users){
            UsersApi.set(user.plataform, user);
        }

    },

    Get:  function(plataform) {
        if(plataform)
            return UsersApi.get(plataform);
        else
            return UsersApi
    }

} 