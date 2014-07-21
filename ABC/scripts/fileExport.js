(function (global,$) {
    var fileExportViewModel,
        app = global.app = global.app || {};

    fileExportViewModel = kendo.data.ObservableObject.extend({
        expDocs:[],
        historyPath:[],
        exportInnerPage:false,
        filedocumentShow:function(e)
        {
            app.fileexportsetting.viewModel.historyPath=[];
            app.fileexportsetting.viewModel.getFileSystem();
        },
        getFileSystem:function()
        {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                function(fileSystem){ // success get file system
               	 root = fileSystem.root;
                	app.fileexportsetting.viewModel.listDir(root);
                }, 
                function(evt){ // error get file system
                	console.log("File System Error: "+evt.target.error.code);
                }
            );		
        },
        listDir:function(directoryEntry){
            if(app.fileexportsetting.viewModel.historyPath[app.fileexportsetting.viewModel.historyPath.length-1] !== directoryEntry.name){
            	app.fileexportsetting.viewModel.historyPath.push(directoryEntry.name);
            }
            if(typeof $("#dirContent").data("kendoMobileListView") !=='undefined')
            {
            	$("#dirContent").data("kendoMobileListView").destroy();
            }
            app.loginService.viewModel.showloder(); // show loading message
            currentDir = directoryEntry; // set current directory
            directoryEntry.getParent(function(par){ // success get parent
            parentDir = par; // set parent directory
            	if( currentDir.name === root.name) app.fileexportsetting.viewModel.setExportRootPage();
            	}, function(error){ // error get parent
            		console.log('Get parent error: '+error.code);
            	});

            var directoryReader = directoryEntry.createReader();
            directoryReader.readEntries(function(entries){
            var dirContent = $('#dirContent');
            dirContent.empty();
            var dirArr = new Array();
            for(var i=0; i<entries.length; ++i){ // sort entries
            	var entry = entries[i];
            	if( entry.isDirectory && entry.name[0] !== '.' ) dirArr.push(entry);
            }
            app.fileexportsetting.viewModel.setExportDocs(dirArr);
            app.loginService.viewModel.hideloder(); // hide loading message
            }, function(error){
            	console.log('listDir readEntries error: '+error.code);

            });
        },
        getActiveItem:function(name)
        {   
            activeItem ='';
            if(currentDir !== null ){
                currentDir.getDirectory(name, {create:false},
                    function(dir){ // success find directory
                    	activeItem = dir;
                        app.fileexportsetting.viewModel.listDir(activeItem);
                    }, 
                    function(error){ // error find directory
                    	console.log('Unable to find directory: '+error.code);
                    }
                );
            }
 
        },
		getActivePitem:function(name)
        {   
            activePitem ='';
            if(currentDir !== null ){
                currentDir.getParent(name, {create:false},
                    function(dir){ // success find directory
                    	activePitem = dir;
                        app.fileexportsetting.viewModel.listDir(activePitem);
                    }, 
                    function(error){ // error find directory
                    	console.log('Unable to find directory: '+error.code);
                    }
                );
            }
 
        },
        setExportDocs:function(data)
        {
            var that = this;
            that.set("expDocs", data);
            $("#dirContent").kendoMobileListView({
                dataSource: app.fileexportsetting.viewModel.expDocs,
                template: $("#docs-export-template").html(),
                }).kendoTouch({ 
                	filter: ">li",
                  	tap: function (e) { 

						app.fileexportsetting.viewModel.setExportInnerPage();
						app.fileexportsetting.viewModel.getActiveItem(e.touch.initialTouch.innerText);
                	},
                
            });
            $("#tabstrip-file-export").find(".km-scroll-container").css("-webkit-transform", "");
        },
        backDocslistPage:function(e)
        {
            apps.navigate('views/documents.html?parent='+app.documentsetting.viewModel.parentId); 
        },
        gobackFileExportPage:function(e)
        {
             app.fileexportsetting.viewModel.historyPath.pop(currentDir.name);
             app.fileexportsetting.viewModel.listDir(parentDir);
        },
        
        thisFileExport:function(e)
        {
           
            app.fileexportsetting.viewModel.historyPath.shift();
            fileName =  $.trim(sessionStorage.getItem("currentFileName"));
            filePath = currentDir.fullPath + "\/" + fileName;
            ext = app.documentsetting.viewModel.getFileExtension(fileName);
            $("#tabstrip-download-file").data("kendoMobileModalView").open();
            downloadLink = sessionStorage.getItem("downloadLink");
            $('.download-file-name').html('');
        	$('.download-file-name').append('<div class="'+ext+'">'+fileName+'</div>');
            uri=encodeURI(downloadLink); 
            app.fileexportsetting.viewModel.exportFile(uri,filePath); 

        },
        setExportInnerPage:function()
        {
            var that = this;
            that.set("exportInnerPage", true);  
        },
        setExportRootPage:function()
        {
            var that = this;
            that.set("exportInnerPage", false);  
        },
        exportFile: function (uri, filePath) {
            transfer = new FileTransfer();
            transfer.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                   
                	var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                	$('#status').innerHTML = perc + "% loaded...";
                } else {
                	if($('#status').innerHTML === "") {
                       
                		$('#status').innerHTML = "Loading";
                	} else {
                        
                		$('#status').innerHTML += ".";
                	}
                }
            };
            transfer.download(
                uri,
                filePath,
                function(fileEntry) { 
                    $("#tabstrip-download-file").data("kendoMobileModalView").close();
                    navigator.notification.confirm('File exported successfully.', function (confirmed) {
                    if (confirmed === true || confirmed === 1) {
                    	apps.navigate('views/documents.html?parent='+app.documentsetting.viewModel.parentId);
                    }
                    }, 'Notification','OK');
                },
                function(error) {
                    app.documentsetting.viewModel.getFilesystem(
                		function(fileSystem) {
                			fileSystem.root.getFile(filePath, {create: false,exclusive:true},  app.documentsetting.viewModel.gotRemoveFileEntry,  navigator.notification.alert("Download process aborted",function () { }, "Notification", 'OK'));
                		},
                		function() {
                			console.log("failed to get filesystem");
                		}
            		);
                    
                }
            );
            
        },
        
    });
    app.fileexportsetting = {
        
		viewModel: new fileExportViewModel(),     	
    };
 
})(window,jQuery);