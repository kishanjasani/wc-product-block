<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if ( ! class_exists( 'WC_Product_Query' ) ) {
	return;
}

$query = new WC_Product_Query(
	[
		'limit'   => 20,
		'orderby' => 'date',
		'order'   => 'DESC',
	]
);

$latest_products = $query->get_products();
?>
<ul <?php echo get_block_wrapper_attributes(); ?> style='grid-gap:<?php echo esc_attr( $attributes['grid_gap'] ); ?>px;'>
	<?php
	foreach ( $latest_products as $product ) {
		// Access product information
		$product_id    = $product->get_id();
		$product_name  = $product->get_name();
		$product_name  = $product_name ? $product_name : __( '(No title)', 'wc-products-block' );
		$product_price = $product->get_price_html();
		$product_image = $product->get_image();

		// Output product details
		echo '<li>';
		echo '<div class="product">';
			echo $product_image;
			if ( $product->is_on_sale() && $attributes['sale_tag'] ) {
				echo '<span class="onsale">' . esc_html__( 'Sale!', 'wc-products-block' ) . '</span>';
			}
		echo '</div>';
		if ( $attributes['product_title'] ) {
			printf( '<h3 style="color:%s;">%s</h3>', $attributes['product_title_color'], $product_name );
		}

		if ( $attributes['product_price'] ) {
			printf( '<p style="color:%s;">%s</p>', $attributes['product_price_color'], $product_price );
		}

		if ( $attributes['add_to_cart'] ) {
			printf(
				'<a href="%s" data-quantity="1" class="%s" %s style="background-color:%s; color:%s;">%s</a>',
				esc_url( $product->add_to_cart_url() ),
				esc_attr(
					implode(
						' ',
						array_filter(
							[
								'button',
								'product_type_' . $product->get_type(),
								$product->is_purchasable() && $product->is_in_stock() ? 'add_to_cart_button' : '',
								$product->supports( 'ajax_add_to_cart' ) ? 'ajax_add_to_cart' : '',
							]
						)
					)
				),
				wc_implode_html_attributes(
					[
						'data-product_id'  => $product->get_id(),
						'data-product_sku' => $product->get_sku(),
						'aria-label'       => $product->add_to_cart_description(),
						'rel'              => 'nofollow',
					]
				),
				$attributes['add_to_cart_btn_bg_color'],
				$attributes['add_to_cart_btn_text_color'],
				esc_html( $product->add_to_cart_text() )
			);
		}
		echo '</li>';
	}
	?>
</ul>
