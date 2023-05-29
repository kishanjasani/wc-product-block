<?php
/**
 * Plugin Name:       WC Product Block
 * Plugin URI:        https://github.com/kishanjasani/wc-product-block
 * Description:       Latest Products Grid block to render a grid with latest products.
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Version:           0.1.0
 * Author:            Kishan Jasani
 * Author URI:        https://profiles.wordpress.org/kishanjasani
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wc-products-block
 *
 * @package           kishanjasani
 */

add_action( 'admin_notices', 'kj_is_woocommerce_plugin_active' );

function kj_is_woocommerce_plugin_active() {
	// Check if WooCommerce is active.
	if ( ! is_plugin_active( 'woocommerce/woocommerce.php' ) ) {
		?>
		<div class='notice notice-error is-dismissible'>
			<p><?php esc_html_e( 'Please install WooCommerce to activate this plugin!', 'wc-products-block' ); ?></p>
		</div>
		<?php
	}
}


/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function kishan_jasani_wc_product_block_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'kishan_jasani_wc_product_block_block_init' );
