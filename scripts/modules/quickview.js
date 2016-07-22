define([
        'modules/jquery-mozu',
        "underscore",
        "hyprlive",
        'modules/models-product',
        'modules/cart-monitor',
        'modules/api',
        "modules/backbone-mozu"
],
function($, _, Hypr, ProductModels, CartMonitor, api, Backbone) {

    var QuickViewView = Backbone.View.extend({
        events: {
            "click .qvButton": "buttonClicked",
            "change [data-mz-product-option]": "onOptionChange",
            "blur [data-mz-product-option]": "onOptionChange"
        },

        initialize: function() {
            this.currentPrductCode = null;
        },

        onOptionChange: function(e) {
            if (window.quickviewProduct !== null) {
                return this.configure($(e.currentTarget));
            }
        },

        configure: function($optionEl) {
            var newValue = $optionEl.val(),
                oldValue,
                id = $optionEl.data('mz-product-option'),
                optionEl = $optionEl[0],
                isPicked = (optionEl.type !== "checkbox" && optionEl.type !== "radio") || optionEl.checked,
                option = window.quickviewProduct.get('options').get(id);
            if (option) {
                if (option.get('attributeDetail').inputType === "YesNo") {
                    option.set("value", isPicked);
                } else if (isPicked) {
                    oldValue = option.get('value');
                    if (oldValue !== newValue && !(oldValue === undefined && newValue === '')) {
                        option.set('value', newValue);
                    }
                }
            }

            var isRequiredOptionsSet = false;
            $("[data-mz-product-option]").each(function(opt) {
                var currOptVal = $(this).val();

                var productOptions = window.quickviewProduct.apiModel.data.options;

                for (var i = 0; i < productOptions.length; i++) {
                    var currentOptionInFor = productOptions[i];

                    if (currentOptionInFor.attributeFQN == $optionEl.data("mz-product-option")) {
                        if (currentOptionInFor.isRequired) {
                            if (currOptVal !== "") {
                                isRequiredOptionsSet = true;
                            } else {
                                isRequiredOptionsSet = false;
                            }
                        }
                    }
                }
            });

            if (isRequiredOptionsSet) {
                if (window.quickviewProduct.attributes.inventoryInfo.onlineStockAvailable >= 1) {
                    $("input.mz-productdetail-qty").removeAttr("disabled");
                    $("input.mz-productdetail-qty").val("1");

                    $("input.mz-productdetail-qty").attr("max", window.quickviewProduct.attributes.inventoryInfo.onlineStockAvailable);
                } else {
                    $("input.mz-productdetail-qty").val("1");
                    $("input.mz-productdetail-qty").attr("disabled", "disabled");
                }

                $("div.btnAddToCart button").removeAttr("disabled");
                $("div.btnAddToCart button").removeClass("is-disabled");
            } else {
                $("input.mz-productdetail-qty").attr("disabled", "disabled");

                $("div.btnAddToCart button").attr("disabled", "disabled");
                $("div.btnAddToCart button").addClass("is-disabled");
            }
        },

        render: function() {
            var me = this;
            Backbone.MozuView.prototype.render.apply(this);
            this.$('[data-mz-is-datepicker]').each(function(ix, dp) {
                $(dp).dateinput().css('color', Hypr.getThemeSetting('textColor')).on('change  blur', _.bind(me.onOptionChange, me));
            });
        },

        buttonClicked: function(e) {
            // QUICK VIEW BUTTON CLICKED -- OPEN QUICK VIEW WINDOW
            var self = this;

            window.quickviewProduct = null;
            this.currentPrductCode = null;

            // Reset modal dialog content
            $("#product-details-quick-view .modal-content").html("");

            var qvProductCode = $(e.currentTarget).data("qv-product-code");
            var product = new ProductModels.Product({
                productCode: qvProductCode
            });

            this.currentPrductCode = qvProductCode;
            window.quickviewProduct = product;

            product.apiGet().then(function() {
                var newPromise = api.get('wishlist').then(function(wishlist) {
                    return wishlist.data.items;
                }).then(function(wishlistItems) {
                    for (var i = 0; i < wishlistItems.length; i++) {
                        for (var j = 0; j < wishlistItems[i].items.length; j++) {
                            if (wishlistItems[i].items[j].product.productCode == product.attributes.productCode) {
                                $("#product-details-quick-view .btnAddToWishlist button").prop('disabled', 'disabled');
                                $("#product-details-quick-view .btnAddToWishlist button").addClass("addedToWishList");
                            }
                        }
                    }
                });

                var modalTemplate = Hypr.getTemplate('modules/product/product-quick-view');

                var modalDiv = $("#product-details-quick-view");
                var modalDivContent = $("#product-details-quick-view .modal-content");
                var htmlToSetAsContent = modalTemplate.render({
                    model: product.toJSON({
                        helpers: true
                    })
                });

                // SET QUICKVIEW POPUP CONTENTS
                modalDivContent.html(htmlToSetAsContent);

                try {
                    $(modalDiv).children().first().css("float", "none");

                    // ADD LISTENERS AFTER OPENING QUICK VIEW POPUP
                    $(modalDiv).on('shown.bs.modal', function(e) {
                        // REMOVE PREVIOUS EVENTS (IF ANY)
                        $("#product-details-quick-view").off("click", ".btnAddToCart button");
                        $("#product-details-quick-view").off("click", ".btnAddToWishlist button");

                        // ADD LISTENER FOR ADD TO CART
                        $("#product-details-quick-view").on("click", ".btnAddToCart button", function() {
                            var newQty = $("#product-qty").val();
                            window.quickviewProduct.apiAddToCart({
                                quantity: newQty
                            });

                            CartMonitor.$el = $('[data-mz-role="cartmonitor"]');
                            CartMonitor.update();

                            $('[data-mz-role="cartmonitor"]').promise().done(function(arg1) {
                                CartMonitor.$el = $('[data-mz-role="cartmonitor"]');
                                CartMonitor.update();
                            });

                            $(modalDiv).modal('hide');

                            $('[data-mz-role="cartmonitor"]').promise().done(function(arg1) {
                                CartMonitor.$el = $('[data-mz-role="cartmonitor"]');
                                CartMonitor.update();
                            });
                        });

                        // ADD LISTENER FOR ADD TO WISHLIST
                        $("#product-details-quick-view").on("click", ".btnAddToWishlist button", function(e) {
                            product.addToWishlist({
                                quantity: 1
                            });

                            try {
                                product.on('addedtowishlist', function(wishlistitem) {
                                    $("#product-details-quick-view .btnAddToWishlist button").prop('disabled', 'disabled');
                                    $("#product-details-quick-view .btnAddToWishlist button").addClass("addedToWishList");

                                    $(".wishsuccessmsg").show();
                                    $(".wishsuccessmsg").html("Product added to wishlist");

                                    setInterval(function() {
                                        $(".wishsuccessmsg").hide();
                                    }, 3000);
                                });
                            } catch (err) {
                                console.log("Error Obj:" + err);
                            }
                        });
                    }); // END OF ADDING LISTENERS

                    $(modalDiv).on('hidden.bs.modal', function(e) {
                        window.quickviewProduct = null;
                        // self.currentPrductCode // THIS REQUIRES MORE EXPOSITION

                        CartMonitor.$el = $('[data-mz-role="cartmonitor"]');
                        CartMonitor.update();

                        $('[data-mz-role="cartmonitor"]').promise().done(function(arg1) {
                            CartMonitor.$el = $('[data-mz-role="cartmonitor"]');
                            CartMonitor.update();
                        });
                    });

                    $(modalDiv).modal({
                        show: true
                    });
                    window.checkForDiscountsQV = setInterval(showSegmentDiscountQV(product), 200);
        
                    var showSegmentDiscountQV = function(product){
                        if(window.segmentDiscounts.set){
                            clearInterval(window.checkForDiscountsQV);
                                
                            // Check item if it's part of a discount
                            $(window.segmentDiscounts.discounts).each(function(w, discount){
                                var discounted = false;
                                
                                // Check if item is part of product list
                                $(discount.target.products).each(function(x, prodTarget){
                                    if(prodTarget.productCode == product.attributes.productCode){
                                        discount = true;
                                    }
                                });
                                
                                // Check if item is part of discount category list
                                $(discount.target.categories).each(function(y, catTarget){
                                    $(product.attributes.categories).each(function(z, category){
                                        if(checkSubCategory(category))
                                        discounted = true;
                                    });
                                    function checkSubCategory(cat){
                                        if(cat.categoryId == catTarget.id){
                                            return true;
                                        } else if(cat.parentCategory){
                                            return checkSubCategory(cat.parentCategory);
                                        } else {
                                            return false;
                                        }
                                    }
                                });
                                
                                // Check if item is part of excluded discount category list
                                $(discount.target.excludedCategories).each(function(a, excludedCatTarget){
                                    $(product.attributes.categories).each(function(b, category){
                                        if(checkSubCategory(category)){
                                            discounted = false;
                                        }
                                    });
                                    function checkSubCategory(cat){
                                        if(cat.categoryId == excludedCatTarget.id){
                                            return true;
                                        } else if(cat.parentCategory){
                                            return checkSubCategory(cat.parentCategory);
                                        } else {
                                            return false;
                                        }
                                    }
                                });
                                
                                // Check if item is part of excluded product list
                                $(discount.target.excludedProducts).each(function(c, excludedProducts){
                                    if(product.attributes.productCode == excludedProducts.productCode){
                                        discounted = false;
                                    }
                                });
                                
                                if(discounted){
                                    var currentPrice = product.attributes.price.attributes.price;
                                    var priceHtml = ""; 
                                    if(product.attributes.price.attributes.salePrice && !discount.doesNotApplyToSalePrice){
                                        currentPrice = product.attributes.price.attributes.salePrice;
                                    }
                                    if(discount.amountType == "Amount"){
                                        priceHtml = '<span class="mz-price is-crossedout">$'+ product.attributes.price.attributes.price.toFixed(2) +'</span>'+
                                                    '<span itemprop="price" class="mz-price actual-price is-saleprice">$'+ (currentPrice - discount.amount).toFixed(2) +'</span>';
                                    } else if (discount.amountType == "Percentage"){
                                        priceHtml = '<span class="mz-price is-crossedout">$'+ product.attributes.price.attributes.price.toFixed(2) +'</span>'+
                                                    '<span itemprop="price" class="mz-price actual-price is-saleprice">$'+ (currentPrice -(currentPrice * (discount.amount/100))).toFixed(2) +'</span>';
                                    } else if (discount.amountType == "FixedPrice"){
                                        priceHtml = '<span class="mz-price is-crossedout">$'+ product.attributes.price.attributes.price.toFixed(2) +'</span>'+
                                                    '<span itemprop="price" class="mz-price actual-price is-saleprice">$'+ discount.amount.toFixed(2) +'</span>';
                                    }
                                        
                                    $(".popup-content-block .mz-pricestack").html(priceHtml);
                                }
                            });
                        }
                    };
                    // INITIALIZE PRODUCT IMAGES SLIDER
                    try {
                        $('.productImagesPreview .thumbnails').owlCarousel({
                            autoplay: false,
                            autoWidth: false,
                            margin: 5,
                            items: 4,
                            navText: ["\ue079", "\ue080"],
                            responsive: {
                                800: {
                                    items: 4
                                }
                            }
                        });

                        $('.productImagesPreview .thumbnails .item img').click(function(e) {
                            e.preventDefault();

                            var link = $(this).attr("src");
                            $('.productImagesPreview .main-image img').attr("src", link);
                        });
                    } catch (err) {
                        console.log("SliderInitializationError:" + err);
                    }

                    $('[data-mz-role="cartmonitor"]').promise().done(function(arg1) {
                        CartMonitor.$el = $('[data-mz-role="cartmonitor"]');
                        CartMonitor.update();
                    });
                } catch (err) {
                    console.log("Error Obj:" + err);
                }
            });
        }
    }); // END OF PRODUCT DETAILS QUICK VIEW
    
    $(document).ready(function(){
        var quickViewView = new QuickViewView({
            el: $('body')
        }); 
    });
});