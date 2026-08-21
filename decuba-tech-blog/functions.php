<?php
/**
 * Decuba Tech Blog theme setup.
 *
 * @package DecubaTechBlog
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function decuba_tech_blog_setup() {
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'style.css' );
}
add_action( 'after_setup_theme', 'decuba_tech_blog_setup' );

function decuba_tech_blog_enqueue_styles() {
	wp_enqueue_style(
		'decuba-tech-blog-style',
		get_stylesheet_uri(),
		array(),
		wp_get_theme()->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'decuba_tech_blog_enqueue_styles' );

function decuba_tech_blog_register_patterns() {
	register_block_pattern_category(
		'decuba-tech-blog',
		array( 'label' => __( 'Decuba Tech Blog', 'decuba-tech-blog' ) )
	);
}
add_action( 'init', 'decuba_tech_blog_register_patterns' );

function decuba_tech_blog_register_block_styles() {
	register_block_style(
		'core/post-terms',
		array(
			'name'  => 'decuba-pills',
			'label' => __( 'Decuba pills', 'decuba-tech-blog' ),
		)
	);
}
add_action( 'init', 'decuba_tech_blog_register_block_styles' );
