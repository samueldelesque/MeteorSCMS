window.SCMS = {
	client:{
		isAuthenticated:function(){return false;}
	},
	hasDropbox:false,
	site:-1,
	hasCss:false,
	pages:[]
};

var sites = new Mongo.Collection("sites");

Router.route('/', function () {
  this.render('home');
});

sites.findOne({url:window.location.hostname},function(error,cursor){
	if(error){alert("Failed to retrieve site.");}
	cursor.toArray(function(data){console.log(data);});
});
setTimeout(function(){
	console.log("Sites:",sites.find().fetch());
},500);
 
if(SCMS.site === undefined){
	console.log("Inserting site.");
	sites.insert({
		createdBy: Meteor.userId(),
		createdAt: new Date(),
		url: window.location.hostname,
		pages: {},
		template: ""
	});
}

setTimeout(function(){
	console.log("Current Site:",sites.findOne({url:window.location.hostname}));
},500);

SCMS.doLogin = function(){
	if(Session.get("isadmin")){
		Router.go("control/admin");
		return;
	}
	else{console.log("Please login to Dropbox to edit your site.");}
}
SCMS.isAdmin = function(){
	return Session.get("isadmin");
}
if(!SCMS.hasDropbox){$.getScript("//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js",function(){
	SCMS.client = new Dropbox.Client({ key: "vwqq4d1vd1802l2" });
	SCMS.hasDropbox = true;
	setTimeout(function(){
		SCMS.client.authenticate(function(error, client){
			if(error){alert("Login Failed.");console.error(error);return;}
			Session.set("isadmin",SCMS.client.isAuthenticated());
		});
		SCMS.doLogin();
	},100);
});}

Router.route('contact', function () {
  this.render('contact');
});

Router.route('control', function(){
	console.log("Welcome.");
	Router.go("control/login");
});

Router.route('control/login', function(){
	console.log("Logging in.");
	if(SCMS.isAdmin()){Router.go("control/admin");return;}
	this.render('login');
});

Template.login.events({
	"click #connectDropbox": function (event, template) {
		event.preventDefault();
		SCMS.client.authenticate(function(error, client){
			if(error){alert("Login Failed.");console.error(error);return;}
			SCMS.doLogin();
		});
	}
});

Router.route('control/create',function(){
	var s = this;
	if(!SCMS.isAdmin()){Router.go("control/login");return;}
	s.render("create");
	SCMS.client.readdir(window.location.hostname,{},function(error,entries){
		if(error){alert("Could not retrieve files");return}
		$.each(entries,function(i,e){
			switch(e){
				case "css":
					SCMS.hasCss = true;
				break;

				default:
					SCMS.pages.push(e);
				break;
			}
		});
		// SCMS.site.update({"pages":SCMS.pages});
		Session.set("pages",SCMS.pages);
	});
});

Router.route('control/admin',function(){
	var s = this;
	if(!SCMS.isAdmin()){Router.go("control/login");return;}
	s.render("admin");
	SCMS.client.readdir(window.location.hostname,{},function(error,entries){
		if(error){alert("Could not retrieve files");return}
		$.each(entries,function(i,e){
			switch(e){
				case "css":
					SCMS.hasCss = true;
				break;

				default:
					SCMS.pages.push(e);
				break;
			}
		});
		// SCMS.site.update({"pages":SCMS.pages});
		Session.set("pages",SCMS.pages);
	});
});

Template.admin.helpers({
	sites: function(){
		return sites;
	},
	pages: function(){
		return Session.get("pages")
	},
});
