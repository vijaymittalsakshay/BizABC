(function (global,$) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
   
        isLoggedIn:(localStorage.getItem("isLoggedIn") === true) ?  true : false,
        username: "",
        password: "",
        email:"",
        name:"",
        forgotmail:"",
        validateUser:function()
        {
            var that = this,
            username = that.get("username").trim(),
            password = that.get("password").trim();
            if (username === "") {
                 navigator.notification.confirm('Please enter your username', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                	$('#loginusername').focus();
                }
                }, 'Notification','OK');

                return;
            }
            if (password === "") {
                 navigator.notification.confirm('Please enter your password', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                	$('#loginpassword').focus();
                }
                }, 'Notification','OK');

                return;
            }
            if(!window.connectionInfo.checkConnection()){
                    navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.loginService.viewModel.validateUser();
                	}

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else{
               
               that.userLogin();  
            }
           
        },
        userLogin: function () {
            var that = this;
            username = that.get("username").trim(),
            password = that.get("password").trim();
            that.showloder();
            var dataSource = new kendo.data.DataSource({
            transport: {
            read: {
                    url: "https://www.biz2services.com/mobapp/api/user",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"userlogin",userID:username,password:password} // search for tweets that contain "html5"
            }
            },
            schema: {
                data: function(data)
            	{
                	return [data];
            	}
            },
            error: function (e) {
           	  apps.hideLoading();
                 navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
            },

            });
            dataSource.fetch(function(){
                
            	var data = this.data();
            	if(data[0]['results']['faultcode'] === '1')
                {
                    that.setUserLogin(data[0]['results']['UserData']);
                }
                else{
                    that.hideloder();
                    localStorage.setItem("isLoggedIn",false);
                    navigator.notification.alert("Login failed. Invalid username/password",
                    function () { }, "Notification", 'OK');
                    return;
                }            
          
            });      
        },
       
        setUserLogin: function (userinfo) {
            var that = this;
            that.hideloder();
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("userFName",userinfo['userFName']);
            localStorage.setItem("userLName",userinfo['userLName']);
            localStorage.setItem("userID",userinfo['userID']);
            localStorage.setItem("userEmail",userinfo['userEmail']);
            localStorage.setItem("userMobile",userinfo['userMobile']);
            that.setSettingsPage();
            that.navigateHome();
        },
        
		
        setUserLogout: function () {
            var that = this;
            that.set("isLoggedIn", false);
            localStorage.setItem("isLoggedIn",false);
            localStorage.removeItem("userFName");
            localStorage.removeItem("userLName");
            localStorage.removeItem("userID");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userMobile");
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("userMobile");
            that.set("email", "");
            that.set("name", "");
            apps.navigate("#tabstrip-login");
            kendo.history.navigate("#tabstrip-login");
            that.clearForm();
            app.homesetting.viewModel.closeParentPopover();
            
        },
        navigateHome: function()
        {   
             apps.navigate("#tabstrip-home");
             kendo.history.navigate("#tabstrip-home");
        },
        clearForm: function () {
            var that = this;
            that.set("username", "");
            that.set("password", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode === 13) {
                $(e.target).blur();
                that.validateUser();
            }
        },
        showloder:function()
        {	apps.showLoading();
        },
        hideloder:function()
        {
            apps.hideLoading();
        },
        refreshHome:function()
        {
           
           
            if(!window.connectionInfo.checkConnection()){
               
                navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
            	if (confirmed === true || confirmed === 1) {
                   
            		app.loginService.viewModel.refreshHome();
            	}

            	}, 'Connection Error?', 'Retry,Cancel');
            }
            else
            { 
               app.homesetting.viewModel.homeShow(); 
            }
             app.homesetting.viewModel.closeParentPopover();
        },
        
        onSettingPage:function(e)
        {	apps.navigate('#tabstrip-Setting');
             app.homesetting.viewModel.closeParentPopover();
            
        },
        setSettingsPage:function()
        {
 
            var that = this;
            that.set("email", localStorage.getItem("userEmail"));
            that.set("name", localStorage.getItem("userFName")+' '+localStorage.getItem("userLName"));
        },
        mobileNotification:function(msg,status)
        {
            var toast =window.plugins.toast;
            var message =msg;
            toast.showLongBottom(message,
                function(downmsg){
                    //navigator.notification.alert(downmsg);
                }, 
                function(downerr){
                    //navigator.notification.alert(downerr);
                }
            );
        },
        
        forgotMailSend:function()
        {
            var that = this,
            forgotmail = that.get("forgotmail").trim();
            
            
            if (forgotmail === "") {
                navigator.notification.confirm('Please enter your email!.', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                	$('#forgotpassfield').focus();
                }
                }, 'Notification','OK');

                return;
            }
            if (!app.loginService.viewModel.validateEmailId(forgotmail)) {
                 navigator.notification.confirm('Please enter a valid email address.', function (confirmed) {
                if (confirmed === true || confirmed === 1) {
                	$('#forgotpassfield').focus();
                }
                }, 'Notification','OK');

                return;
            }

            if(!window.connectionInfo.checkConnection()){
                    navigator.notification.confirm('No Active Connection Found.', function (confirmed) {
                	if (confirmed === true || confirmed === 1) {
                		app.loginService.viewModel.forgotMailSend();
                	}

                }, 'Connection Error?', 'Retry,Cancel');
            }
            else{

            that.showloder();
            var dataSource = new kendo.data.DataSource({
            transport: {
            read: {
                    url: "https://www.biz2services.com/mobapp/api/user",
                    type:"POST",
                    dataType: "json", // "jsonp" is required for cross-domain requests; use "json" for same-domain requests
                    data: { apiaction:"forgotpassword",useremail:forgotmail} // search for tweets that contain "html5"
            }
            },
            schema: {
                data: function(data)
            	{
                	return [data];
            	}
            },
            error: function (e) {
           	  apps.hideLoading();
                 navigator.notification.alert("Server not responding properly.Please check your internet connection.",
                    function () { }, "Notification", 'OK');
            },

            });
            dataSource.fetch(function(){
                
            	var data = this.data();
                that.hideloder();
            	if(data[0]['results']['faultcode'] === 1)
                {
                	$msg= "New password has been created and sent successfully to your email account.";
                    app.loginService.viewModel.mobileNotification($msg,'info');
                    apps.navigate("#tabstrip-login");
                    kendo.history.navigate("#tabstrip-login");
                    that.clearForm();
                }
                else if(data[0]['results']['faultcode'] === 2){
                    navigator.notification.alert("Sorry, this email id does not match with any user record.",
                    function () { }, "Notification", 'OK');
                    return;
                }
                else
                {

                    return;
                }
            });    
            }
           
        },
        initSetForgotPage:function()
        {
			app.loginService.viewModel.setForgotMail();
            
            
        },
        setForgotMail:function()
        {
            var that = this;
			that.set("forgotmail",""); 
        },
        validateEmailId:function(email)
        {
            var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (filter.test(email)) {
            	return true;
            }
            else {
           	 return false;
            }
        },
        checkEnterForForgot: function (e) {
            var that = this;

            if (e.keyCode === 13) {
                $(e.target).blur();
                that.forgotMailSend();
            }
        },
        
    });
    
    app.loginService = {
        viewModel: new LoginViewModel()	
    };
})(window,jQuery);