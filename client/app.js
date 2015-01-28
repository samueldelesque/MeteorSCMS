(function(window){
	window.SCMS = {
		client:{
			isAuthenticated:function(){return false;}
		},
		hasDropbox:false,
		hasCss:false,
		Router: Router,
		sites:[],
		pages:[]
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
		SCMS.doLogin = function(){
			if(SCMS.client.isAuthenticated()){Router.go("control/admin");return;}
			else{console.log("Please login to Dropbox to edit your site.");}
		}
		if(!SCMS.hasDropbox){$.getScript("//cdnjs.cloudflare.com/ajax/libs/dropbox.js/0.10.2/dropbox.min.js",function(){
			SCMS.client = new Dropbox.Client({ key: "vwqq4d1vd1802l2" });
			SCMS.hasDropbox = true;
			SCMS.doLogin();
		});}
		else{SCMS.doLogin();}
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

	Router.route('control/admin',function(){
		var s = this;
		if(!SCMS.client.isAuthenticated()||!SCMS.hasDropbox){Router.go("control/login");return;}
		else{console.log("You are now connected!");}
		s.render("admin");
		SCMS.client.readdir(window.location.hostname,function(error,entries){
			console.log("Read folder ",window.location.hostname,entries);
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
			Session.set("pages",SCMS.pages);
		});
	});
	Template.admin.helpers({
		sites: function(){
			return SCMS.sites;
		},
		pages: function(){
			return Session.get("pages")
		},
	});
})(window);