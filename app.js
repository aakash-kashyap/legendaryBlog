//======Setup=======
var express          = require("express"),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride   = require("method-override"),
    app              = express();
    
// mongoose.connect("mongodb://localhost/blog_app");  //connect to the DB
mongoose.connect("mongodb://aakash:dbpswd@ds137271.mlab.com:37271/blog_mongodb");  //connect to the DB
app.set("view engine", "ejs");  
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

//======DB Schema============
var blogSchema = new mongoose.Schema({
       title: String,
    //   image: String,
      image: {type: String, default: "https://nonprofitorgs.files.wordpress.com/2010/07/blog.jpg" },
       body:  String,
       created:  {type: Date, default: Date.now }
    });
    
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://nonprofitorgs.files.wordpress.com/2010/07/blog.jpg",
//     body: "Hello this is test blog post!"
// });

//=========Routes============

app.get("/",function(req, res){
    res.redirect("/blogs");
});


//---------index_route------
app.get("/blogs",function(req, res){
    
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("Error");
       } 
       else{
        //   console.log(blogs);
           res.render("index",{ blogs: blogs});
       }
    });
});


//--------New_route---------
app.get("/blogs/new",function(req,res){
    res.render("new");
})

//=======Create_route======
app.post("/blogs",function(req,res){
    //create new blog
    req.body.blog.body = req.sanitize(req.body.blog.body); 
    Blog.create(req.body.blog, function(err,newBlog){
     if(err){
         res.render("new");
     }
     else{
         //redirects to the index
         res.redirect("/blogs")
     }
    });
});

//=======Show Route===========
app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog: foundBlog});
        }
    });
});

//-------Edit Route-------

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id, function(err, editBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog: editBlog});
        }
    });
});

//------Update Route-------
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    });  
});


//--------Delete Rooute------------
app.delete("/blogs/:id", function(req,res){
        //destroy blog
        
        Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err){
            if(err){
                res.redirect("/blogs");
            }
            else{
                //redirect to home page
                res.redirect("/blogs");
            }
    });  
        
});

//========Start Server========

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening...");
});