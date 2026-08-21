<?php
/**
 * Title: Decuba hero
 * Slug: decuba-tech-blog/hero
 * Categories: decuba-tech-blog
 */
?>
<!-- wp:group {"align":"full","className":"decuba-hero","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"layout":{"type":"constrained","wideSize":"1180px"}} -->
<div class="wp-block-group alignfull decuba-hero" style="padding-top:4rem;padding-bottom:4rem">
	<!-- wp:columns {"align":"wide","verticalAlignment":"center","style":{"spacing":{"blockGap":{"left":"3rem"}}}} -->
	<div class="wp-block-columns alignwide are-vertically-aligned-center">
		<!-- wp:column {"verticalAlignment":"center","width":"48%"} -->
		<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:48%">
			<!-- wp:paragraph {"className":"decuba-kicker","textColor":"azure","style":{"typography":{"fontWeight":"800"}},"fontSize":"small"} -->
			<p class="decuba-kicker has-azure-color has-text-color has-small-font-size" style="font-weight:800">AI and Microsoft technology in practice</p>
			<!-- /wp:paragraph -->

			<!-- wp:heading {"level":1,"fontSize":"xx-large"} -->
			<h1 class="wp-block-heading has-xx-large-font-size">Build smarter work with AI, Copilot, and the Microsoft cloud.</h1>
			<!-- /wp:heading -->

			<!-- wp:paragraph {"textColor":"muted","fontSize":"medium"} -->
			<p class="has-muted-color has-text-color has-medium-font-size">Decuba Tech publishes useful guides, implementation notes, and opinionated field lessons for makers, consultants, and teams working with Microsoft 365, Power Platform, Power BI, Dataverse, and modern AI tools.</p>
			<!-- /wp:paragraph -->

			<!-- wp:buttons -->
			<div class="wp-block-buttons">
				<!-- wp:button -->
				<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/category/ai/">Read AI posts</a></div>
				<!-- /wp:button -->
				<!-- wp:button {"className":"is-style-outline"} -->
				<div class="wp-block-button is-style-outline"><a class="wp-block-button__link wp-element-button" href="/category/power-platform/">Power Platform</a></div>
				<!-- /wp:button -->
			</div>
			<!-- /wp:buttons -->
		</div>
		<!-- /wp:column -->

		<!-- wp:column {"verticalAlignment":"center","width":"52%","className":"decuba-hero-image"} -->
		<div class="wp-block-column is-vertically-aligned-center decuba-hero-image" style="flex-basis:52%">
			<!-- wp:image {"sizeSlug":"full","linkDestination":"none"} -->
			<figure class="wp-block-image size-full"><img src="<?php echo esc_url( get_theme_file_uri( 'assets/images/decuba-tech-hero.png' ) ); ?>" alt="Decuba Tech AI and Microsoft technology blog visual"/></figure>
			<!-- /wp:image -->
		</div>
		<!-- /wp:column -->
	</div>
	<!-- /wp:columns -->
</div>
<!-- /wp:group -->
