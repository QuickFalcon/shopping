
UserApp.factory('setRequiredfieldCart',function setRequiredfieldCart($http, $q) { 

    return {

    'userCartRefresh': function(data,user_cart,index) {
     
       var defer = $q.defer();
     ///////////////////
        if (index != -9) // -1 means count full cart
        {

                for (var sikey in data.sites) {
                    for (var p = 0; p < user_cart.length; p++) {
                            for (var md5pro in data.sites[sikey].add_to_cart) {
                                // // fixed a site
                                // if(user_cart[p].productMD5==md5pro)
                                if (user_cart[p].chkout_url == data.sites[sikey].add_to_cart[md5pro].original_url) {
                                    user_cart[p].quantity = angular.copy(parseInt(data.sites[sikey].add_to_cart[md5pro].quantity));
                                    user_cart[p].required_field_values.quantity = user_cart[p].quantity;
                                }
                            }	// add to cart end
                            for (var md5prox in data.sites[sikey].failed_to_add_to_cart) {
                              
                                if (user_cart[p].chkout_url == data.sites[sikey].failed_to_add_to_cart[md5prox].original_url) {
                                    user_cart[p].quantity = angular.copy(parseInt(data.sites[sikey].failed_to_add_to_cart[md5prox].quantity));
                                    user_cart[p].required_field_values.quantity = user_cart[p].quantity;
                                }
                            }
                    }   // user profile end
                }
        }
        else // count item for wish list
        {
            for (var sikey in data.sites) {
                // fixed a site
                for (var p = 0; p < user_cart.length; p++) {
                        for (var md5pro in data.sites[sikey].add_to_cart) {
                            if (user_cart.chkout_url == data.sites[sikey].add_to_cart[md5pro].original_url) {
                                user_cart.quantity = angular.copy(parseInt(data.sites[sikey].add_to_cart[md5pro].required_field_values.quantity));
                                user_cart.required_field_values.quantity = user_cart.quantity;
                            }
                        }
                        for (var md5prox in data.sites[sikey].failed_to_add_to_cart) {
                            // if(user_cart[p].productMD5==md5pro)
                            if (user_cart.chkout_url == data.sites[sikey].failed_to_add_to_cart[md5prox].original_url) {
                                user_cart.quantity = angular.copy(parseInt(data.sites[sikey].failed_to_add_to_cart[md5prox].required_field_values.quantity));
                                user_cart.required_field_values.quantity = user_cart.quantity;
                            }
                        }
                    
                }
            }
        
		}
        
		
		////////////////
		defer.resolve(user_cart);
        return defer.promise;
        }


	};

 })// factory end 