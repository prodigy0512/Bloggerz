const expressSanitizer 	= require("express-sanitizer"),
			methodOverride 		= require("method-override"),
			bodyParser 				= require("body-parser"),
			mongoose 					= require("mongoose"),
			express 					= require("express"),
			logger 						= require("morgan"),
			moment						= require("moment"),
			app 							= express();

// App Config	
mongoose.connect("mongodb://localhost/restful_blog");
app.set("view engine","ejs");
app.use(express.static("views"));
app.set('views', __dirname + "/views");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(logger('dev'));

// Mongoose Model Config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: String, default: moment().format('LL')}
});
var Blog = mongoose.model("Blog", blogSchema);


// RESTful Routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});


// INDEX Route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR");
		} else{
			res.render("index", {blogs:blogs});
		}
	})
});


// CREATE Route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("ERROR");
		} else{
			res.redirect("/blogs");
		}
	})
});

// SHOW Route
app.get("/blogs/:id", function(req, res){
	Blog.findOne({_id: req.params.id}, function(err, foundBlog){
		if(err){
			console.log("Error");
		} else {
			res.render("show", {foundBlog:foundBlog});
		}
	})
});

// UPDATE Route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			console.log("ERROR!!!");
		} else {
			res.render("edit", {foundBlog:foundBlog});
		}
	});
});

app.put("/blogs/:id", function(req, res){
	req.body.foundBlog.body = req.sanitize(req.body.foundBlog.body);
	Blog.findOneAndUpdate({_id: req.params.id}, req.body.foundBlog, function(err, updatedBlog){
		if(err){
			console.log("ERROR!!!");
		} else {
			res.redirect("/blogs/"+req.params.id);
		}
	})
});

// DELETE Route
app.delete("/blogs/:id", function(req,res){
	Blog.deleteOne({_id: req.params.id}, function(err, obj){
		if(err){
			console.log("Error");
		} else {
			res.redirect("/blogs");
		}
	})
});


app.get("*", function(req, res){
	res.send("Error 404....Page not found");
});

app.listen(3000, function(){
	console.log("Port 3000");
});