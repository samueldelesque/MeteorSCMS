// var fs    = Meteor.npmRequire('fs');
// var TreeParser = function(){
// 	var pages = {};
// 	this.read = function(dir,callback){
// 		fs.readdir(dir,function(e,folders){
// 			if(e){
// 				callback("Failed to read directory!",{});
// 				console.error("Failed to read directory!",e);
// 				return;
// 			}
// 			var ignore = [".DS_Store","css","meta.txt"];
// 			var pending = folders.length;
// 			folders.forEach(function(el,i){
// 				if(ignore.indexOf(el) > -1){
// 					pending--;
// 					return;
// 				}
// 				pages[el] = {
// 					title:el,
// 					description:null,
// 					content:[]
// 				};
// 				fs.readdir(dir+"/"+el,function(e,files){
// 					files.forEach(function(fi,i){
// 						if(fi == "meta.txt"){
// 							pending++;
// 							fs.readFile(dir+"/"+el+"/"+fi, 'utf8', function(err,data){
// 								if(err){
// 									callback("Failed to read "+el+" meta data!",{});
// 									return;
// 								}
// 								var attributes = data.split("\n");
// 								attributes.forEach(function(attr){
// 									var parts = attr.split(":");
// 									pages[el][parts[0].trim()] = parts[1].trim();
// 								});
// 								pending--;
// 								if(pending==0){
// 									callback(false,pages);
// 								}
// 							});
// 						}
// 						if(ignore.indexOf(fi) > -1)return;
// 						var p = fi.split(".");
// 						if(p.length > 1){
// 							var ext = p.pop();
// 							var t = p.join(".").split("-");
// 							if(t.length > 0)t.shift()
// 							var title = t.join("-");
// 							switch(ext){
// 								case "jpg":
// 								case "png":
// 								case "gif":
// 									pages[el].content.push({title:title,type:"img",path:el+"/"+fi});
// 								break;

// 								case "txt":
// 									pages[el].content.push({title:title,type:"txt",path:el+"/"+fi});
// 								break;

// 								default:
// 									console.log(fi+" was not a recognized filetype.");
// 								break;
// 							}
// 						}
// 						else{
// 							console.log(fi+" was not a recognized filetype.");
// 						}
// 					});
// 					pending--;
// 					if(pending==0){
// 						callback(false,pages);
// 					}
// 				});
// 			});
// 		});
// 	}
// }

// module.exports = new TreeParser();