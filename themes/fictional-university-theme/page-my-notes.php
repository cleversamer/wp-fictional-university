<?php

if (!is_user_logged_in()) {
    wp_redirect(esc_url(site_url("/")));
    exit;
}

get_header();

while (have_posts()) {
    the_post();
    pageBanner();
    ?>

    <div class="container container--narrow page-section">
        <ul id="my-notes" class="min-list link-list">
            <?php
            $userNotes = new WP_Query(array(
                "post_type" => "note",
                "posts_per_page" => -1,
                "author" => get_current_user_id()
            ));

            while ($userNotes->have_posts()) {
                $userNotes->the_post(); ?>

                <li>
                    <input class="note-title-field" type="text" value="<?php echo esc_attr(get_the_title()); ?>" />

                    <span class="edit-note">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                        <span>Edit</span>
                    </span>

                    <span class="delete-note">
                        <i class="fa fa-trash-o" aria-hidden="true"></i>
                        <span>Delete</span>
                    </span>

                    <textarea class="note-body-field"><?php echo esc_attr(wp_strip_all_tags(get_the_content())); ?></textarea>
                </li>

            <?php }
            ?>
        </ul>
    </div>

    <?php
}

get_footer();
?>