const UsersApi = new Map();

module.exports = {

    Set: function(users) {

        UsersApi.clear();
        for (const user of users){
            UsersApi.set(user.plataform, user);
        }

    },

    Get:  function() {
        return UsersApi
    }

} 