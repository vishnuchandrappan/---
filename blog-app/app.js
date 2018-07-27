var express = require('express'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    app = express();
mongoose.connect("mongodb://localhost/rest_blog");
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

const PORT = process.env.PORT;

var blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String,
  created:{type: Date,default:Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//   title:"Kozhi",
//   body:"യായപ്രതി കോപാലുഗോ കവീത്ര ഹമ്പസി വളവൊളി വിണ്ടി ചുമ്മാരേച്ചും കറ്റക്കൻ പലകുമും സുടുവിസ്താ മാര്‍ക്കിസര്‍ മാലിച്ചു സുമസി സുലോ കോസി. ശയചിവി ഹൈശി വാനിണേലം ദിഗോല്പ്പി തുംബി അമെത് ഹെയ്‌യാം ആഞ്ഞിളംഞ്ഞാഴിക്കുട അമെത്. കഞ്ചി ഘടോൽക്കനവ് അമു പൂപ്പകുമഗ്രി വൃനിമ ആബി ഡോണാല മാദരനു മൂട്ടാല തുംനേ ഉർണചം നിഗ്ഗലുണ്ടി സുണ്ടയാം പുഷ്യത്തെ കിവിളുടേഷ്. മദസ്തു ചക്വാ പിരഷ്മി കീഗ ചിച്ചുമ്മാ ഗോവൽ കിക്ടിവാ തിണതാനം പാടുമുടി. സാംനന്മാ വിരാദ വെളക്കിലി പാകതി ജപ്പാളി രബിജെസി ബലക്കോ ലേറി ആറേഞ്ച് ദസേ പുസത്തിനോക്കാൻ.",
//   image:"https://cdn.pixabay.com/photo/2016/11/23/00/39/animal-1851495_960_720.jpg"
// });

app.get("/",function (req,res){
  res.redirect("/blogs")
});
app.get('/blogs',function(req,res){
  Blog.find({}, function(err, blogs){
    if(err){
      console.log(err);
    }
    else{
      res.render('index',{blogs: blogs});
    }
  })
});

app.get("/blogs/new", function(req, res){
  res.render("new");
});
app.post("/blogs", function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err) {
      res.render("new");
    } else {
      res.redirect("blogs");
    }
  });
});

app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("show",{blog:foundBlog});
    }
  })
});

app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  });
})

app.put("/blogs/:id",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

app.delete("/blogs/:id",function(req,res){
  Blog.findByIdAndRemove(req.params.id,function(err){
    res.redirect("/blogs");
  })
})

app.listen(PORT, function(){
  console.log("server is listening ; port 3010");
});
