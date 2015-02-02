console.log("loading Site Controller");
SiteCtrl = function(){
	this.prototype.init = function(data){
		if(data.id){
			console.log("loading site "+data.id);
		}
		else{
			console.log("new site");
		}
	}
}