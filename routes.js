'use strict';

function calculateSize(length){
    try{
	if (length > 1024 * 1024 * 1024)
	    return (length / (1024 * 1024 * 1024)).toFixed(2) + "GB";
	if (length > 1024 * 1024)
	    return (length / (1024 * 1024)).toFixed(2) + "MB";
	if (length > 1024)
	    return (length / (1024)).toFixed(2) + "KB";

	return length + "B";
    } catch(e){
	return;
    }
}

module.exports = function(app) {
    var db = app.locals.db;

    app.get('/', function(req, res){
	res.render('index', {'count': app.locals.count});
    });

    app.get('/search', function(req, res){
	var s = req.query.s;
	var p = req.query.p;
	var offset = 0;
	
	if (p && p > 0){
	    offset = (p - 1) * 10;
	}
	var opts = {limit: 10, offset: offset};
	db.searchStream(s, opts).toArray(function(results){
	    res.render('search', {'datas': results, 'keyword': s, 'page': p});
	});
	if (s){
	    if (app.locals.hots.length > 9999){
		app.locals.hots.shift();ls
	    }
	    app.locals.hots.push(s);
	}
    });

    app.get('/hash/\\w{40}', function(req, res){
	var hash = req.url.substr(6, 40);
	db.get(hash, function(err, value){
	    if (value){
		var size = 0;
		if (value.length){
		    value.size = calculateSize(value.length);
		}
		if (value.files){
		    var files = value.files;
		    var total = 0;
		    for (var i=0; i<files.length; i++){
			files[i].size = calculateSize(files[i].length);
			total += files[i].length;
		    }
		    if (!value.size){
			value.size = calculateSize(total);
		    }
		}
	    }
	    res.render('detail', {'data' : value});
	});
    });
};
