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
	db.count(function(count){
	    app.locals.count = count;
	    res.render('index', {'count': app.locals.count});	    
	});
    });

    app.get('/search', function(req, res){
	var s = req.query.s;
	var p = req.query.p;
	var offset = 0;
	
	if (p && p > 0){
	    offset = (p - 1) * 10;
	}
	var opts = {limit: 10, offset: offset};
	db.search(s, offset, 10, function(results){
	    res.render('search', {'datas': results, 'keyword': s, 'page': p});
	});
	if (s){
	    if (app.locals.hots.length > 9999){
		app.locals.hots.shift();
	    }
	    app.locals.hots.push(s);
	}
    });

    app.get('/hash/\\w{40}', function(req, res){
	var hash = req.url.substr(6, 40);
	db.get(hash, function(value){
	    var data = value;
	    if (data){
		var size = 0;
		if (data.length){
		    data.size = calculateSize(data.length);
		}
		if (data.files){
		    var files = data.files;
		    var total = 0;
		    for (var i=0; i<files.length; i++){
			files[i].size = calculateSize(files[i].length);
			total += files[i].length;
		    }
		    if (!data.size){
			data.size = calculateSize(total);
		    }
		}
	    }
	    res.render('detail', {'data' : data});
	});
    });
};
