var bfProductClass = function($) {

    var _this = this;

    this.windowWidth = $(window).width();
    this.ajaxUrl = siteUrl + '/wp-admin/admin-ajax.php';

    this.options = $('.option__item').not('.disable');
    this.paramOptions = $('.param-option');
    this.paramsItems = this.paramOptions.find('.option__item');
    this.unitedParam = $('#united_param');
    this.skuElem = $('#sku_text');

    this.thumbsSwiper = null;
    this.productSwiper = null;

    this.init = function(){
        this.paramsOptionsInit();
        this.optionsBlockInit();
        this.productSliderInit();
        this.calcOptionPrice();
        this.addInCartInit();

        var $productQuantity = $('#product_quantity');
        $productQuantity.find('span').on('click', function () {
            setTimeout(function () {
                _this.calcOptionPrice();
            }, 50);
        });
        $productQuantity.find('input').on('change', function () {
            setTimeout(function () {
                _this.calcOptionPrice();
            }, 50);
        });

        $('[data-fancybox="gallery"]').fancybox({
            buttons: [
                "close"
            ],
            infobar: false,
            loop: true,
            thumbs : {
                autoStart : true
            },
            wheel: "auto",
        })
    }

    this.paramsOptionsInit = function () {
        _this.paramsItems.on('click', function (){
            let $selected = $(this),
                paramId = $(this).attr('data-param-id'),
                price =  $(this).attr('data-price'),
                oldPrice = $(this).attr('data-oldprice'),
                sku = $(this).attr('data-sku'),
                group = $(this).attr('data-group');


            if (!$(this).hasClass('active')) {

                $(this).parents('.param-option').find('.option__item').removeClass('active');
                $(this).addClass('active');

                if (paramsKits) {
                    _this.detectActiveKit();
                }
                else {
                    activePrice = price;
                    if (oldPrice > 0) {
                        normalPrice = oldPrice;
                    }
                    if (sku.length > 1) {
                        _this.skuElem.text(sku);
                    }
                    _this.updateSwipes(paramId);
                    _this.calcOptionPrice();
                }
            }
           /*  if (!$(this).hasClass('active')) {
                _this.skuElem.text(normalSku);

                $(this).parents('.param-option').find('.option__item').removeClass('active');
                $(this).addClass('active');

                if (paramsKits) {
                    _this.paramsItems.removeClass('in-kit');
                    var $activeColor = $('#colors_option').find('.active');

                    let allKits = '';
                    $selected.parent('.row').find('.option__item').removeClass('active');
                    $selected.addClass('active');
                    var $activeParams = _this.paramOptions.find('.option__item').not('.disable').not('.empty');
                    $activeParams.each(function (item, param) {
                        if (_this.paramsInColor($(param), $selected)) {
                            allKits += $(param).attr('data-group') + ';';
                        }
                    })
                    _this.unitedParam.attr('data-group', allKits);
                    $activeParams.each(function (item, param) {
                        if (!_this.paramsInColor($(param), $selected)) {
                            $(param).removeClass('active');
                        }
                        else {
                            $(param).addClass('in-kit');
                        }
                    })
                    var checkParamId = $selected.parents('.option').attr('data-param-id');

                    _this.paramOptions.not('[data-param-id="'+ checkParamId +'"]').each(function (indx, option) {
                        let $optionActive = $(option).find('.active');
                        if (!_this.paramsInColor($optionActive, _this.unitedParam, true)) {
                            $optionActive.removeClass('active');
                            $optionActive.removeClass('in-kit');
                            $(option).find('.in-kit').first().addClass('active');
                        }
                    })

                    setTimeout(function () {
                        _this.detectActiveKit();
                    }, 50)
                }
                else {
              }
            } */

        });
    }

    this.optionsBlockInit = function () {
        var splitParams = false;
        if (paramsKits) {
            _this.paramOptions.find('.option__item:first-child').addClass('active');
            _this.detectActiveKit();
        }
        else {
            _this.paramOptions.find('.option__item:first-child').trigger('click');
        }

    }

    this.paramsInColor = function ($option, $color, chekFull = false) {
        let result = false,
            notIn = 0;
        if ($color.length && $option.length) {
            let colorGroup = $color.attr('data-group'),
                optionGroup = $option.attr('data-group');
            if (chekFull) {
                colorGroup = (colorGroup.indexOf(';') < 0) ? [colorGroup] : colorGroup.split(';');
                for (var i = 0; i < colorGroup.length; i++) {
                    if (colorGroup[i].length > 1) {
                        if (optionGroup.indexOf(colorGroup[i]) < 0) {
                            notIn++;
                        }
                    }
                }
                if (notIn < 1) {
                    result = true;
                }
            }
            else {
                optionGroup = (optionGroup.indexOf(';') < 0) ? [optionGroup] : optionGroup.split(';');
                for (var i = 0; i < optionGroup.length; i++) {
                    if (colorGroup.indexOf(optionGroup[i]) >= 0) {
                        selectedKit = optionGroup[i];
                        result = true;
                    }
                }
            }
        }
        return result;
    }

    this.detectActiveKit = function () {
        var allKits = [],
            entryArr = [];

        $('.option__item.active').each(function () {
            let optionKit = $(this).attr('data-group').split(';');
            allKits.push(optionKit[0].split(','));
        });
        let matched = allKits[0].filter( el => allKits[1].indexOf( el ) > -1 );
        let kitPrices = paramsKits[parseInt(matched[0].replace('k-', ''))];
        if (kitPrices['price'] > 0 && kitPrices['old_price'] > 0) {
            activePrice = kitPrices['price'];
            normalPrice = kitPrices['old_price'];
        }
        if (kitPrices['price'] > 1 && kitPrices['old_price'] < 1) {
            activePrice = kitPrices['price'];
            normalPrice = kitPrices['price'];
        }
        if (kitPrices['sku'].length > 1) {
            _this.skuElem.text(kitPrices['sku']);
        }
        _this.calcOptionPrice();
    }

    this.productSliderInit = function () {
        var $slider = $('#product_slider'),
            $thumbs = $('#thumbs_slider'),
            $thumbsNavigate = $('.product__slider_thumbs').find('.navs');
        if ($slider.length && $slider.find('.swiper-slide').length > 1) {
            _this.thumbsSwiper = new Swiper('#thumbs_slider', {
                loop: true,
                direction: (_this.windowWidth > 1600) ? 'vertical' : 'horizontal',
                slidesPerView: 7,
                slideToClickedSlide: true,
                mousewheel: false,
                //parallax: true
            });
            _this.productSwiper = new Swiper('#product_slider', {
                loop: true,
                slidesPerView: 1,
                thumbs: {
                    swiper: _this.thumbsSwiper,
                    slideThumbActiveClass: 'active'
                },
                mousewheel: true,
                grabCursor: true,
                on: {
                    slideNextTransitionStart: function (swiper) {
                        let activeIndex = parseInt(swiper.realIndex + 1);
                        $slider.find('.count .current').text(activeIndex);
                    }
                }
            });
            $thumbsNavigate.find('.prev').on('click', function () {
                _this.thumbsSwiper.slidePrev();
            })
            $thumbsNavigate.find('.next').on('click', function () {
                _this.thumbsSwiper.slideNext();
            })

            $(window).on('resize', function () {
                if ($(this).width() <= 1600) {
                    _this.thumbsSwiper.changeDirection('horizontal');
                }
                else {
                    _this.thumbsSwiper.changeDirection('vertical');
                }
            });
        }
    }

    this.updateSwipes = function(option) {
        var $thumbsSlider = $('#thumbs_slider'),
            $mainSlides = $('#main_slides'),
            selectedSlides = [];

        $thumbsSlider.find('.swiper-slide').each(function () {
            var slideColorId = $(this).attr('data-color-id'),
                slideParamId = $(this).attr('data-param-id'),
                slideIndex = parseInt($(this).attr('data-slide-index'));
            if (slideColorId === option || slideParamId === option) {
                selectedSlides.push(slideIndex);
            }
        });
        setTimeout(function () {
            if (selectedSlides.length > 0) {
                _this.thumbsSwiper.slideTo(selectedSlides[0]);
                _this.productSwiper.slideTo(selectedSlides[0]);
            }
        }, 50);

    }

    this.calcOptionPrice = function () {
        let $priceBlock = $('.price'),
            $discount = $('.discount'),
            $discountValue = $('#discount_value'),
            $unitPrice = $('#unit_price');

        function decimalAdjust(type, value, exp) {
            if (typeof exp === "undefined" || +exp === 0) {
                return Math[type](value);
            }
            value = +value;
            exp = +exp;
            if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
                return NaN;
            }
            value = value.toString().split("e");
            value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
            value = value.toString().split("e");
            return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
        }

        if (!Math.ceil10) {
            Math.ceil10 = function (value, exp) {
                return decimalAdjust("ceil", value, exp);
            };
        }

        let $quantityInput = $('#product_quantity').find('input'),
            productLength = parseInt($quantityInput.val()),
            productPrice,
            productNormalPrice;

        if (parseInt($quantityInput.val()[0]) === 0 && $quantityInput.val().length > 1) {
            $quantityInput.val($quantityInput.val()[1]).change();
            return false;
        }
        if (productLength < 1) {
            $quantityInput.val(1).change();
            return false;
        }

        if ($priceBlock.length) {
            if (priceType === 'unit') {
                let $widthParam = $('[data-param-id="72"]');
                if ($widthParam.length) productWidth = parseFloat($widthParam.find('.active').text());

                let productSquare = (squareInPack > 0) ? productLength * squareInPack : parseInt(productLength);

                productPrice = Math.ceil(activePrice * productSquare);
                productNormalPrice = normalPrice * productSquare;

                if (productPrice === 0) productPrice = activePrice;
                $priceBlock.find('#unit_count').text(productSquare.toFixed(3));
                if ($unitPrice.length) {
                    $unitPrice.text(activePrice).toString();
                }
            }
            else {
                productPrice = Math.ceil(activePrice * productLength);
                productNormalPrice = Math.ceil(normalPrice * productLength);
            }
        }
        let discount = Math.ceil(100 - (productPrice * 100) / productNormalPrice);
        $discountValue.text(discount).show();
        $discount.show();
        $priceBlock.find('.current .value').text(productPrice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 "));
        $priceBlock.find('.old').text(productNormalPrice.toFixed(2)).show();
        if (productPrice === productNormalPrice) {
            $priceBlock.find('.old').hide();
            $discount.hide();
        }
    };

    this.addInCartInit = function () {
        var $toCartBtn = $('.to-cart'),
            $cartCount = $('.cart__count'),
            $unitPrice = $('#unit_price'),
            $unitCount = $('#unit_count'),
            $colorOption = $('#colors_option'),
            $discount = $('#discount_value'),
            $productPrice = $('.product__offer_price'),
            cartData = {},
            productData = {},
            cartValue;

        $toCartBtn.on('click', function () {
            cartValue = Cookies.get('cart_count');
            if (cartValue === undefined) cartValue = 0;
            cartValue = parseInt(cartValue);

            if (!$(this).hasClass('added')) {}
            let params = {};
            productData.id = $('.product').attr('data-product-id');
            productData.quantity = parseInt($('.product__offer_price').find('.quantity__count input').val());

            productData.total = parseInt($productPrice.find('.current .value').text().replace(/\s+/g, ''));

            if ($unitPrice.length) {
                productData.unit_price = parseInt($unitPrice.text().replace(/\s+/g, ''));
            }
            if ($unitCount.length) {
                productData.unit_count = squareInPack;
            }
            if ($colorOption.length) {
                productData.color = $colorOption.find('.option__item.active').attr('data-color-id');
            }
            productData.discount = ($discount.length) ? parseInt($discount.text()) : 0

            if (paramsKits) {
                productData.kit = selectedKit;
            }
            //productData.price = parseInt($productPrice.find('.current .value').text().replace(/\s/g, ''));

            productData.price = activePrice;
            productData.normal_price = normalPrice;
            $('.param-option').each(function () {
                let paramId = $(this).attr('data-param-id'),
                    selectedId = $(this).find('.option__item.active').attr('data-param-id');
                params[paramId] = selectedId;
            });
            productData.params = params;
            cartData = Cookies.get('cart_data');
            if (cartData === undefined) {
                cartData = {};
                cartData[productData.id] = productData;
                Cookies.set('cart_data', JSON.stringify(cartData), { expires: 7 })
                cartValue = parseInt(cartValue + 1);
            }
            else {
                cartData = JSON.parse(cartData);

                if (productData.id in cartData) {
                    updateProductInCart(productData.id);
                }
                else {
                    cartData[productData.id] = productData;
                    Cookies.set('cart_data', JSON.stringify(cartData), { expires: 7 });
                    cartValue = parseInt(cartValue + 1);
                }
            }
            if (!paramsKits) {
                //$(this).addClass('added').text('Перейти в корзину');
            }
            $cartCount.text(cartValue).show();
            Cookies.set('cart_count', cartValue, { expires: 7 })
        });

        function updateProductInCart(key) {
            let likeness = 0,
                likenessIndex,
                isArray = Array.isArray(cartData[key]);
            if (isArray) {
                for (var skey in cartData[key]) {
                    if (JSON.stringify(cartData[key][skey].params) === JSON.stringify(productData.params)) {
                        likeness++;
                        likenessIndex = skey;
                    }
                }
            }
            else {
                if (JSON.stringify(cartData[key].params) === JSON.stringify(productData.params)) {
                    likeness++;
                }
            }
            if (likeness === 0) {
                if  (isArray) {
                    cartData[key].push(productData);
                }
                else {
                    cartData[key] = [cartData[key], productData];
                }
                cartValue = parseInt(cartValue + 1);
                Cookies.set('cart_data', JSON.stringify(cartData), { expires: 7 });
            }
            else {
                if (isArray) {
                    cartData[key][likenessIndex].quantity = parseInt(cartData[key][likenessIndex].quantity) + productData.quantity;
                    cartData[key][likenessIndex].total = parseInt(cartData[key][likenessIndex].total) + productData.total;
                }
                else {
                    cartData[key].quantity = cartData[key].quantity + productData.quantity;
                    cartData[key].total = parseInt(cartData[key].total) + productData.total;
                }
                Cookies.set('cart_data', JSON.stringify(cartData), { expires: 7 })
            }
        }
    }

};

(function($){
    $(document).ready(function(){
        const bfProduct = new bfProductClass($);
        bfProduct.init();
    });

})(jQuery);