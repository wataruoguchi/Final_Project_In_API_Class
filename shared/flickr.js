// shared/flickr.js
// Input[] should be Flickr's photo details including server, secret, farm
// Output[] is the full JPG web address
var createJpgPath = function (photos) {
	var i,
		photo,
		photoSrc = [],
		len = photos.length;
	for (i = 0; i < len; i++) {
		photo = photos[i];
		// https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
		photoSrc.push("https://farm" + photo.farm + ".staticflickr.com/" + photo.server + "/" + photo.id + "_" + photo.secret + ".jpg");
	}
	return photoSrc;
};

if (typeof module !== "undefined") {
	module.exports.createJpgPath = createJpgPath;
}