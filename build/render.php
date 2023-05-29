<?php
/**
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

$query = new WC_Product_Query(
	[
		'limit'   => 10,
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
		$product_id         = $product->get_id();
		$product_name       = $product->get_name();
		$product_name       = $product_name ? $product_name : __( '(No title)', 'wc-products-block' );
		$product_sale_price = $product->get_sale_price();
		$product_reg_price  = $product->get_regular_price();
		$product_price      = ! empty( $product_sale_price ) ? wc_format_sale_price( $product_reg_price, $product_sale_price ) : wc_price( $product_reg_price );
		$product_image      = $product->get_image();

		// Output product details
		echo '<li>';
		echo '<div>' . $product_image . '</div>';
		echo '<div>' . $product_name . '</div>';
		echo '<div>' . $product_price . '</div>';
		echo '</li>';
	}
	?>
</ul>
