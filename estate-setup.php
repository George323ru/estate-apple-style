<?php
/**
 * Plugin Name: Estate Apple Style Setup
 * Description: Registers 'Estate' CPT and ACF Fields.
 * Version: 1.0
 */

add_action('init', 'eas_register_estate_cpt');
function eas_register_estate_cpt()
{
    $labels = array(
        'name' => 'Estates',
        'singular_name' => 'Estate',
        'menu_name' => 'Estates',
        'add_new' => 'Add New',
        'add_new_item' => 'Add New Estate',
        'edit_item' => 'Edit Estate',
        'new_item' => 'New Estate',
        'view_item' => 'View Estate',
        'search_items' => 'Search Estates',
        'not_found' => 'No estates found',
        'not_found_in_trash' => 'No estates found in Trash',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-building',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'show_in_rest' => true, // Important for API!
        'rest_base' => 'estates',
    );

    register_post_type('estates', $args);
}

if (function_exists('acf_add_local_field_group')):

    acf_add_local_field_group(array(
        'key' => 'group_estate_details',
        'title' => 'Estate Details',
        'fields' => array(
            array(
                'key' => 'field_price',
                'label' => 'Price (Displayed)',
                'name' => 'price',
                'type' => 'text',
            ),
            array(
                'key' => 'field_price_val',
                'label' => 'Price (Numeric)',
                'name' => 'price_val',
                'type' => 'number',
            ),
            array(
                'key' => 'field_location',
                'label' => 'Location',
                'name' => 'location',
                'type' => 'text',
            ),
            array(
                'key' => 'field_city',
                'label' => 'City',
                'name' => 'city',
                'type' => 'text',
            ),
            array(
                'key' => 'field_specs',
                'label' => 'Specs (JSON)',
                'name' => 'specs',
                'type' => 'textarea',
                'instructions' => 'Paste raw JSON for specs/tags or convert to repeater later.',
            ),
            array(
                'key' => 'field_image_urls',
                'label' => 'Gallery Images',
                'name' => 'image_urls',
                'type' => 'gallery',
                'return_format' => 'url',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'estates',
                ),
            ),
        ),
        'show_in_rest' => true,
    ));

    acf_add_local_field_group(array(
        'key' => 'group_post_details',
        'title' => 'Blog Post Details',
        'fields' => array(
            array(
                'key' => 'field_related_service_link',
                'label' => 'Related Service Link',
                'name' => 'related_service_link',
                'type' => 'text',
                'instructions' => 'e.g. /buy-new',
            ),
            array(
                'key' => 'field_related_service_label',
                'label' => 'Related Service Label',
                'name' => 'related_service_label',
                'type' => 'text',
                'instructions' => 'e.g. Каталог новостроек',
            ),
        ),
        'location' => array(
            array(
                array(
                    'param' => 'post_type',
                    'operator' => '==',
                    'value' => 'post',
                ),
            ),
        ),
        'show_in_rest' => true,
    ));

endif;
