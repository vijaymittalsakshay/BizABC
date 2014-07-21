(function (global) {
    var loanViewModal,
        app = global.app = global.app || {};

    loanViewModal = kendo.data.ObservableObject.extend({

   
    });
   
    app.loansetting = {
        viewModel: new loanViewModal()	
    };
})(window);
