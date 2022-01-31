////////////////////////// controller for mailcontroller bag page /////////////////////////////////////////////////////
SSApp.controller('mailController', ['$scope', '$http', '$route', '$routeParams', '$location', '$interval', 'Upload', 'UserService', 'toastr', function ($scope, $http, $route, $routeParams, $location, $interval, Upload, UserService, toastr) {


  //$http.defaults.headers.common['Authorization'] = '009e2fe3b0a2544726515c5da399498248ce0df098ec23233a788f20fefed596554f2048ec61f19daf4cfe907c18eb22d1a2b6f434498897a650f899928bfd1bab';
  //var url ="https://linksearch.api.cj.com/v2/link-search?website-id="+ $scope.cj_website_id+"&advertiser-ids=3011689&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20";

  // var url = "https://linksearch.api.cj.com/v2/link-search?callback=JSON_CALLBACK&website-id=" + $scope.cj_website_id + "&advertiser-ids=3011689&link-type=Text+Link&promotion-type=coupon&page-number=1&records-per-page=20";

  // $http.get('/cj_coupon/' + $scope.advertiser_ids)
  // // $http.get(url, { headers: { 'authorization':'00d9fb63e7cc3b9d1ca158074cb36009be6ecbb1251c703b229c1ac0a9fb98e08e27b2c1d49706565113db02afe9e4a4026eb0d204eabf439030685ff0be419b1f/00941c5e0bb817a16f3ca9c57bf63d812165c2fd808bcc2e421bf38989762cb016658dcba660f5c7d3bafa383ec6bca7f947c19983570cfb8754683086ac75c701"
  // // }
  // // })
  // .then(function (responseMail) {
  // console.log("Commission Junction success");
  // if (responseMail.status >= 200 && responseMail.status < 300) {

  // console.log(responseMail.data);
  // var mData = responseMail.data;

  // var x2js = new X2JS();
  // $scope.mailData = x2js.xml_str2json(mData);
  // //$scope.mailData = mData;

  // }
  // }, function errorCallback(responseMail) {
  // console.log("Commission Junction error");

  // console.log(responseMail);
  // })


  // calling linkshare api for getting coupons
  // var linkshare_url = "https://api.rakutenmarketing.com/coupon/1.0?category=1%7C3%7C4&network=1";

  // $http.get(linkshare_url, {
  // headers: {
  // "authorization": "Bearer 26ab1ed9bb684551aaccaeebe0b648"


  // }
  // }).then(function (responseMail) {

  // if (responseMail.status >= 200 && responseMail.status < 300) {

  // console.log("Linkshare success");

  // console.log(responseMail.data);


  // }

  // }, function errorCallback(responseMail) {

  // console.log("Linkshare error");
  // console.log(responseMail);
  // })

  // $scope.cancelit = function(obj) {


  // $(".popUp").visibility('hidden');
  // }    

  $scope.setreceive = function (val) {

    $scope.receive = val;
    if (val == 2) {

      $http.post('/getMySentMails').then(function (responseMail) {
        var arr = [];
        $scope.mysentemail = responseMail.data;
        for (var k = 0; k < $scope.mysentemail.length; k++) {

          arr.push($scope.mysentemail[k].catalogId);

          if (k + 1 == $scope.mysentemail.length) {

            var multiID = { 'mid': arr };
            if (arr.length > 0) {
              $http.post('/productUserMulticatalogID', multiID)
                .success(function (data) {


                  for (var t = 0; t < $scope.mysentemail.length; t++) {
                    for (var j = 0; j < data.product.length; j++) {

                      if ($scope.mysentemail[t].catalogId == data.product[j].catalogId) {
                        console.log(data);

                        $scope.mysentemail[t].product = angular.copy(data.product[j]);
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

        console.log("twotap api end ");
        console.log(responseMail);
      })



    }


  }


  $scope.setget = function (val) {

    $scope.receive = val;
    if (val == 1) {

      $http.post('/getMyReceiveMails').then(function (responseMail) {
        var arr = [];
        $scope.myreceivedemail = responseMail.data;
        for (var k = 0; k < $scope.myreceivedemail.length; k++) {

          arr.push($scope.myreceivedemail[k].catalogId);

          if (k + 1 == $scope.myreceivedemail.length) {

            var multiID = { 'mid': arr };
            if (arr.length > 0) {
              $http.post('/productUserMulticatalogID', multiID)
                .success(function (data) {


                  for (var t = 0; t < $scope.myreceivedemail.length; t++) {
                    for (var j = 0; j < data.product.length; j++) {

                      if ($scope.myreceivedemail[t].catalogId == data.product[j].catalogId) {
                        console.log(data);

                        $scope.myreceivedemail[t].product = angular.copy(data.product[j]);
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

        console.log("twotap api end ");
        console.log(responseMail);
      })



    }


  }

  $scope.setget(1);
  $scope.receive = 1;
  $scope.changePhoto = changePhoto;


  $scope.$parent.products = [];
  $scope.$parent.addTobagPossible = true;
  $scope.$parent.ck_all = true;
  $scope.$parent.queryobj = {};
  $scope.$parent.queryobj.multiId = angular.copy($scope.favCataloglist);
  $scope.$parent.queryobj.sale_offer = true;
  $scope.$parent.queryobj.collective = 'myfav';
  $scope.queryobj.available = true;

  $scope.$parent.stopclickInterval();
  $scope.$parent.intervalgapGeneratelink(); // create link
  $scope.$parent.twotap_coupon = [];



  var twotap_coupon_api_end = 'https://api.twotap.com/v1.0/coupons?private_token=0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24';
  //$http.get(twotap_coupon_api_end).then(function (responseMail) {


  var merchantname;
  var arrsiteid = [];

  $scope.$parent.sitesTwotap = undefined;

  function opt() {
    var twotap_supported_site = 'https://api.twotap.com/v1.0/supported_sites?private_token=0e3fbb72afd92529c4b521e5884d6857a1d05dd70cc9adbc24';
    //$http.get(twotap_supported_site).then(function (responseSupportedSite) {

    $http.post('/getSite', { storenamearray: $scope.subscribe_stores_coupon }).then(function (responseSupportedSite) {

      var jsonObj = {};



      var temp;
      for (var i = 0; i < responseSupportedSite.data.length; i++) {
        temp = responseSupportedSite.data[i].id;
        merchantname = responseSupportedSite.data[i].merchant;
        jsonObj[temp] = responseSupportedSite.data[i];

        arrsiteid.push(temp);

        if (i + 1 == responseSupportedSite.data.length) {
          if (arrsiteid.length > 0) {
            $scope.$parent.sitesTwotap = jsonObj;
            getcoup(arrsiteid);
          }


        }
      }



    }, function (err) {

      console.log(err);

    })

  }

  if ($scope.loggedin == 1) {

    $scope.datex = new Date();
    var data = { mailChecked: $scope.datex }
    $scope.$parent.update_uinfo(data);

  }
  if ($scope.subscribe_stores_coupon.length > 0 && $scope.loggedin == 1) {

    opt();

  }


  $scope.deleteuserporfileMail = function (mkey, mailtype, purchaseId) {
    /*  for(var j=0;j<$scope.mailObj.length;j++){
     
        for(tobj in $scope.mailObj[j]){
        	
        	
          if(tobj.purchaseId==purchaseId && tobj.mail_type==mailtype){
          	
             $scope.$parent.mailObj.splice(j,1);
          }
        }
        if(j+1==$scope.mailObj.length){
          $http.post('/remove_user_order_email',{ mailObj : $scope.mailObj }).then(function (responseMail) {
  
          console.log('success');
      	
        }, function(err) {
  
          console.log(err);
        })	
      	
      }
      
      } */

    delete $scope.$parent.mailObj[mkey];



    $http.post('/remove_user_order_email', { mailObj: $scope.mailObj }).then(function (responseMail) {

      console.log('success');

    }, function (err) {

      console.log(err);
    })



  }

  $scope.deletesentMail = function (id) {

    //  delete $scope.$parent.mailObj[mkey];
    $http.post('/updateSentEmail', { id: id }).then(function (responseMail) {

      $scope.setreceive(2);

    }, function (responseMail) {

      console.log("twotap api end ");
      console.log(responseMail);
    })

  }


  function getcoup(siteidlist) {
    $http.post('/getUserCoupon', { subscribelist: $scope.subscribe_stores_coupon, subscribesiteid: siteidlist }).then(function (responseMail) {
      console.log("hi");

      $scope.$parent.twotap_coupon = responseMail.data;
      console.log(responseMail.data);

    }, function (responseMail) {

      console.log("twotap api end ");
      console.log(responseMail);
    })
  }

  $scope.$parent.firsttime.loading = 1;
  $scope.$parent.loadfull = true;
  //  $scope.$parent.salenotification =0;


  function changePhoto(photo) {
    $scope.userinfo.img_location = photo.img;
    toastr.success('Profile photo changed');
    //$scope.$parent.userinfo.img_location =  photo.img;
  }
  $scope.remove_coupon_from_mylist = function (site_id, code) {
    console.log("asas");
    $http.post('/addAvoidedCoupon', { site_id: site_id, code: code }).then(function (responseMail) {

      console.log('updated');
      getcoup(arrsiteid);
    }, function (responseMail) {

      console.log(err);

    })
  }

  $http.post('/updateReadFlag').then(function (responseMail) {


    $http.post('/countunReadFlag')
      .success(function (data) {

        $scope.$parent.undread_mails = data.count;

      })


  }, function (err) {

    console.log(err);

  })

  $scope.deletereceiveMail = function (id) {

    $http.post('/delReceiveEmail', { id: id })
      .success(function (data) {
        console.log(data);
        $scope.setget(1);

      })

  }


  $scope.deleteUpreceiveMail = function (id) {

    $http.post('/updateReceiveEmail', { id: id })
      .success(function (data) {
        console.log(data);
        $scope.setget(1);

      })

  }


  $scope.update_flag = function (id) {

    $http.post('/updateReadFlagByid', { mailid: id }).then(function (responseMail) {


      $http.post('/countunReadFlag')
        .success(function (data) {

          $scope.$parent.undread_mails = data.count;

        })


    }, function (err) {

      console.log(err);

    })

  }

}])