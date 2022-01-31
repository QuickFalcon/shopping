angular.module('SSApp').directive('mailComponent', ['$http', '$route', '$routeParams', '$location', '$interval', 'Upload', 'UserService', 'toastr', function ($http, $route, $routeParams, $location, $interval, Upload, UserService, toastr) {
  return {
    restrict: 'E',
    templateUrl: 'assets/directive/components/mail/mailView.html',
    link: function (scope, element, attrs) {
      scope.setreceive = function (val) {
        scope.receive = val;
        if (val == 2) {
          $http.post('/getMySentMails').then(function (responseMail) {
            var arr = [];
            scope.mysentemail = responseMail.data;
            for (var k = 0; k < scope.mysentemail.length; k++) {
              arr.push(scope.mysentemail[k].catalogId);
              if (k + 1 == scope.mysentemail.length) {
                var multiID = { 'mid': arr };
                if (arr.length > 0) {
                  $http.post('/productUserMulticatalogID', multiID)
                    .success(function (data) {
                      for (var t = 0; t < scope.mysentemail.length; t++) {
                        for (var j = 0; j < data.product.length; j++) {

                          if (scope.mysentemail[t].catalogId == data.product[j].catalogId) {
                            scope.mysentemail[t].product = angular.copy(data.product[j]);
                          }
                        }
                      }
                    })
                    .error(function (err) {
                      console.log(" 10 number Error: " + err);
                    });
                }
              }
            }
          }, function (responseMail) {
            console.log(responseMail);
          })
        }
      }

      scope.setget = function (val) {
        scope.receive = val;
        if (val == 1) {
          $http.post('/getMyReceiveMails').then(function (responseMail) {
            var arr = [];
            scope.myreceivedemail = responseMail.data;
            for (var k = 0; k < scope.myreceivedemail.length; k++) {
              arr.push(scope.myreceivedemail[k].catalogId);
              if (k + 1 == scope.myreceivedemail.length) {
                var multiID = { 'mid': arr };
                if (arr.length > 0) {
                  $http.post('/productUserMulticatalogID', multiID)
                    .success(function (data) {
                      for (var t = 0; t < scope.myreceivedemail.length; t++) {
                        for (var j = 0; j < data.product.length; j++) {

                          if (scope.myreceivedemail[t].catalogId == data.product[j].catalogId) {
                            scope.myreceivedemail[t].product = angular.copy(data.product[j]);
                          }
                        }
                      }
                    })
                    .error(function (err) {
                      console.log(" 10 number Error: " + err);
                    });
                }
              }
            }
          }, function (responseMail) {
            console.log(responseMail);
          })
        }
      }

      scope.setget(1);
      scope.receive = 1;
      scope.changePhoto = changePhoto;

      scope.$parent.products = [];
      scope.$parent.addTobagPossible = true;
      scope.$parent.ck_all = true;
      scope.$parent.queryobj = {};
      scope.$parent.queryobj.multiId = angular.copy(scope.favCataloglist);
      scope.$parent.queryobj.sale_offer = true;
      scope.$parent.queryobj.collective = 'myfav';

      scope.queryobj.available = true;
      scope.$parent.stopclickInterval();
      scope.$parent.intervalgapGeneratelink(); // create link
      scope.$parent.twotap_coupon = [];
      var twotap_coupon_api_end = 'https://api.twotap.com/v1.0/coupons?private_token=0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24';
      var merchantname;
      var arrsiteid = [];
      scope.$parent.sitesTwotap = undefined;

      function opt() {
        var twotap_supported_site = 'https://api.twotap.com/v1.0/supported_sites?private_token=0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24';
        $http.post('/getSite', { storenamearray: scope.subscribe_stores_coupon }).then(function (responseSupportedSite) {
          var jsonObj = {};
          var temp;
          for (var i = 0; i < responseSupportedSite.data.length; i++) {
            temp = responseSupportedSite.data[i].id;
            merchantname = responseSupportedSite.data[i].merchant;
            jsonObj[temp] = responseSupportedSite.data[i];

            arrsiteid.push(temp);

            if (i + 1 == responseSupportedSite.data.length) {
              if (arrsiteid.length > 0) {
                scope.$parent.sitesTwotap = jsonObj;
                getcoup(arrsiteid);
              }
            }
          }
        }, function (err) {
          console.log(err);
        })
      }

      if (scope.loggedin == 1) {
        scope.datex = new Date();
        var data = { mailChecked: scope.datex }
        scope.$parent.update_uinfo(data);
      }

      if (scope.subscribe_stores_coupon.length > 0 && scope.loggedin == 1) {
        opt();
      }

      scope.deleteuserporfileMail = function (mkey, mailtype, purchaseId) {
        delete scope.$parent.mailObj[mkey];
        $http.post('/remove_user_order_email', { mailObj: scope.mailObj }).then(function (responseMail) {
        }, function (err) {
          console.log(err);
        })
      }

      scope.deletesentMail = function (id) {
        $http.post('/updateSentEmail', { id: id }).then(function (responseMail) {
          scope.setreceive(2);
        }, function (responseMail) {
          console.log(responseMail);
        })
      }

      function getcoup(siteidlist) {
        $http.post('/getUserCoupon', { subscribelist: scope.subscribe_stores_coupon, subscribesiteid: siteidlist }).then(function (responseMail) {
          scope.$parent.twotap_coupon = responseMail.data;
          console.log(responseMail.data);
        }, function (responseMail) {
          console.log(responseMail);
        })
      }

      scope.$parent.firsttime.loading = 1;
      scope.$parent.loadfull = true;
      function changePhoto(photo) {
        scope.userinfo.img_location = photo.img;
        toastr.success('Profile photo changed');
      }

      scope.remove_coupon_from_mylist = function (site_id, code) {
        $http.post('/addAvoidedCoupon', { site_id: site_id, code: code }).then(function (responseMail) {
          getcoup(arrsiteid);
        }, function (responseMail) {
          console.log(err);
        })
      }

      $http.post('/updateReadFlag').then(function (responseMail) {
        $http.post('/countunReadFlag')
          .success(function (data) {
            scope.$parent.undread_mails = data.count;
          })
      }, function (err) {
        console.log(err);
      })

      scope.deletereceiveMail = function (id) {
        $http.post('/delReceiveEmail', { id: id })
          .success(function (data) {
            scope.setget(1);
          })
      }

      scope.deleteUpreceiveMail = function (id) {

        $http.post('/updateReceiveEmail', { id: id })
          .success(function (data) {
            scope.setget(1);
          })
      }
      
      scope.update_flag = function (id) {
        $http.post('/updateReadFlagByid', { mailid: id }).then(function (responseMail) {
          $http.post('/countunReadFlag')
            .success(function (data) {
              scope.$parent.undread_mails = data.count;
            })
        }, function (err) {
          console.log(err);
        })
      }
    }
  };

}]);