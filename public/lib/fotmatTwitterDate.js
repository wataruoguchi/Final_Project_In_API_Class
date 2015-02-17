// input 'created_at' Twitter stamp Tue Apr 07 22:52:51 +0000 2009
// output date/time relative to now
var formatTwitterDate = function (stamp) {
	var date = new Date(stamp),
		secDiff = (((new Date()).getTime() - date.getTime()) / 1000),
		dayDiff = Math.floor(secDiff / 86400);

	if ( isNaN(dayDiff) || dayDiff < 0 ) {
		return;
	}

	var lessThanDay = (
		(secDiff < 60 && "just now") ||
		(secDiff < 120 && "1 minute ago") ||
		(secDiff < 3600 && Math.floor( secDiff / 60 ).toString() + " minutes ago") ||
		(secDiff < 7200 && "1 hour ago") ||
		(secDiff < 86400 && Math.floor( secDiff / 3600 ).toString() + " hours ago")
	);

	return (dayDiff === 0 && lessThanDay) ||
		(dayDiff === 1 && "Yesterday") ||
		(dayDiff < 7 && dayDiff.toString() + " days ago") ||
		(dayDiff < 31 && Math.ceil( dayDiff / 7 ).toString() + " weeks ago"); // WARNING only 1 month supported
};