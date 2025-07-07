<?php include('header.php'); ?>

<?php if (have_posts()) : ?>
    <?php while (have_posts()) : the_post();
        $product = bf_get_product($post->ID);
        $product['in_cart'] = false;
        $product['cart'] = $theme['cart'];

        //$product['in_cart'] = (array_key_exists($post->ID, $theme['cart']['data'])) ? true : false; 
    ?>

        <section class="product" itemscope itemtype="http://schema.org/Product" data-product-id="<?php echo $post->ID; ?>">
            <div class="product__top">
                <div class="container">
                    <div class="row">
                        <?php get_template_part('parts/product/slider', null, $product);  ?>
                        <?php get_template_part('parts/product/offer', null, $product);  ?>
                    </div>
                </div>
            </div>
            <?php if (strlen($product['description']) > 3) : ?>
                <div class="container visible-mb">
                    <div class="product__info_right">
                        <h2 class="h1">Описание</h2>
                        <?php echo apply_filters('the_content', $product['description']); ?>
                    </div>
                </div>
                <div class="offset"></div>
            <?php endif; ?>
            <div class="product__info">
                <div class="container">
                    <div class="row hb">
                        <?php get_template_part('parts/product/properties', null, $product);  ?>
                        <?php get_template_part('parts/product/description', null, $product);  ?>
                    </div>
                </div>
            </div>
            <script>
                var priceType = '<?php echo $product['price_type']; ?>',
                    baseActivePrice = <?php echo $product['active_price']; ?>,
                    baseNormalPrice = <?php echo $product['price']; ?>,
                    activePrice = <?php echo $product['active_price']; ?>,
                    normalPrice = <?php echo $product['price']; ?>,
                    squareInPack = <?php echo str_replace(',', '.', $product['in_pack']); ?>,
                    productWidth = 1.5,
                    normalSku = '<?php echo $product['sku']; ?>';

                <?php if (count($product['variants']['kits']) > 0) : ?>
                    var paramsKits = {
                            <?php foreach ($product['variants']['kits'] as $key => $kit) : echo $key . ': {"price" : ' . $kit['price'] . ', "old_price" : ' .   $kit['old_price'] . ', "sku" : "' . $kit['sku'] . '"}, ';
                            endforeach; ?>
                        },
                        selectedKit = null;
                <?php else : ?>
                    var paramsKits = false;
                <?php endif; ?>
            </script>
        </section>
        <div class="offset"></div>
        <?php get_template_part('parts/catalog/recents', null, $theme);  ?>
    <?php endwhile; ?>

<?php else :  ?>
    <div class="container">
        <h1>Товар не найден</h1>
    </div>
<?php endif; ?>

<style>
    @media all and (max-width: 768px) {
        .header__main {
            display: none;
        }
    }
</style>
<?php include('footer.php'); ?>