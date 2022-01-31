var socialPopupDirectiveModule = angular.module('socialPopupDirectiveModule', ['ngCookies', 'SSApp']);

    socialPopupDirectiveModule.directive('socialProduct', SocialProduct);

    SocialProduct.$inject = ['$timeout', '$cookies', 'SocialProductService', 'setSocialData', 'updateUserActivity', 'UserService', 'toastr', 'Slug', '$location'];

    function SocialProduct($timeout, $cookies, SocialProductService, setSocialData, updateUserActivity, UserService, toastr, Slug, $location) {
        return {
            restrict: 'A',
            templateUrl: '/partials/social/socialPopup.html',
            controllerAs: 'vm',
            scope: {
                socialProduct: '=',
                socialTab: '='
            },
            link: function (scope) {
                var vm = scope.vm = {
                    social: {},
                    activeTab: 'like',
                    complete: {}
                };

                // api
                vm.changeTab = changeTab;
                vm.changeRate = changeRate;
                vm.submit = submit;
                vm.close = close;
                vm.getAllLikes = getAllLikes;
                vm.savePhoto = savePhoto;
                vm.checkLogin = checkLogin;
                vm.willthatremoveLike = willthatremoveLike;
                vm.willthatremoveReview = willthatremoveReview;

                // vm.afterSlideChange = afterSlideChange;
                // vm.changeSlide = changeSlide;
                scope.savedone = true;
                // init jquery
                socialPopup.trigger();
                socialPopup.rate(angular.element('.social_popup .rateis'), true);

                angular.element('body').click(function (event) {
                    if (event.target.type === 'file') {
                        return;
                    }
                    if (screen.width > 767) scope.$apply(vm.close);
                });

                cleanValues();

                // fns
                function changeTab(tab) {
                    // wait for product clean methods to finish
                    vm.activeTab = tab;
                    vm.social.shareTypes[tab] = true;
                }

                function changeRate(rate) {
                    vm.social.rate = rate;

                }

                function submit(form) {
                    // invalid forms, just go back
                    if (form.$invalid) {
                        console.log("Invalid form");
                        return;
                    }
                    var valid = false;
                    // only share if signed in
                    if (!scope.$root.userinfo) {

                        if ((vm.social.shareTypes.like) || (vm.social.shareTypes.collective)) {
                            console.log("login to like or share");
                            angular.element('.login-link').click();
                            return;
                        }

                    }

                    // set the thumbnail from the uploaded image
                    // vm.social.thumbnail = vm.noThumbnail || !vm.socials.photos.length ? null : vm.socials.photos[vm.activeThumbnail - 1]._id;
                    var currentSimage;
                    var trim_current_image;
                    var image_split_arr;
                    var image_with_right_bracket;
                    var image_split_arr2;
                    if (scope.vm.socials.photos.length) {
                        currentSimage = angular.element('#withUploadPhoto .flex-active-slide .upload-photo').attr('style');
                        trim_current_image = currentSimage.trim();
                        vm.social.instagramimage = "";
                        image_split_arr = trim_current_image.split('"');
                        if (image_split_arr.length > 1 && image_split_arr[1] != "" && image_split_arr[1] != null) {
                            if (image_split_arr[1].indexOf('http') > -1) {
                                vm.social.userUploadedImage = false;
                                vm.social.currentSliderImg = angular.copy(scope.socialProduct.image_url);

                            } else {
                                var without_any_extra = image_split_arr[1];
                                vm.social.userUploadedImage = true;
                                vm.social.currentSliderImg = $location.protocol() + '://' + $location.host() + ':' + $location.port() + without_any_extra;
                            }


                        } else {
                            vm.social.currentSliderImg = angular.copy(scope.socialProduct.image_url);
                            vm.social.userUploadedImage = false;
                        }


                    } else {
                        vm.social.currentSliderImg = scope.socialProduct.image_url;
                        vm.social.userUploadedImage = false;
                    }

                   var fbcurrentSimage;
				   var twcurrentSimage;
				   var incurrentSimage;
					if (vm.social.fbShare) {
					fbcurrentSimage = angular.element('#fbSlider .flex-active-slide img').attr('src');



                      var trim_fbcurrentSimage = fbcurrentSimage.trim();
                            if (trim_fbcurrentSimage.indexOf('http') > -1) {
                                vm.social.fbcurrentSimage = angular.copy(scope.socialProduct.image_url);

                            } else {

								var fbwithout_any_extra = trim_fbcurrentSimage;
								console.log("akhono ki chobi akey");

								vm.social.fbcurrentSimage = $location.protocol() + '://' + $location.host() + ':' + $location.port() + fbwithout_any_extra;
                            }

				}

				if (vm.social.twShare) {

				       twcurrentSimage = angular.element('#twSlider .flex-active-slide img').attr('src');
				      var trim_twcurrentSimage = twcurrentSimage.trim();
                            if (trim_twcurrentSimage.indexOf('http') > -1) {
                                vm.social.twcurrentSimage = angular.copy(scope.socialProduct.image_url);
				                vm.social.twuserUploadedImage = false;

                            } else {

								var twwithout_any_extra = trim_twcurrentSimage;

								vm.social.twcurrentSimage = twwithout_any_extra;
                            	vm.social.twuserUploadedImage = true;

							}

				}

				if (vm.social.insShare) {

				incurrentSimage = angular.element('#inSlider .flex-active-slide img').attr('src');


				console.log("instagram");

				console.log(incurrentSimage);


						 var trim_incurrentSimage = incurrentSimage.trim();

				         if (trim_incurrentSimage.indexOf('http') > -1) {
                                vm.social.incurrentSimage = angular.copy(scope.socialProduct.image_url);
				                vm.social.inuserUploadedImage = false;

                            } else {

								var inwithout_any_extra = trim_incurrentSimage;
								vm.social.instagramimage = inwithout_any_extra;

								vm.social.incurrentSimage = inwithout_any_extra;
                            	vm.social.inuserUploadedImage = true;

							}

				}

				   var saveObj = angular.copy(vm.social);

                    saveObj.shareTypes.mail = saveObj.shareTypes.mail && !vm.complete.mail;
                    saveObj.shareTypes.like = saveObj.shareTypes.like && !vm.complete.like;
                    saveObj.shareTypes.collective = saveObj.shareTypes.collective && !vm.complete.collective;
                    saveObj.fbShare = saveObj.fbShare && !vm.complete.facebook;
                    saveObj.twShare = saveObj.twShare && !vm.complete.twitter;
                    saveObj.insShare = saveObj.insShare && !vm.complete.instagram;
                    saveObj.initial = vm.social.initial;

                    vm.social.insShare
                    var socialProduct = new SocialProductService(saveObj);
                    scope.savedone = false;
                    socialProduct
                        .$save()
                        .then(function () {


                            if (vm.social.insShare && angular.isDefined(vm.social.instagram)) {

                                if (angular.isDefined(vm.social.instagram.password) && angular.isDefined(vm.social.instagram.email)) {
                                    $cookies.put('instagramEmail', vm.social.instagram.email);
                                }
                            }

                            scope.savedone = true;
                            toastr.success('Content shared!');
                            var jsonProduct = {};
                            var updateneeded = false;


                            if (vm.social.ssShare) {


                                if (vm.social.shareTypes.like && !vm.social.initial.like) {
                                    // vm.product.userSocial.likes = true;

                                    vm.product.likeUser = true;
                                    vm.social.likeUser = true;

                                    if (angular.isDefined(vm.product.likeCount) && vm.product.likeCount != null)
                                        vm.product.likeCount = vm.product.likeCount + 1;
                                    else {
                                        vm.product.likeCount = 1;

                                    }
                                    jsonProduct.likeCount = vm.product.likeCount;
                                    updateneeded = true;
                                    vm.social.initial.like = true;


                                    var ind = scope.$parent.favCataloglist.indexOf(vm.product.catalogId);
                                    if (ind < 0) {

                                        scope.$parent.favCataloglist.push(vm.product.catalogId);
                                    }


                                } else if (!vm.social.shareTypes.like && vm.social.initial.like) {
                                    // vm.product.userSocial.likes = true;

                                    vm.product.likeUser = false;
                                    vm.social.likeUser = false;
                                    if (angular.isDefined(vm.product.likeCount)) {
                                        if (vm.product.likeCount > 0) {
                                            vm.product.likeCount = vm.product.likeCount - 1;
                                        } else {
                                            vm.product.likeCount = 0;
                                        }
                                    } else {
                                        vm.product.likeCount = 0;

                                    }
                                    jsonProduct.likeCount = vm.product.likeCount;
                                    updateneeded = true;
                                    vm.social.initial.like = false;
                                    var ind = scope.$parent.favCataloglist.indexOf(vm.product.catalogId);
                                    if (ind > -1) {

                                        scope.$parent.favCataloglist.splice(ind, 1);
                                    }

                                    //	scope.$parent.reviewCataloglist $scope.$parent.mailCatalogList


                                }

                                if (vm.social.shareTypes.mail) {
                                    if (angular.isDefined(vm.social.mail.to) && vm.social.mail.to.trim() != '') {
                                        var s = vm.social.mail.to.split(/[,;]/).length;

                                        // vm.product.userSocial.mails = true;
                                        // vm.product.social.mails = vm.product.social.mails + s || s;

                                        vm.product.mails = vm.product.mails + s || s;
                                        vm.product.mailUser = true;
                                        vm.social.mailUser = true;

                                        if (angular.isDefined(vm.product.shareCount)) {
                                            vm.product.shareCount = vm.product.shareCount + 1;
                                        }
                                        else {
                                            vm.product.shareCount = 1;

                                        }
                                        jsonProduct.shareCount = vm.product.shareCount;
                                        vm.social.initial.mail = true;


                                        var ind1 = scope.$parent.mailCatalogList.indexOf(vm.product.catalogId);
                                        if (ind1 < 0) {

                                            scope.$parent.mailCatalogList.push(vm.product.catalogId);
                                        }


                                        updateneeded = true;
                                    }
                                    if (vm.social.fbShare) {
                                        vm.product.mailUser = true;
                                        if (angular.isDefined(vm.product.shareCount)) {
                                            vm.product.shareCount = vm.product.shareCount + 1;
                                        }
                                        else {
                                            vm.product.shareCount = 1;

                                        }
                                        jsonProduct.shareCount = vm.product.shareCount;
                                        vm.social.initial.mail = true;
                                        var ind1 = scope.$parent.mailCatalogList.indexOf(vm.product.catalogId);
                                        if (ind1 < 0) {
                                            scope.$parent.mailCatalogList.push(vm.product.catalogId);
                                        }
                                        updateneeded = true;

                                    }

                                    if (vm.social.twShare) {
                                        vm.product.mailUser = true;
                                        if (angular.isDefined(vm.product.shareCount)) {
                                            vm.product.shareCount = vm.product.shareCount + 1;
                                        }
                                        else {
                                            vm.product.shareCount = 1;

                                        }
                                        jsonProduct.shareCount = vm.product.shareCount;
                                        vm.social.initial.mail = true;

                                        var ind1 = scope.$parent.mailCatalogList.indexOf(vm.product.catalogId);
                                        if (ind1 < 0) {

                                            scope.$parent.mailCatalogList.push(vm.product.catalogId);
                                        }


                                        updateneeded = true;

                                    }

                                    if (vm.social.insShare) {
                                        vm.product.mailUser = true;
                                        if (angular.isDefined(vm.product.shareCount)) {
                                            vm.product.shareCount = vm.product.shareCount + 1;
                                        }
                                        else {
                                            vm.product.shareCount = 1;

                                        }


                                        jsonProduct.shareCount = vm.product.shareCount;
                                        vm.social.initial.mail = true;

                                        var ind1 = scope.$parent.mailCatalogList.indexOf(vm.product.catalogId);
                                        if (ind1 < 0) {

                                            scope.$parent.mailCatalogList.push(vm.product.catalogId);
                                        }


                                        updateneeded = true;

                                    }


                                }

                                //if (vm.social.shareTypes.collective && !vm.social.reviewUser)
                                if (vm.social.shareTypes.collective) {


                                    if (!vm.social.initial.rate || (!angular.isDefined(vm.social.initial.rate))) {


                                        if (angular.isDefined(vm.social.rate) && angular.isDefined(vm.product.totalRate))
                                            jsonProduct.totalRate = vm.product.totalRate + vm.social.rate;
                                        else if (angular.isDefined(vm.product.totalRate)) {
                                            jsonProduct.totalRate = vm.product.totalRate;
                                            vm.product.totalRate = jsonProduct.totalRate;


                                        } else if (angular.isDefined(vm.social.rate)) {

                                            jsonProduct.totalRate = vm.social.rate;
                                            vm.product.totalRate = jsonProduct.totalRate;
                                            jsonProduct.rateAvg = 0;

                                        } else if (vm.product.totalRate == null || (!angular.isDefined(vm.product.totalRate))) {
                                            jsonProduct.totalRate = 0;
                                            vm.product.totalRate = jsonProduct.totalRate;
                                            jsonProduct.rateAvg = 0;
                                        }


                                        if (angular.isDefined(vm.product.ratedByUser)) {
                                            jsonProduct.ratedByUser = vm.product.ratedByUser + 1;
                                            jsonProduct.rateAvg = (jsonProduct.totalRate / jsonProduct.ratedByUser);
                                            vm.product.ratedByUser = jsonProduct.ratedByUser;
                                            vm.product.rateAvg = jsonProduct.rateAvg;
                                        } else {

                                            vm.product.ratedByUser = 1;
                                            jsonProduct.ratedByUser = vm.product.ratedByUser;
                                            jsonProduct.rateAvg = jsonProduct.totalRate;
                                            vm.product.rateAvg = jsonProduct.rateAvg;
                                        }

                                        vm.social.initial.rate = true;
                                        vm.product.rateUser = true;
                                        updateneeded = true;


                                    } else if (vm.social.initial.rate) {


                                        vm.product.rateUser = true;
                                        console.log("printing initial");
                                        console.log(vm.social.initial);
                                        if (vm.product.totalRate == null || (!angular.isDefined(vm.product.totalRate))) {
                                            console.log("i am here x ");
                                            vm.product.totalRate = 0;
                                            jsonProduct.totalRate = 0;
                                            jsonProduct.rateAvg = 0;
                                            vm.product.rateAvg = 0;


                                        } else if (angular.isDefined(vm.social.rate) && angular.isDefined(vm.product.totalRate) && angular.isDefined(vm.social.initial.myrate)) {

                                            console.log("here is the prob");
                                            console.log(vm.product.totalRate);
                                            console.log(vm.social.rate);
                                            console.log(vm.social.initial.myrate);
                                            console.log(vm.product.ratedByUser);

                                            jsonProduct.totalRate = vm.product.totalRate + vm.social.rate - vm.social.initial.myrate;
                                            vm.product.totalRate = jsonProduct.totalRate;
                                            jsonProduct.rateAvg = (jsonProduct.totalRate / vm.product.ratedByUser);
                                            vm.product.rateAvg = jsonProduct.rateAvg;
                                            vm.social.initial.myrate = angular.copy(vm.social.rate);
                                            console.log(vm.product.rateAvg);
                                        }


                                        updateneeded = true;

                                    }


                                    if (!vm.social.initial.review || (!angular.isDefined(vm.social.initial.review))) { // no review


                                        if (angular.isDefined(vm.social.comment) && vm.social.comment != null && vm.social.comment.trim() != '') {


                                            vm.product.reviewUser = true;
                                            if (angular.isDefined(vm.product.reviewCount))
                                                vm.product.reviewCount = vm.product.reviewCount + 1;
                                            else
                                                vm.product.reviewCount = 1;

                                            jsonProduct.reviewCount = vm.product.reviewCount;

                                            var ind2 = scope.$parent.reviewCataloglist.indexOf(vm.product.catalogId);

                                            if (ind2 < 0) {

                                                scope.$parent.reviewCataloglist.push(vm.product.catalogId);
                                            }
                                            vm.social.initial.review = true;
                                            vm.social.initial.collective = true;

                                            updateneeded = true;
                                        }

                                    }


                                    //vm.social.initial.myrate = angular.copy(vm.social.rate);


                                } else if ((!vm.social.shareTypes.collective || (!angular.isDefined(vm.social.shareTypes.collective))) && vm.social.initial.collective) {

                                    if (!(angular.isDefined(vm.product.totalRate))) {
                                        jsonProduct.totalRate = 0;
                                        jsonProduct.rateAvg = 0;

                                    } else if (!(angular.isDefined(vm.social.initial.myrate))) {
                                        vm.social.initial.myrate = 0;
                                        jsonProduct.totalRate = vm.product.totalRate;

                                    } else {

                                        jsonProduct.totalRate = vm.product.totalRate - vm.social.initial.myrate;
                                        if (jsonProduct.totalRate < 0) {
                                            jsonProduct.totalRate = 0;
                                            vm.product.totalRate = 0;
                                        }
                                    }

                                    vm.product.reviewUser = false;
                                    vm.product.rateUser = false;
                                    if (!(angular.isDefined(vm.product.reviewCount))) {
                                        vm.product.reviewCount = 0;
                                        jsonProduct.reviewCount = vm.product.reviewCount;

                                    } else if (vm.product.reviewCount > 0) {
                                        vm.product.reviewCount = vm.product.reviewCount - 1;
                                        jsonProduct.reviewCount = vm.product.reviewCount;

                                    }
                                    if (!(angular.isDefined(vm.product.ratedByUser))) {
                                        vm.product.ratedByUser = 0;
                                        jsonProduct.ratedByUser = vm.product.ratedByUser;
                                        vm.product.totalRate = 0;
                                        jsonProduct.rateAvg = 0;
                                        vm.product.rateAvg = jsonProduct.rateAvg;


                                    } else if (vm.product.ratedByUser > 0) {
                                        vm.product.ratedByUser = vm.product.ratedByUser - 1;
                                        jsonProduct.ratedByUser = vm.product.ratedByUser;
                                        vm.product.totalRate = jsonProduct.totalRate;
                                        jsonProduct.rateAvg = jsonProduct.totalRate / jsonProduct.ratedByUser;
                                        vm.product.rateAvg = jsonProduct.rateAvg;

                                    }
                                    var ind2 = scope.$parent.reviewCataloglist.indexOf(vm.product.catalogId);

                                    if (ind2 > -1) {

                                        scope.$parent.reviewCataloglist.splice(ind2, 1);
                                    }


                                    vm.social.initial.rate = false;
                                    vm.social.initial.myrate = 0;
                                    vm.product.rateUser = false;
                                    vm.social.rateUser = false;
                                    updateneeded = true;
                                    vm.social.initial.review = false;


                                }

                                if (!(angular.isDefined(vm.product.purchaseCount))) {

                                    vm.product.purchaseCount = 0;
                                }
                                if (!(angular.isDefined(vm.product.rateAvg))) {

                                    vm.product.rateAvg = 0;
                                }
                                if (!(angular.isDefined(vm.product.shareCount))) {

                                    vm.product.shareCount = 0;
                                }
                                if (!(angular.isDefined(vm.product.likeCount))) {

                                    vm.product.likeCount = 0;
                                }


                                jsonProduct.popularPoint = (vm.product.purchaseCount / 5) + (vm.product.rateAvg / 10) + (vm.product.shareCount / 50) + (vm.product.likeCount / 70);


                                var catlog = vm.product.catalogId;
                                if (angular.isDefined(jsonProduct.totalRate))
                                    vm.product.totalRate = jsonProduct.totalRate;
                                if (updateneeded) {


                                    setSocialData.updateSocialData(jsonProduct, catlog).then(function (sdata) {


                                        console.log(sdata);

                                    }, function (sdata) {
                                        console.log("errrot");

                                        console.log(sdata);

                                    });


                                    updateUserActivity.updateUserActivityData(catlog, vm.social.initial, vm.social.shareTypes).then(function (sdata1) {

                                        scope.$parent.getRightSideBar();

                                    }, function (sdata) {
                                        console.log("errrot");

                                        console.log(sdata);

                                    });


                                }


                            }


                            close();
                        })
                        .catch(function (err) {
                            scope.savedone = true;
                            //vm.complete = err.data.complete || {};
                            console.log(err);
                            if (angular.isDefined(err.data))
                                toastr.error(err.data.error, 'There was a problem sharing your content!');
                        });
                }

                function close() {
                    scope.socialTab = null;
                    scope.socialProduct = null;
                    scope.showMoreLikes = true;
                    angular.element('#prSocialPopup').modal('hide');
                    socialPopup.closed();
                    var photouserid;
                    if (($location.path().indexOf('/SOC')) > -1 && angular.isDefined(vm.product)) {
                        if (angular.isDefined(vm.product.catalogId)) {
                            SocialProductService
                                .getProductSocials({catalogId: vm.product.catalogId})
                                .$promise
                                .then(function (socials) {
                                    vm.product.productsocial = socials;
                                    vm.product.productsocial.clickingdown = true;

                                    if (vm.product.productsocial.photos.length > 0) {

                                        for (var k = 0; k < vm.product.productsocial.photos.length; k++) {

                                            photouserid = vm.product.productsocial.photos[k].user._id;

                                            for (var j = 0; j < vm.product.productsocial.rateDetails.length; j++) {

                                                if (vm.product.productsocial.rateDetails[j].user._id == photouserid) {
                                                    vm.product.productsocial.photos[k].rate = vm.product.productsocial.rateDetails[j].rate;

                                                    console.log(vm.product.productsocial.photos[k].rate);
                                                    break;
                                                }
                                            }

                                        }

                                    }

                                    if (angular.isDefined(socials.rate) && socials.rate!=null) {
                                        angular.element('#proSocial').removeAttr('class');
										angular.element('#proSocial').addClass("rateis r" + socials.rate);
                                        console.log(socials.rate);
										angular.element('#mycommentid').text(socials.comment);

									}
									else {
                                        angular.element('#proSocial').removeAttr('class');
										angular.element('#proSocial').addClass("rateis r0");
                                        console.log("nothing");

										angular.element('#mycommentid').text("");

                                    }


                                })
                        }

                    }
                    // wait so you cant see the values changing
                    $timeout(cleanValues, 500);
                }

                function getAllLikes() {
                    vm.showMoreLikes = false;

                    SocialProductService
                        .getAllLikes({catalogId: vm.social.catalogId})
                        .$promise
                        .then(function (likes) {
                            vm.socials.likes = likes;
                            vm.hasAllLikes = true;
                        });
                }

                function savePhoto(photo) {
                    vm.socials.photos.push(photo);
                    toastr.success('Photo uploaded');
                    scope.$parent.activePopup = false;

                    // select the new photo
                    angular.element('.social_uploader_wrap .upload-thumb-list .slides li:last-child').click();
                }

                function checkLogin(type) {
                    if (!scope.$root.userinfo) {

                        //scope.$parent.common_popup_header = "Logged in to share in " + type;
                        //scope.$parent.common_popup_message = "Please logged in first";
                        //$('#commonPopup').modal('show');
                        sShoppable.ssLogIn();
                        close();
                        return;
                    }

                    // already on, do nothing
                    // if (type === 'facebook' && vm.social.fbShare === true) {
                    // vm.social.fbShare = false;

                    // return;
                    // }
                    if (type === 'twitter' && vm.social.twShare === true) {
                        vm.social.twShare = false;

                        return;
                    }
                    if (type === 'instagram' && vm.social.insShare === true) {
                        vm.social.insShare = false;

                        return;
                    }

                    UserService
                        .checkLogin(type)
                        .then(function () {
                            switch (type) {
                                case 'facebook':
                                    vm.social.fbShare = true;
                                    break;
                                case 'twitter':
                                    vm.social.twShare = true;
                                    break;
                                case 'instagram':
                                    vm.social.insShare = true;
                                    vm.social.instaLogin = false;
                                    break;
                            }
                        })
                        .catch(function () {
                            switch (type) {
                                case 'facebook':
                                    UserService.facebookConnect(function (result) {
                                        console.log(result);
                                        if (!result) {
                                            vm.social.fbShare = true;
                                        } else {
                                            toastr.error(result.message, 'Error authenticating to Facebook');
                                        }
                                        // since it's not an angular call, we need to refresh the scope
                                        scope.$apply();
                                    });
                                    break;
                                case 'twitter':
                                    UserService.twitterConnect(function (result) {
                                        if (!result) {
                                            vm.social.twShare = true;
                                        } else {
                                            toastr.error(result.message, 'Error authenticating to Twitter');
                                        }
                                        // since it's not an angular call, we need to refresh the scope
                                        scope.$apply();
                                    });
                                    break;
                                case 'instagram':
                                    vm.social.insShare = true;
                                    vm.social.instaLogin = true;
                                    break;
                            }
                        });
                }


                function willthatremoveLike(like, initiallike) {
                    if (!like && initiallike) {
                        toastr.error('By unselect this box and clicking share your this favourite item will be remove', 'Favourite will be removed after share click');
                        // scope.$parent.common_popup_header = "Favourite will be removed after share click";
                        // scope.$parent.common_popup_message = "By unselect this box and clicking share your this favourite item will be remove";
                        // $('#commonPopup').modal('show');
                    }

                }

                function willthatremoveReview(review, initialrate) {
                    if (!review && initialrate) {
                        toastr.error('By unselect this box and clicking share your review and rate will be remove from system', 'Review will be removed after share click');

                        // scope.$parent.common_popup_header = "Review will be removed after share click";
                        // scope.$parent.common_popup_message = "By unselect this box and clicking share your review and rate will be remove from system";
                        // $('#commonPopup').modal('show');

                    }
                }


                /* function afterSlideChange(slider) {
                 vm.activeThumbnail = slider.element.currentSlide + 1;
                 }*/

                /* function changeSlide(index) {
                 var slider = angular.element('.social_product_thumb .flexslider').data('flexslider');
                 var animationSpeed = slider.vars.animationSpeed;
                 slider.vars.animationSpeed = 0;
                 slider.flexAnimate(index);
                 slider.vars.animationSpeed = animationSpeed;
                 }*/

                // watches
                scope.$watch('socialTab', changeTab);

                scope.$watch('vm.activeTab', function () {
                    scope.socialTab = vm.activeTab;
                });

                // Slider update after uploading image and for different product
                scope.$watch('vm.socials.photos.length', function (product) {

                    if (!product || typeof scope.socialProduct === 'undefined') {
                        return;
                    }

                    if (scope.vm.socials.photos.length) {
                        scope.activePopup = -1;
                        var withUploadSlider = angular.element('#withUploadPhoto');
                        var uploadedCollectiveSlider = angular.element('#uploadedCollectives');

                        $timeout(function () {
                            withUploadSlider.removeData('flexslider');
                            uploadedCollectiveSlider.removeData('flexslider');
                            var withcollectiveSlData = $('#withCollectiveSliderData').html();
                            var uploadedClData = $('#uploadedCollectivesData').html();

                            withUploadSlider.html(withcollectiveSlData);
                            uploadedCollectiveSlider.html(uploadedClData);
                        }, 200);

                        $timeout(function () {
                            withUploadSlider.flexslider({
                                animation: 'slide',
                                sync: uploadedCollectiveSlider,
                                controlNav: false,
                                slideshow: false,
                                useCSS: false,
                                //smoothHeight:true,
                                after: function (slider) {
                                    $('.current-slide').text(slider.currentSlide + 1);
                                    if (uploadedCollectiveSlider.find('.slides li:first.flex-active-slide').length) uploadedCollectiveSlider.find('.slides').css('margin-left', '0');
                                }
                            });

                            uploadedCollectiveSlider.flexslider({
                                animation: 'slide',
                                asNavFor: withUploadSlider,
                                controlNav: false,
                                animationSpeed: 400,
                                animationLoop: false,
                                slideshow: false,
                                useCSS: false,
                                itemWidth: 78,
                                itemMargin: 10,
                                minItems: 3,
                                maxItems: 3
                            });

                        }, 500);

                    }
                });

                scope.$watch('socialProduct', function (product) {

                    if (!product) {
                        return;
                    }


                    // if($location.path().indexOf('/SOC')>-1) { // watch exit if it has been changed from single product get all
                    // if(angular.isDefined(product.productsocial)) {
                    // if(angular.isDefined(product.productsocial.clickingdown)) {

                    // if(product.productsocial.clickingdown) {

                    // return;

                    // }

                    // }
                    // }
                    // }
                    cleanValues();

                    // For showing product image in popup slider
                    scope.socialProductImgUrl = [];
                    scope.socialProductImgUrl.push(scope.socialProduct.image_url);
                    $timeout(function () {
                        angular.element('#withoutUploadPhoto').flexslider({
                            animation: 'slide',
                            controlNav: false,
                            slideshow: false,
                            useCSS: false,
                            after: function (slider) {
                                $('.current-slide').text(slider.currentSlide + 1);
                            }
                        }, 300);
                    });

                    vm.social.catalogId = product.catalogId;
                    vm.social.rateAvg = product.rateAvg;
                    vm.social.keyword = product.keyword;
                    vm.social.mail.message = '#HappyShopping #SocShop #' + product.keyword;
                    vm.social.image_url = product.image_url;
                    vm.social.mail.to = "";
                    vm.social.noThumbnail = false;


                    // if(angular.isDefined(product.alt_images)) {

                    //   vm.social.alt_images =angular.copy(product.alt_images);

                    //}

                    if (angular.isDefined(scope.$root.userinfo)) {
                        if (angular.isDefined(scope.$root.userinfo.email))
                            vm.social.mail.from = angular.copy(scope.$root.userinfo.email);
                    }
                    if (angular.isDefined($cookies.get('instagramEmail'))) {

                        vm.social.instagram = {};
                        console.log($cookies.get('instagramEmail'));

                        vm.social.instagram.email = $cookies.get('instagramEmail');
                        //vm.social.instagram.password= $cookies.get('instagramPassword');
                    }
                    vm.product = product;
                    //vm.productLink = $location.$$absUrl + 'SOC/'+ product.catalogId +'/'+  Slug.slugify(product.keyword);

                    vm.productLink = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/#!/SOC/' + product.catalogId + '/' + Slug.slugify(product.keyword);
                    // get more detailed info on the shares
                    vm.social.initial = {like: false, collective: false, mail: false, rate: false, review: false};
                    scope.savedone = false;
                    SocialProductService
                        .getProductSocials({catalogId: product.catalogId})
                        .$promise
                        .then(function (socials) {
                            vm.socials = socials;
                            if (!(angular.isDefined(vm.social.shareTypes))) {
                                vm.social.shareTypes = {like: false, collective: false, mail: false};

                            }


                            if (angular.isDefined(socials.likeUser)) {
                                vm.social.shareTypes.like = angular.copy(socials.likeUser);
                                vm.social.likeUser = socials.likeUser;
                                vm.social.initial.like = angular.copy(socials.likeUser);
                            }
                            if (angular.isDefined(socials.reviewUser)) {
                                vm.social.shareTypes.collective = angular.copy(socials.reviewUser);
                                vm.social.reviewUser = socials.reviewUser;
                                vm.social.initial.collective = angular.copy(socials.reviewUser);

                            }
                            if (angular.isDefined(socials.mailUser)) {
                                vm.social.shareTypes.mail = angular.copy(socials.mailUser);

                                vm.product.mailUser = socials.mailUser;
                                vm.social.mailUser = socials.mailUser;
                                vm.social.initial.mail = angular.copy(socials.mailUser);

                            }

                            if (angular.isDefined(socials.rate) && socials.rate != null) {

                                vm.product.rateUser = true;
                                vm.social.rateUser = true;
                                vm.social.initial.rate = true;
                                vm.social.initial.myrate = socials.rate;
                            }

                            var temp = angular.copy(scope.socialTab);
                            vm.social.shareTypes[temp] = true;

                            vm.social.rate = angular.copy(socials.rate);
                            vm.social.comment = angular.copy(socials.comment);

                            if (vm.social.comment != '' && vm.social.comment != null)
                                vm.social.initial.review = true;

                            vm.social.rateAvg = angular.copy(vm.product.rateAvg);


                            vm.hasAllLikes = vm.socials.likes.length < 50;
                            //vm.hasAllLikes = vm.socials.likes.length < 1;


                            // put the primary first
                            vm.socials.photos.forEach(function (photo, i) {
                                // TODO: check user?
                                if (photo.primary) {
                                    // move to first
                                    vm.socials.photos.splice(0, 0, vm.socials.photos.splice(i, 1)[0]);
                                }
                            });

                            scope.savedone = true;
                        }, function (socials) {
                            vm.social.initial = {like: false, collective: false, mail: false};
                            vm.social.rateAvg = 0;
                            scope.savedone = true;
                        });
                });

                // private fns
                function cleanValues() {
                    var catalogId = vm.social.catalogId;
                    var keyword = '';
                    vm.social = {
                        catalogId: catalogId,
                        ssShare: true,
                        shareTypes: {
                            like: false,
                            mail: false,
                            collective: false
                        },
                        mail: {
                            subject: 'Checkout what I found on SociallyShoppable.com',
                            message: '#HappyShopping #SocShop '
                        },
                        rate: 0,
                        rateAvg: 0,
                        comment: '',
                        keyword: ''
                    };
                    vm.social.shareTypes[scope.socialTab] = true;
                    // vm.activeThumbnail = 1;
                    vm.showMoreLikes = true;
                    vm.hasAllLikes = false;
                    vm.complete = {};
                }
            }
        };
    }
