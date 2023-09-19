const ApiDoc = new Map();

module.exports = {
    
    Set: function(docs){

        ApiDoc.clear();
        for (const doc of docs){
            ApiDoc.set(doc.name, doc);
        }

    },
    Get: function(plataform){
        
        if(plataform)
            return ApiDoc.get(plataform);
        else
            return ApiDoc
    }

}

