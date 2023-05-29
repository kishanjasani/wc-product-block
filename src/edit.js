/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { Spinner, PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import { useEffect, useState, RawHTML } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		grid_gap,
		sale_tag,
		product_title,
		product_price,
		add_to_cart,
		product_title_color,
		product_price_color,
		add_to_cart_btn_text_color,
		add_to_cart_btn_bg_color
	} = attributes;

	const [ products, setProducts ] = useState( [] );

	// Fetch latest products from WooCommerce.
	const fetchProducts = async () => {
		try {
			const queryParams = { per_page: 20 }; // Return posts with ID = 1,2,3.

			const response = await apiFetch( { path: addQueryArgs( '/wc/v3/products', queryParams ) } );
			setProducts( response );
		} catch ( error ) {
			console.error( error );
		}
	};

	// Call the fetchProducts function when the block is loaded or attributes are updated.
	useEffect( () => {
		fetchProducts();
	}, [] );

	if ( ! products.length ) {
		return (
			<div { ...useBlockProps() }>
				<Spinner />
			</div>
		);
	}

	if ( ! products.length ) {
		return (
			<div { ...useBlockProps() }>
				{ ' ' }
				{ __( 'No product found.', 'wc-products-block' ) }
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody>
					{/* Grid Gap */}
					<RangeControl
						label={ __( 'Grid Gap', 'wc-products-block' ) }
						value={ grid_gap }
						onChange={ ( value ) => setAttributes( { grid_gap: value } ) }
						min={ 5 }
						max={ 50 }
					/>

					{/* Show Sale Tag */}
					<ToggleControl
						label={ __( 'Show Sale Tag', 'wc-products-block' ) }
						checked={ sale_tag }
						onChange={ ( value ) => setAttributes( { sale_tag: value } ) }
					/>

					{/* Show Product Title */}
					<ToggleControl
						label={ __( 'Show Product Title', 'wc-products-block' ) }
						checked={ product_title }
						onChange={ ( value ) => setAttributes( { product_title: value } ) }
					/>

					{/* Show Product Price */}
					<ToggleControl
						label={ __( 'Show Product Price', 'wc-products-block' ) }
						checked={ product_price }
						onChange={ ( value ) => setAttributes( { product_price: value } ) }
					/>

					{/* Show Add To Cart Button */}
					<ToggleControl
						label={ __( 'Show Add To Cart Button', 'wc-products-block' ) }
						checked={ add_to_cart }
						onChange={ ( value ) => setAttributes( { add_to_cart: value } ) }
					/>

					{/* Product Title Color */}
					{ product_title && (
						<PanelColorSettings
							title={ __( 'Product Title Color', 'wc-products-block' ) }
							colorSettings={ [
							{
								value: product_title_color,
								onChange: ( value ) => setAttributes( { product_title_color: value } ),
								label: __( 'Product Title Color', 'wc-products-block' ),
							},
							] }
						/>
					) }

					{/* Product Price Color */}
					{ product_price && (
						<PanelColorSettings
							title={ __( 'Product Price Color', 'wc-products-block' ) }
							colorSettings={ [
							{
								value: product_price_color,
								onChange: ( value ) => setAttributes( { product_price_color: value } ),
								label: __( 'Product Price Color', 'wc-products-block' ),
							},
							] }
						/>
					) }

					{/* Product Button Text Color and Background Color */}
					{ add_to_cart && (
						<PanelColorSettings
							title={ __( 'Add to cart Button Colors', 'wc-products-block' ) }
							colorSettings={
								[
									{
										value: add_to_cart_btn_text_color,
										onChange: ( value ) => setAttributes( { add_to_cart_btn_text_color: value } ),
										label: __( 'Add to cart Text Color', 'wc-products-block' ),
									},
									{
										value: add_to_cart_btn_bg_color,
										onChange: ( value ) => setAttributes( { add_to_cart_btn_bg_color: value } ),
										label: __( 'Add to cart Background Color', 'wc-products-block' ),
									},
								]
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>
			<ul { ...useBlockProps() } style={ { gridGap: `${ grid_gap }px` } }>
				{ products && products.map( ( product ) => {
					const productType = product?.type ?? '';

					return (
						<li key={product.id}>
							<div className='product'>
								<img src={ product?.images?.[0]?.src ?? '' } alt={ product?.images?.[0]?.alt ?? '' } />
								{
									( product.on_sale && sale_tag ) ? <span className="onsale"> { __( 'Sale!', 'wc-products-block' ) } </span> : null
								}
							</div>
							{
								product_title ? <h3 style={{ color: product_title_color }}><RawHTML>{ product.name }</RawHTML></h3> : null
							}
							{
								product_price ? <RawHTML style={{ color: product_price_color }}>{ product.price_html }</RawHTML> : null
							}

							{
								add_to_cart ?
									'external' === productType ?
										<a target="_blank"
											style={{ backgroundColor: add_to_cart_btn_bg_color, color: add_to_cart_btn_text_color }}
											href={ product?.external_url ?? '' }
											className={ `button product_type_${ productType }` }>
												{ product?.button_text ?? '' }
										</a> :
										<a
											style={{ backgroundColor: add_to_cart_btn_bg_color, color: add_to_cart_btn_text_color }}
											className={ `button product_type_${ productType } add_to_cart_button ajax_add_to_cart` }
										>
											{ __( 'Add To Cart', 'wc-products-block' ) }
										</a>
								: null
							}
						</li>
					)
				} ) }
			</ul>
		</>
	);
}
