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
                "permalink" => get_the_permalink()
            ));
        }

        if ($postType == "professor") {
            array_push($results["professors"], array(
                "title" => get_the_title(),
                "permalink" => get_the_permalink()
            ));
        }

        if ($postType == "program") {
            array_push($results["programs"], array(
                "title" => get_the_title(),
                "permalink" => get_the_permalink()
            ));
        }

        if ($postType == "campus") {
            array_push($results["campuses"], array(
                "title" => get_the_title(),
                "permalink" => get_the_permalink()
            ));
        }

        if ($postType == "event") {
            array_push($results["events"], array(
                "title" => get_the_title(),
                "permalink" => get_the_permalink()
            ));
        }
    }

    return $results;
}

?>