<?php

add_action("rest_api_init", "universityRegisterSearch");

function universityRegisterSearch()
{
    register_rest_route("university/v1", "search", array(
        "methods" => WP_REST_SERVER::READABLE,
        "callback" => "universitySearchResults"
    ));
}

function universitySearchResults($data)
{
    $mainQuery = new WP_Query(array(
        "post_type" => array("post", "page", "professor", "program", "campus", "event"),
        "s" => sanitize_text_field($data["term"])
    ));

    $results = array(
        "generalInfo" => array(),
        "professors" => array(),
        "programs" => array(),
        "campuses" => array(),
        "events" => array(),
    );

    while ($mainQuery->have_posts()) {
        $mainQuery->the_post();

        $postType = get_post_type();

        if ($postType == "post" or $postType == "page") {
            array_push($results["generalInfo"], array(
                "title" => get_the_title(),
                "permalink" => esc_url(get_the_permalink()),
                "postType" => get_post_type(),
                "authorName" => get_the_author()
            ));
        }

        if ($postType == "professor") {
            array_push($results["professors"], array(
                "title" => get_the_title(),
                "permalink" => esc_url(get_the_permalink()),
                "image" => get_the_post_thumbnail_url(0, "professorLandscape")
            ));
        }

        if ($postType == "program") {
            $relatedCampuses = get_field("related_campus");

            if ($relatedCampuses) {
                foreach ($relatedCampuses as $campus) {
                    array_push($results["campuses"], array(
                        "title" => get_the_title($campus),
                        "permalink" => esc_url(get_the_permalink($campus))
                    ));
                }
            }

            array_push($results["programs"], array(
                "id" => get_the_ID(),
                "title" => get_the_title(),
                "permalink" => esc_url(get_the_permalink())
            ));
        }

        if ($postType == "campus") {
            array_push($results["campuses"], array(
                "title" => get_the_title(),
                "permalink" => esc_url(get_the_permalink())
            ));
        }

        if ($postType == "event") {
            $eventDate = new DateTime(get_field("event_date"));

            $description = "";
            if (has_excerpt()) {
                $description = get_the_excerpt();
            } else {
                $description = wp_trim_words(get_the_content(), 18);
            }

            array_push($results["events"], array(
                "title" => get_the_title(),
                "permalink" => esc_url(get_the_permalink()),
                "month" => $eventDate->format("M"),
                "day" => $eventDate->format("d"),
                "description" => $description
            ));
        }
    }

    if ($results["programs"]) {
        $programsMetaQuery = array("relation" => "OR");

        foreach ($results["programs"] as $program) {
            array_push($programsMetaQuery, array(
                "key" => "related_programs",
                "compare" => "LIKE",
                "value" => '"' . $program["id"] . '"'
            ));
        }

        $programRelationshipQuery = new WP_Query(array(
            "post_type" => array("professor", "event"),
            "meta_query" => $programsMetaQuery
        ));

        while ($programRelationshipQuery->have_posts()) {
            $programRelationshipQuery->the_post();

            $postType = get_post_type();

            if ($postType == "professor") {
                array_push($results["professors"], array(
                    "title" => get_the_title(),
                    "permalink" => esc_url(get_the_permalink()),
                    "image" => get_the_post_thumbnail_url(0, "professorLandscape")
                ));
            }

            if ($postType == "event") {
                $eventDate = new DateTime(get_field("event_date"));

                $description = "";
                if (has_excerpt()) {
                    $description = get_the_excerpt();
                } else {
                    $description = wp_trim_words(get_the_content(), 18);
                }

                array_push($results["events"], array(
                    "title" => get_the_title(),
                    "permalink" => esc_url(get_the_permalink()),
                    "month" => $eventDate->format("M"),
                    "day" => $eventDate->format("d"),
                    "description" => $description
                ));
            }
        }

        $results["professors"] = array_values(array_unique($results["professors"], SORT_REGULAR));
        $results["events"] = array_values(array_unique($results["events"], SORT_REGULAR));
    }

    return $results;
}

?>