Sites = new Mongo.Collection("sites");
Meteor.subscribe("site");
Meteor.call("hostName",function(e,d){console.log(d,e);})

window._app = {
	DropbBoxClient:{
		isAuthenticated:function(){return false;}
	},
	hasDropbox:false,
	hasCss:false,
	host: window.location.hostname
};

Router.route('/', function () {
  this.render('home');
});

Router.route('contact', function () {
  this.render('contact');
});

Router.route('control', function(){
	console.log("Welcome.");
	Router.go("control/login");
});

Router.route('control/login', function(){
	_app.doLogin = function(){
		if(_app.DropbBoxClient.isAuthenticated()){Router.go("control/admin");return;}
		else{console.log("Please login to Dropbox to edit your site.");}
	}
	_app.authentificate = function (event, template) {
		console.log("Attempting login...");
		if(event)event.preventDefault()
		_app.DropbBoxClient.authenticate(function(error, client){
			if(error){alert("Login Failed.");console.error(error);return}
			else{console.log("Login succeeded.")}
			_app.doLogin();
		});
	}
	if(!_app.hasDropbox){$.getScript("//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js",function(){
		_app.DropbBoxClient = new Dropbox.Client({ key: "vwqq4d1vd1802l2" });
		_app.hasDropbox = true;
		setTimeout(_app.authentificate, 100);
	});}
	else{_app.doLogin();}
	this.render('login');
});
Template.login.events({
	"click #connectDropbox": _app.authentificate
});

Router.route('control/admin',function(){
	var s = this;
	if(!_app.DropbBoxClient.isAuthenticated()||!_app.hasDropbox){Router.go("control/login");return;}
	else{console.log("You are now connected!");}
	console.log("Rendering Admin");
	s.render("admin");

	_app.site = Sites.findOne({url:_app.host});
});

_app.updateSite = function(){
	_app.DropbBoxClient.readdir(_app.host,function(error,entries){
		if(error){alert("Could not retrieve files");return}
		console.log("Loading pages");
		_app.site.pages = [];
		$.each(entries,function(i,e){
			switch(e){
				case "css":
					_app.hasCss = true;
				break;

				default:
					_app.site.pages.push(e);
				break;
			}
		});
		Sites.update(_app.site._id,{$set:{"pages":_app.site.pages}});
		// Session.set("pages",_app.site.pages);
	});
}

Template.admin.helpers({
	pages: function(){
		return _app.site.pages
	},
});