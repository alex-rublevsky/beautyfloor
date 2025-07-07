<?php $categories = wp_get_object_terms($args['ID'], 'product-cat');
$category_url = '/catalog';
foreach ($categories as $category) {
    $category_url .= '/' . $category->slug;
}

?>

<div class="product__offer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    <?php bf_product_breadcrumbs($args['ID'], $args['title']); ?>
    <h1 itemprop="name" class="hidden-mb"><?php echo $args['title']; ?></h1>
    <div class="product__offer_own row vc">
        <?php if ($args['brand'] !== null) : ?>
            <a class="brand" href="<?php echo $category_url; ?>/?brands[]=<?php echo $args['brand']['id']; ?>">
                <?php if (strlen($args['brand']['logo']['src']) > 0) :
                    if ($args['brand']['logo']['ext'] === 'svg') : ?>
                        <img class="brand__logo" src="<?php echo $args['brand']['logo']['src']; ?>">
                    <?php else: ?>
                        <picture>
                            <source srcset="<?php echo $args['brand']['logo']['webp']; ?>" type="image/webp">
                            <source srcset="<?php echo $args['brand']['logo']['src']; ?>" type="image/<?php echo $args['brand']['logo']['ext'] ?>">
                            <img class="brand__logo" src="<?php echo $args['brand']['logo']['src']; ?>">
                        </picture>
                    <?php endif; ?>
                <?php else :
                    echo $args['brand']['name']; ?>
                <?php endif; ?>
            </a>
        <?php endif; ?>

        <?php if ($args['collection'] !== null) : ?>
            <a class="brand" href="<?php echo $category_url; ?>/?collections[]=<?php echo $args['collection']['id']; ?>">
                <?php if (strlen($args['collection']['logo']['src']) > 0) :
                    if ($args['collection']['logo']['ext'] === 'svg') : ?>
                        <img class="brand__logo" src="<?php echo $args['collection']['logo']['src']; ?>">
                    <?php else: ?>
                        <picture>
                            <source srcset="<?php echo $args['collection']['logo']['webp']; ?>" type="image/webp">
                            <source srcset="<?php echo $args['collection']['logo']['src']; ?>" type="image/<?php echo $args['collection']['logo']['ext'] ?>">
                            <img class="brand__logo" src="<?php echo $args['collection']['logo']['src']; ?>">
                        </picture>
                    <?php endif; ?>
                <?php else :
                    echo $args['collection']['name']; ?>
                <?php endif; ?>
            </a>
        <?php endif; ?>

        <h1 itemprop="name" class="visible-mb"><?php echo $args['title']; ?></h1>

        <?php if (strlen($args['sku']) > 1) : ?>
            <span class="sku">
                <label>Артикул:</label><span id="sku_text"><?php echo $args['sku']; ?></span>
            </span>
        <?php endif; ?>

        <?php if ($args['brand'] != null) : ?>
            <span class="hidden-mb">
                <?php if (isset($args['brand']['flag']['src'])) : ?>
                    <picture>
                        <source srcset="<?php echo $args['brand']['flag']['webp']; ?>" type="image/webp">
                        <source srcset="<?php echo $args['brand']['flag']['src']; ?>" type="image/<?php echo $args['brand']['flag']['ext'] ?>">
                        <img class="brand__flag" src="<?php echo $args['brand']['flag']['src']; ?>">
                    </picture>
                <?php endif; ?>
                <?php echo $args['brand']['country']; ?>
            </span>
        <?php endif; ?>
    </div>

    <?php include('options.php'); ?>

    <div class="product__offer_price row vc">
        <div class="price flex column" itemprop="price">
            <span>
                <span class="current">
                    <span class="value"><?php echo ($args['sale_price'] > 0) ? number_format($args['sale_price'], 0, '', '&nbsp;') : number_format($args['price'], 0, '', '&nbsp;'); ?></span>
                    <span itemprop="priceCurrency">р</span>
                </span>
                <?php if ($args['price_type'] == 'unit' && $args['quantity_unit'] != 'пог. метр') :  ?>
                    <span class="unit">| <span id="unit_count">1</span>м2<?php if ($args['in_pack'] > 0 && $args['quantity_unit'] == 'уп') : echo '/' . $args['quantity_unit'];
                                                                            endif; ?></span>
                <?php endif; ?>
            </span>
            <span<?php if ($args['sale_price'] < 1) : ?> style="display:none !important;" <?php endif; ?> id="sale_price">
                <span class="discount">-<span id="discount_value"><?php echo $args['discount']; ?></span>%</span>
                <del class="old hidden-mb"><?php echo number_format($args['price'], 0, '', '&nbsp;'); ?></del>
                </span>
        </div>
        <div class="quantity" id="product_quantity">
            <div class="quantity__count flex vc hb">
                <span class="minus">
                    <svg width="40" height="2" viewBox="0 0 40 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="40" y1="1" x2="-8.74228e-08" y2="0.999996" stroke="#ADB3BD" stroke-width="2" />
                    </svg>
                </span>
                <input type="number" min="1" step="1" pattern="[1-9]*" inputmode="numeric" value="1" />
                <span class="plus">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <path d="M20.2807 0L20.2807 40M40 20.2807L0 20.2807" stroke="#ADB3BD" stroke-width="2" />
                    </svg>
                </span>
            </div>
            <div class="quantity__unit"><?php echo $args['quantity_unit']; ?></div>
        </div>
        <?php if ($args['in_cart']) : ?>
            <a class="btn btn--add to-cart hidden-mb" href="/cart">Перейти в корзину</a>
        <?php else : ?>
            <a class="btn btn--add to-cart hidden-mb" href="#">В корзину</a>
        <?php endif; ?>
    </div>

    <div class="product__offer_notes row">
        <div class="note flex column">
            <?php if ($args['price_type'] == 'unit' && $args['quantity_unit'] != 'пог. метр') : ?>
                <p><span>Цена р/м2</span>
                    <span id="unit_price">
                        <?php echo number_format(floatval($args['active_price']), 0, '', '&nbsp;'); ?>
                    </span>
                </p>
            <?php endif; ?>
            <?php if (count($args['shop']) > 0) : ?>
                <div>Образцы доступны
                    <?php foreach ($args['shop'] as $key => $shop) : ?>
                        <a href="/contacts"><?php echo $shop->post_title; ?></a>
                        <?php if ($key < (count($args['shop']) - 1)) : ?>
                            <br />
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
        <div class="note attention flex column">
            <?php if (strlen($args['about']) > 3) : ?>
                <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.35795 22.9545V4.77273H6.5625V6.16477H3.94886V21.5625H6.5625V22.9545H2.35795Z" fill="#CB6E6E" />
                    <path d="M17.1051 5.45455L16.9205 15.8168H14.9531L14.7685 5.45455H17.1051ZM15.9403 20.1349C15.5473 20.1349 15.2112 19.9976 14.9318 19.723C14.6525 19.4437 14.5152 19.1075 14.5199 18.7145C14.5152 18.3262 14.6525 17.9948 14.9318 17.7202C15.2112 17.4408 15.5473 17.3011 15.9403 17.3011C16.3239 17.3011 16.6553 17.4408 16.9347 17.7202C17.214 17.9948 17.3561 18.3262 17.3608 18.7145C17.3561 18.9749 17.2874 19.214 17.1548 19.4318C17.027 19.6449 16.8565 19.8153 16.6435 19.9432C16.4304 20.071 16.196 20.1349 15.9403 20.1349Z" fill="#C42D21" />
                    <path d="M28.8864 4.77273V22.9545H24.6818V21.5625H27.2955V6.16477H24.6818V4.77273H28.8864Z" fill="#CB6E6E" />
                </svg>
                <?php echo apply_filters('the_content', $args['about']); ?>
            <?php endif; ?>
        </div>
    </div>
    <?php if (count($args['variants']['kits']) > 0) : ?>
        <p>Стандартная ширина материала - 1.5 метра</p>
    <?php endif; ?>
</div>
<div class="offset"></div>

<div class="mobilemenu__bottom visible-mb">
    <div class="mobilemenu__bottom_cart">
        <div class="flex vc hb">
            <span class="summ price">
                <span class="current">
                    <span class="value"><?php echo ($args['sale_price'] > 0) ? number_format($args['sale_price'], 0, '', '&nbsp;') : number_format($args['price'], 0, '', '&nbsp;'); ?></span>
                    <span itemprop="priceCurrency">р</span>
                </span>
                <?php if ($args['price_type'] == 'unit') :  ?>
                    <span class="unit">| <span id="unit_count">1</span>м2<?php if ($args['in_pack'] > 0 && $args['quantity_unit'] == 'уп') : echo '/' . $args['quantity_unit'];
                                                                            endif; ?></span>
                <?php endif; ?>
            </span>
            <a class="btn to-cart">В корзину</a>
        </div>
    </div>
    <div class="mobilemenu__bottom_main">
        <div class="flex vc hb">
            <a href="/">Главная</a>
            <a class="show-menu" data-menu-id="mobile_catalog">Каталог</a>
            <a class="cart__popup" href="/cart">
                <svg width="32" height="30" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.7124 2.06897H0V0H5.49762C5.9616 0 6.36858 0.310243 6.49242 0.758358L11.2958 18.1385C11.5435 19.0347 12.3575 19.6552 13.2854 19.6552H24.4566C25.3544 19.6552 26.1493 19.0736 26.4229 18.2166L29.5537 8.40934H17.6091V6.34038H30.9677C31.2973 6.34038 31.6071 6.49812 31.8015 6.76491C31.9958 7.0317 32.0513 7.37546 31.9509 7.69007L28.3893 18.8471C27.8421 20.561 26.2523 21.7241 24.4566 21.7241H13.2854C11.4295 21.7241 9.8016 20.4832 9.30621 18.6907L4.7124 2.06897Z" fill="#C42D21" />
                    <path d="M14.4516 27.4138C14.4516 28.8421 13.2962 30 11.871 30C10.4457 30 9.29032 28.8421 9.29032 27.4138C9.29032 25.9855 10.4457 24.8276 11.871 24.8276C13.2962 24.8276 14.4516 25.9855 14.4516 27.4138Z" fill="#C42D21" />
                    <path d="M27.871 27.4138C27.871 28.8421 26.7156 30 25.2903 30C23.8651 30 22.7097 28.8421 22.7097 27.4138C22.7097 25.9855 23.8651 24.8276 25.2903 24.8276C26.7156 24.8276 27.871 25.9855 27.871 27.4138Z" fill="#C42D21" />
                </svg>
                <span class="cart__count" <?php if ($args['cart']['count'] < 1) : ?> style="display:none;" <?php endif; ?>>
                    <?php echo $args['cart']['count']; ?>
                </span>
            </a>
        </div>
    </div>
</div>