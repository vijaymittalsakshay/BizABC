(function (global,$) {
    
    var MatchespageViewModel,
    app = global.app = global.app || {};
    MatchespageViewModel = kendo.observable({
       Matches : [],
       getMatches: function () {
       app.loginService.viewModel.showloder();
        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: "https://www.biz2services.com/mobapp/api/user/",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userdashboard",userid:localStorage.getItem("userID")} // search for tweets that contain "html5"
                }
            },
            schema: {
                data: function(data)
                {
                    
                	return [data['results']['data']['loan']['matchrows']];
                }
            },
            error: function (e) {
                	apps.hideLoading();
                	navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                	function () { }, "Notification", 'OK');
                },
        });
        dataSource.fetch(function(){
            var that = this;
            var data = that.data();
            MatchespageViewModel.setMatches(data);
         });
        	   
        },    
        setMatches: function(data)
           { 
               var that = this;
               that.set("Matches", data['0']);
               app.loginService.viewModel.hideloder();
           },
     
   
    });
$.extend(window, {

		MatchespageViewModel: MatchespageViewModel
	});
    
})(window,jQuery);